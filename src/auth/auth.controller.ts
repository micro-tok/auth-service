import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  login(body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @GrpcMethod('AuthService', 'Register')
  register(body: SignupDto) {
    return this.authService.signup(body);
  }

  @UseGuards(JwtAuthGuard)
  @GrpcMethod('AuthService', 'ValidateUser')
  validateUserRequest(body: { user: User }) {
    return {
      userUuid: body.user.uuid,
    };
  }
}
