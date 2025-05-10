import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { $Enums, Prisma, Template, TemplateSettings } from '@prisma/client';
import { NotFoundException, UnknownErrorException } from '../errors';
import { ISearchVariables } from '../type';
import { get } from 'lodash';

@Injectable()
export class TemplatesService {
  constructor(
    private prismaService: PrismaService,
    private logger: Logger,
  ) {}

  async search({
    limit,
    offset,
    search,
    sort,
    filter,
  }: ISearchVariables<
    Template,
    {
      type: $Enums.TemplateType[];
    }
  >) {
    const where: Prisma.TemplateWhereInput | undefined =
      search || filter
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
                type: filter && { in: filter.type },
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
        this.prismaService.template.findMany({
          where,
          skip: offset,
          take: limit,
          include: {
            settings: true,
          },
          orderBy: sort,
        }),
        this.prismaService.template.count({
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
    } catch {
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

  async create(template: Template, uid: number) {
    return await this.prismaService.template.create({
      data: {
        name: template.name,
        description: template.description,
        type: template.type,
        createdById: uid,
      },
    });
  }

  async update(
    id: number,
    _newTemplate: Template & {
      settings: (Partial<TemplateSettings> & Omit<TemplateSettings, 'id'>)[];
    },
    editorId: number,
  ) {
    const { id: _id, ...newTemplate } = _newTemplate;
    const template = await this.getTemplate(id);

    const createSettings = newTemplate.settings.filter(({ id }) => !id);
    const updateSettings = newTemplate.settings.filter(({ id }) => id);
    const deleteSettings = template?.settings.filter(
      ({ id }) => !updateSettings.some(({ id: _id }) => id === _id),
    );
    try {
      return await this.prismaService.template.update({
        where: { id },
        data: {
          updatedBy: {
            connect: {
              id: editorId,
            },
          },
          settings: {
            deleteMany: deleteSettings?.map(({ id }) => ({ id })),
            updateMany: updateSettings.map(({ id, ...data }) => ({
              data,
              where: { id },
            })),
            createMany: {
              data: createSettings,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new UnknownErrorException(JSON.stringify(error));
    }
  }

  async getTemplate(id: number) {
    const template = await this.prismaService.template.findUnique({
      where: { id },
      include: {
        settings: {
          omit: {
            templateId: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Нет шаблона с таким id: ${id}`);
    }

    return template;
  }

  async getTemplateSettingByLang(
    templateId: number,
    lang: $Enums.Language,
  ): Promise<TemplateSettings> {
    try {
      const setting =
        await this.prismaService.templateSettings.findFirstOrThrow({
          where: {
            templateId,
            lang,
          },
        });

      return setting;
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new NotFoundException('Нет шаблона', 'SETTING_NOT_FOUND');
    }
  }

  fillText(content: string, donorData: object): string {
    let filledContent = content;

    for (const [key, value] of Object.entries(donorData)) {
      const placeholder = `{{${key}}}`;
      filledContent = filledContent.replace(
        new RegExp(placeholder, 'g'),
        value,
      );
    }

    return content.replace(/{{(.*?)}}/g, (_, key) => {
      // Удалить любые лишние пробелы вокруг ключа
      key = key.trim();
      // Используем lodash для безопасного извлечения значения по ключу
      const value = get(donorData, key);

      // Если значение удалось найти, возвращаем его, иначе оставляем оригинальный плейсхолдер
      return value !== undefined ? String(value) : _;
    });
  }
}
