import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { $Enums, Prisma, Segment, Source } from '@prisma/client';
import lodash from 'lodash';

import { NotFoundException, UnknownErrorException } from '../errors';
import {
  DataType,
  operatorMapper,
  Operators,
  SegmentFilter,
  SegmentFilterRule,
} from './type';
import { ISearchVariables } from '../type';
import { PrismaDonorService } from '../prismaDonor.service';

function lowerCaseFirstChar(str) {
  if (!str) {
    return ''; // Проверка на случай пустой строки или undefined
  }
  return str.charAt(0).toLowerCase() + str.slice(1);
}

@Injectable()
export class SegmentsService {
  constructor(
    private prisma: PrismaService,
    private prismaDonor: PrismaDonorService,
    private logger: Logger,
  ) {}

  async createSegment(
    createSegmentDto: Prisma.SegmentCreateArgs['data'],
    uid: number,
  ) {
    return await this.prisma.segment.create({
      data: {
        name: createSegmentDto.name,
        description: createSegmentDto.description,
        source: {
          connect: (createSegmentDto.sourceId as number[]).map((id) => ({
            id,
          })),
        },
        createdById: uid,
        filter: {},
      },
      include: {
        source: true,
      },
    });
  }

  async getSource(id: number) {
    console.log(id);

    return await this.prisma.segment.findUnique({
      where: { id },
      include: {
        source: {
          include: {
            attributes: true,
          },
        },
      },
    });
  }

