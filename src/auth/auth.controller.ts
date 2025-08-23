import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import type { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAuth(@Req() req: Request) {
    return this.authService.getAuth(req);
  }

  @Get('csrf-token')
  getCsrf(@Req() req: Request) {
    return this.authService.getCsrf(req);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Req() req: Request, @Body() loginDto: LoginDto) {
    return this.authService.login(req, loginDto);
  }

  @Post('register')
  register(@Req() req: Request, @Body() registerDto: RegisterDto) {
    return this.authService.register(req, registerDto);
  }
}
