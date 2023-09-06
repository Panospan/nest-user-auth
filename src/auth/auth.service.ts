import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/authLoginDto';
// import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(authLoginDto: AuthLoginDto) {
    const { username, password } = authLoginDto;
    const user = (await this.userService.findByUserName({
      username,
      sensitiveIncluded: true,
    })) as User;

    if (!user) return new UnauthorizedException();

    try {
      const matches = await bcrypt.compare(password, user.password);
      if (matches) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      } else {
        return new UnauthorizedException();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: { uid: user.userId, username: user.username, email: user.email },
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
