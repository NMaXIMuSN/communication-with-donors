import { Injectable } from '@nestjs/common';
import { User } from '../users/users.service';

@Injectable()
export class PermissionsService {
  hasPermission(user: User, permission: string): boolean {
    const userPermissions = user.role.reduce((permissions, role) => {
      role.permissions.forEach(({ value }) => permissions.add(value));
      return permissions;
    }, new Set<string>());

    return userPermissions.has(permission);
  }
}
