import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { type UserDto } from "../dto";

const getCurrentUserByContext = (ctx: ExecutionContext): UserDto => {
    const request = ctx.switchToHttp().getRequest();
    return {
        id: request.user._id,
        email: request.user.email,
        password: request.user.password,
    } as unknown as UserDto;
};

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): UserDto => getCurrentUserByContext(ctx));