import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserDocument } from "./users/models/users.schema";

const getCurrentUserByContext = (ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as unknown as UserDocument;
};

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): UserDocument => getCurrentUserByContext(ctx));