import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredPermissions = this.reflector
        .get<string[]>('permissions', context.getHandler())
        .join('_');

      if (!requiredPermissions) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user;
      console.log(user);

      return this.permissionsService.hasPermission(user, requiredPermissions);
    } catch (error) {
      console.log(error);

      return false;
    }
  }
}

export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
