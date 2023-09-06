import { Controller, Post, UseGuards, Req, Res, Body } from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/createUserDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { access_token } = await this.authService.login(req.user);
    res
      .cookie('auth-token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .send({ status: 'ok' });
  }

  @Post('/signUp')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }
}
