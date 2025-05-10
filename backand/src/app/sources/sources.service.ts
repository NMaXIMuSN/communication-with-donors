import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DataType, Prisma } from '@prisma/client';
import { ISourceUpdate } from './sources.controller';
import { PrismaDonorService } from '../prismaDonor.service';
import { NotFoundException, UnknownErrorException } from '../errors';

@Injectable()
export class SourcesService {
  constructor(
    private prisma: PrismaService,
    private prismaDonor: PrismaDonorService,
    private logger: Logger,
  ) {}

  mapperSQLTypeToDataType(type: string): DataType | undefined {
    switch (type.toLowerCase()) {
      case 'integer':
      case 'int':
      case 'int4':
      case 'int8':
        return DataType.INT;
      case 'real':
      case 'float4':
      case 'double precision':
        return DataType.REAL;
      case 'text':
      case 'varchar':
      case 'char':
        return DataType.TEXT;
      case 'date':
        return DataType.DATE;
      case 'time':
        return DataType.TIME;
      case 'timestamp':
      case 'timestamp without time zone':
      case 'timestamp with time zone':
        return DataType.TIMESTAMP;
      case 'boolean':
        return DataType.BOOLEAN;
      default:
        return undefined;
    }
  }

  // Получение списка источников с пагинацией, поиском и сортировкой
  async searchSources(page = 1, limit = 10, sort = 'asc', search?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.SourceWhereInput | undefined = search
      ? {
          name: { contains: search, mode: 'insensitive' },
        }
      : undefined;

    const [results, total] = await Promise.all([
      this.prisma.source.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: sort as 'asc' | 'desc' },
        include: {
          attributes: true,
        },
      }),
      this.prisma.source.count({
        where,
      }),
    ]);

    return {
      data: results,
      meta: {
        total,
        offset: skip,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  // Создание источника (без атрибутов)
  async create(createInput: ISourceUpdate) {
    try {
      return await this.prisma.source.create({
        data: {
          ...createInput,
          attributes: {
            createMany: {
              data: createInput.attributes,
            },
          },
        },
      });
    } catch (error) {
      throw new UnknownErrorException(JSON.stringify(error));
    }
  }

  // Обновление источника и добавление атрибутов
  async update(id: number, data: ISourceUpdate) {
    const { attributes = [], ...sourceData } = data;

    const existingAttributes =
      (await this.prisma.attribute.findMany({
        where: { sourceId: id },
      })) || [];

    const updatedAttributes = attributes.filter(({ id }) => !!id);
    const createdAttributes = attributes.filter(({ id }) => !id);
    const deleteAttributes = existingAttributes.filter(
      ({ id }) => !updatedAttributes.some(({ id: _id }) => id === _id),
    );

    const updatedSource = await this.prisma.source.update({
      where: { id },
      data: {
        ...sourceData,
        attributes: attributes
          ? {
              updateMany: updatedAttributes.map(
                ({ id, sourceId: _, ...attribute }) => ({
                  data: {
                    ...attribute,
                  },
                  where: {
                    id,
                  },
                }),
              ),

              createMany: {
                data: createdAttributes.filter(({ id }) => !id),
              },
              deleteMany: deleteAttributes.map(({ id }) => ({
                id,
              })),
            }
          : undefined,
      },
      include: { attributes: true },
    });

    return updatedSource;
  }

  // Получить источник с атрибутами
  async getSourceById(systemName: string) {
    const source = await this.prisma.source.findUnique({
      where: { systemName },
      include: { attributes: true },
    });

    if (!source) {
      throw new NotFoundException('Source not found');
    }

    return source;
  }

  async deleteSource(systemName: string) {
    await this.prisma.source.delete({
      where: {
        systemName,
        AND: {
          segments: undefined,
        },
      },
      include: {
        attributes: true,
      },
    });
  }

  async getDonorTableInfo(name: string) {
    const res = await this.prismaDonor.$queryRawUnsafe<any[]>(
      'SELECT column_name,data_type FROM information_schema.columns WHERE table_name = $1::text',
      name,
    );

    if (!res.length) {
      throw new NotFoundException('Таблица не найдена');
    }

    const data = await this.prismaDonor[name]?.findMany({ take: 10 });

    return {
      table: res.map((el) => ({
        columnName: el.column_name,
        dataType: this.mapperSQLTypeToDataType(el.data_type),
      })),

      data: data,
    };
  }

  async getDonorTables() {
    const rawTablesQuery = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public'
    AND table_type='BASE TABLE'
    AND table_name != '_prisma_migrations';
  `;

    try {
      const tables =
        await this.prismaDonor.$queryRawUnsafe<{ table_name: string }[]>(
          rawTablesQuery,
        );

      return tables.map((el) => el.table_name);
    } catch (error) {
      throw new InternalServerErrorException(JSON.stringify(error));
    }
  }
}
