import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}
export class CreateRoleDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsEnum(RoleEnum)
  name: string;

  constructor(role: Partial<CreateRoleDto>) {
    Object.assign(this, role);
  }
}
