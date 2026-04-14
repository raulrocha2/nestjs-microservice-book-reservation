import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      request.cookies?.Authentication ||
      request.headers?.authorization?.replace('Bearer ', '') ||
      request.headers?.Authentication;
    if (!token) {
      return false;
    }
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    return this.authClient
      .send('authenticate', {
        Authentication: token,
      })
      .pipe(
        tap((res) => {
          if (roles) {
            const hasRole = roles.some((role) => res.roles.includes(role));
            if (!hasRole) {
              this.logger.error(
                `User ${res.email} does not have the required role ${roles.join(', ')}`,
              );
              throw new UnauthorizedException();
            }
          }
          context.switchToHttp().getRequest().user = res;
        }),
        map((res) => {
          return true;
        }),
        catchError((error) => {
          this.logger.error(error);
          return of(false);
        }),
      );
  }
}
