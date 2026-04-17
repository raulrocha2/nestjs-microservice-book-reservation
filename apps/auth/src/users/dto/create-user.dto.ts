import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { CreateRoleDto } from './create-role-dto';
import { Type } from 'class-transformer';

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
  @ValidateNested({ each: true })
  @Type(() => CreateRoleDto)
  roles?: CreateRoleDto[];
}
