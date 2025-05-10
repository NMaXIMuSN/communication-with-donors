import { Injectable } from '@nestjs/common';
import { User } from '../users/users.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prismaService: PrismaService) {}
  hasPermission(user: User, permission: string): boolean {
    const userPermissions = user.role.reduce((permissions, role) => {
      role.permissions.forEach(({ value }) => permissions.add(value));
      return permissions;
    }, new Set<string>());

    return userPermissions.has(permission);
  }

  async getRole() {
    try {
      return await this.prismaService.role.findMany({});
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getRoleWithPermissions() {
    try {
      return await this.prismaService.role.findMany({
        include: {
          permissions: true,
        },
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async createRole(data: { name: string; permissions: string[] }) {
    return await this.prismaService.role.create({
      data: {
        name: data.name,
        permissions: {
          connect: data.permissions.map((permission) => ({
            value: permission,
          })),
        },
      },
    });
  }

  async updateRole(id: number, data: { name: string; permissions: string[] }) {
    return await this.prismaService.role.update({
      data: {
        name: data.name,
        permissions: {
          set: data.permissions.map((value) => ({ value })),
        },
      },
      where: { id },
    });
  }
}
