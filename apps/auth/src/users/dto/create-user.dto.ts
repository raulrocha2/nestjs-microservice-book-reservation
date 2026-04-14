import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];
}
