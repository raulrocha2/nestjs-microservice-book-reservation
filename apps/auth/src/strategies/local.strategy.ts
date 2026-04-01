import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { UserDocument } from "../users/models/users.schema";
import { UsersService } from "../users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<UserDocument> {
    try {
        const user = await this.usersService.verifyUser({email, password});
        return user;
    } catch (error) {
        throw new UnauthorizedException(error);
    }
  }
}