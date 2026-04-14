import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
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
    return this.authClient
      .send('authenticate', {
        Authentication: token,
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map((res) => {
          return true;
        }),
        catchError(() => of(false)),
      );
  }
}
