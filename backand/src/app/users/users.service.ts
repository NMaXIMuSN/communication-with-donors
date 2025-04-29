import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Permission, Prisma, Role, User as UserPrisma } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { UsersDto } from './dto/Users.dto';
import { ISearchVariables } from '../type';
import { BadRequestException } from '../errors';
import { MailService } from '../mail/mail.service';

export interface User extends Omit<UserPrisma, 'password'> {
  role: (Role & {
    permissions: Permission[];
  })[];
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private logger: Logger,
  ) {}

  async findOne(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
      omit: {
        password: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
      omit: {
        password: true,
      },
    });
  }

  async getInfoByHash(hash: string) {
    try {
      return await this.prisma.registerUser.findFirstOrThrow({
        where: {
          hash,
        },
      });
    } catch {
      throw new BadRequestException('Неизвестный хеш');
    }
  }

  async addUser({ email, roleIds }: { email: string; roleIds: number[] }) {
    try {
      const hashedEmail = await hash(email, 10);

      if (
        await this.prisma.registerUser.count({
          where: {
            email: email,
            hash: hashedEmail,
          },
        })
      ) {
        throw new BadRequestException(
          'Пользователь с такие email уже существует',
        );
      }

      const user = await this.prisma.registerUser.create({
        data: {
          hash: hashedEmail,
          email,
          role: {
            connect: roleIds.map((id) => ({
              id,
            })),
          },
        },
      });

      await this.mailService.sendRegisterInfo(user.email, hashedEmail);

      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(JSON.stringify(error));
    }
  }

  async getRegInfo(hash: string) {
    try {
      return await this.prisma.registerUser.findFirstOrThrow({
        where: {
          hash: hash,
        },
        select: {
          email: true,
        },
      });
    } catch {
      throw new ForbiddenException();
    }
  }

  async create(email: string, name: string, password: string): Promise<User> {
    const hashedPassword = await hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
      omit: {
        password: true,
      },
    });
  }

  async searchUsers({
    limit,
    offset,
    search,
    sort,
  }: ISearchVariables<UsersDto>) {
    const where: Prisma.UserWhereInput | undefined = search
      ? {
          OR: [
            {
              email: {
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
        this.prisma.user.findMany({
          where,
          skip: offset,
          take: limit,
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
          omit: {
            password: true,
          },
          orderBy: sort,
        }),
        this.prisma.user.count({
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
      this.logger.log(JSON.stringify(error));
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

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      select: {
        password: true,
      },
    });

    if (user && (await compare(password, user.password))) {
      return await this.findByEmail(email);
    }

    return null;
  }
}
