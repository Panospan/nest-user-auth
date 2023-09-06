import { IsEmail, IsString } from 'class-validator';
import { CreateUserDto } from './createUserDto';

export class UpdateUserDto implements Partial<CreateUserDto> {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
