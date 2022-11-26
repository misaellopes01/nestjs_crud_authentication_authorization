/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO, AuthRegisterDTO, Tokens } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async signup(@Body() data: AuthRegisterDTO): Promise<Tokens> {
    return this.authService.signup(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() data: AuthLoginDTO): Promise<Tokens> {
    return this.authService.signin(data);
  }

  @Post('logout')
  async logout() {
    return this.authService.logout()
  }

  @Post('refresh')
  async refreshToken() {
    return this.authService.refreshToken()
  }
}