  async searchSegments({
    limit,
    offset = 0,
    search = '',
    sort,
  }: ISearchVariables<Segment>) {
    const where: Prisma.SegmentWhereInput | undefined = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              id: {
                equals: isNaN(Number(search)) ? undefined : Number(search),
              },
            },
          ],
        }
      : undefined;

    try {
      const [results, total] = await Promise.all([
        this.prisma.segment.findMany({
          where,
          skip: offset,
          take: limit,
          include: {
            source: true,
          },
          orderBy: sort,
        }),
        this.prisma.segment.count({
          where,
        }),
      ]);
      return {
        data: results,
        page: {
          total,
          offset: offset,
          lastPage: Math.ceil(total / (limit || 0)),
        },
      };
    } catch (error) {
      console.log(JSON.stringify(error));
      return {
        data: [],
        page: {
          total: 1,
          offset: 0,
          lastPage: 0,
        },
      };
    }
  }

  async findOne(id: number) {
    const segment = await this.prisma.segment.findUnique({
      where: {
        id,
      },
      include: {
        source: {
          include: {
            attributes: true,
          },
        },
      },
    });
    if (!segment) {
      throw new NotFoundException('Сегмент не найден');
    }
    return segment;
  }

  async update(
    id: number,
    data: Prisma.SegmentCreateArgs['data'],
    uid: number,
  ) {
    const segment = await this.prisma.segment.findUnique({
      where: {
        id,
      },
      include: {
        source: true,
      },
    });

    const newSource = (data.sourceId as number[]).filter(
      (id) => !segment?.sourceId.includes(id),
    );
    const removedSource = segment?.sourceId.filter(
      (id) => !(data.sourceId as number[]).includes(id),
    );

    const newSegment = await this.prisma.segment.update({
      where: { id },
      data: {
        filter: data.filter,
        updatedById: uid,
        limit: data.limit,
        source: {
          connect: newSource.map((id) => ({
            id,
          })),
          disconnect: removedSource?.map((id) => ({ id })),
        },
      },
    });

    return newSegment;
  }

  remove(id: number) {
    return `This action removes a #${id} segment`;
  }

  async calculateSegment(segmentId: number) {
    await this.prisma.segmentUser.deleteMany({
      where: {
        segmentId,
      },
    });

    const segment = await this.findOne(segmentId);

    await this.prisma.segment.update({
      data: {
        status: $Enums.SegmentStatus.PROGRESS,
      },
      where: {
        id: segment.id,
      },
    });

    const mapNameSourceToTableName = Object.fromEntries(
      segment.source.map(({ systemName, tableName }) => [
        systemName,
        tableName,
      ]),
    );
    const where = this.getWhereDonor(
      segment.filter as SegmentFilter,
      mapNameSourceToTableName,
    );

    try {
      const donors = await this.prismaDonor.donor.findMany({
        where,
        take: segment.limit ?? undefined,
      });

      await this.prisma.segmentUser.createMany({
        data: donors.map(({ id }) => ({
          segmentId,
          donorId: id,
        })),
      });

      await this.prisma.segment.update({
        data: {
          status: $Enums.SegmentStatus.CALCULATED,
        },
        where: {
          id: segment.id,
        },
      });
    } catch (error) {
      this.logger.error(error);
      await this.prisma.segment.update({
        data: {
          status: $Enums.SegmentStatus.ERROR,
        },
        where: {
          id: segment.id,
        },
      });
      throw new UnknownErrorException(JSON.stringify(error));
    }
  }

  async getStatus(id: number) {
    const [segment, count] = await Promise.all([
      this.prisma.segment.findUnique({
        where: {
          id,
        },
      }),
      this.prisma.segmentUser.count({
        where: {
          segmentId: id,
        },
      }),
    ]);

    return {
      status: segment?.status,
      lastCalcInfo: count,
    };
  }

  private getWhereDonor(
    filter: SegmentFilter,
    mapNameSourceToTableName: Record<string, string>,
  ) {
    let key = '';
    if (key) {
      key += '.';
    }

    if (filter.not) {
      key += 'NOT.';
    }

    key += filter.condition;

    const isArray = filter.condition === 'OR';

    this.logger.log(key);

    return filter.rules.reduce(
      (data, _rule) => {
        let iKey = key;
        if (isArray) {
          const value = lodash.get(data, key);

          if (Array.isArray(value)) {
            iKey += `[${value.length}]`;
          } else {
            iKey += '[0]';
          }
        }
        if ((_rule as SegmentFilter).rules) {
          const rule = _rule as SegmentFilter;
          const where = this.getWhereDonor(rule, mapNameSourceToTableName);
          const keyWhere = Object.keys(where)?.[0];

          if (keyWhere) {
            lodash.set(data, `${iKey}.${keyWhere}`, where[keyWhere]);
          }
        } else {
          const rule = _rule as SegmentFilterRule;
          const [source, field] = rule.field.split('-');
          const tableName = lowerCaseFirstChar(
            mapNameSourceToTableName[source],
          );
          this.logger.log(`${iKey}.${tableName}.${field}.${rule.operator}`);
          lodash.set(
            data,
            `${iKey}.${tableName}.${field}.${rule.operator}`,
            rule.value,
          );
        }

        return data;
      },
      {} as Record<string, unknown>,
    );
  }

  // private async calc(segmentId: number): Promise<any> {
  //   const segment = await this.prisma.segment.findUnique({
  //     where: { id: segmentId },
  //     include: {
  //       source: {
  //         include: {
  //           attributes: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!segment) {
  //     throw new NotFoundException('Нет сегмента для расчета');
  //   }

  //   const mapNameSourceToTableName = Object.fromEntries(
  //     segment.source.map(({ systemName, tableName }) => [
  //       systemName,
  //       tableName,
  //     ]),
  //   );

  //   const filter = segment?.filter as SegmentFilter;

  //   const getFilterWhere = (filter: SegmentFilter) => {
  //     const where = {
  //       [filter.condition]: filter.rules.map((_rule) => {
  //         if ((_rule as SegmentFilter).rules) {
  //           return getFilterWhere(_rule as SegmentFilter);
  //         } else {
  //           const rule = _rule as SegmentFilterRule;
  //           const [sourceName, column] = rule.field.split('-');

  //           return {
  //             [mapNameSourceToTableName[sourceName]]: {
  //               id: 1,
  //             },
  //           };
  //         }

  //         return {
  //           d: 1,
  //         };
  //       }),
  //     };

  //     if (filter.not) {
  //       return {
  //         NOT: where,
  //       };
  //     }

  //     return where;
  //   };

  //   const a = this.prismaDonor.donor.findMany({
  //     where: {
  //       NOT: {
  //         OR: [
  //           {
  //             medicalInfo: {
  //               weight: {
  //                 equals: 1,
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   });
  // }

  private buildSqlJoin(sources: Source[]) {
    let res = 'FROM "Donor" ';
    sources.forEach((source) => {
      res += `JOIN "${source.tableName}" on "Donor".id = "${source.tableName}"."donorId" `;
    });

    return res;
  }

  private buildSqlQuery(
    filter: SegmentFilter,
    mapNameSourceToTableName: Record<string, string>,
  ): string {
    const { rules, condition, not } = filter;
    const conditions = rules.map((rule) => {
      if ((rule as SegmentFilter).rules) {
        return `(${this.buildSqlQuery(rule as SegmentFilter, mapNameSourceToTableName)})`;
      } else {
        const [table, column] = (rule as SegmentFilterRule).field.split('-');
        return this.getCondition({
          ...(rule as SegmentFilterRule),
          field: `"${mapNameSourceToTableName[table]}"."${column}"`,
        });
      }
    });

    const joinedConditions = conditions.join(` ${condition} `);
    const finalConditions = not
      ? `NOT (${joinedConditions})`
      : joinedConditions;

    return finalConditions;
  }

  private getCondition(rule: SegmentFilterRule): string {
    const { field, type, operator, value } = rule;
    const sqlOperator = operatorMapper[operator];

    switch (type) {
      case DataType.integer:
      case DataType.boolean:
        return `${field} ${sqlOperator} ${value}`;
      case DataType.string:
      case DataType.stringSelectize:
        if (operator === Operators.in || operator === Operators.not_in) {
          const values = (value as string)
            .split(',')
            .map((val) => `'${val.trim()}'`)
            .join(', ');
          return `${field} ${sqlOperator} (${values})`;
        } else {
          return `${field} ${sqlOperator} '${value}'`;
        }
      case DataType.date:
        return `${field} ${sqlOperator} '${value}'`;
      default:
        throw new Error(`Unknown data type`);
    }
  }
}
