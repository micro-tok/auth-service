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

  @UseGuards(JwtAuthGuard)
  @GrpcMethod('AuthService', 'GetMe')
  getMe(body: { user: User }) {
    return {
      userUuid: body.user.uuid,
      username: body.user.username,
      email: body.user.email,
    };
  }

  @UseGuards(JwtAuthGuard)
  @GrpcMethod('AuthService', 'UpdateMyInterests')
  updateInterests(body: { user: User; interests: string[] }) {
    return this.authService.updateInterests(body.user.uuid, body.interests);
  }

  @UseGuards(JwtAuthGuard)
  @GrpcMethod('AuthService', 'GetMyInterests')
  getMyInterests(body: { user: User }) {
    return this.authService.getInterests(body.user.uuid);
  }

  @GrpcMethod('AuthService', 'GetPublicUser')
  async getPublicUser(body: { userUuid: string }) {
    const user = await this.authService.findByUuid(body.userUuid);

    return {
      username: user.username,
      userUuid: user.uuid,
    };
  }

  @GrpcMethod('AuthService', 'GetAllUsers')
  async getAllUsers() {
    console.log('GetAllUsers');
    const users = await this.authService.findAll();
    console.log(
      users.map((user) => {
        return {
          username: user.username,
          uuid: user.uuid,
        };
      }),
    );
    return {
      users: users.map((user) => {
        return {
          username: user.username,
          userUuid: user.uuid,
        };
      }),
    };
  }
}
