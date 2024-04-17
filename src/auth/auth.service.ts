import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { jwtConstants } from './constants';
import { compare } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dtos/signup.dto';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findByUuid(uuid: string) {
    return this.prismaService.user.findUnique({
      where: {
        uuid,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async validateUser(email: string, pass: string): Promise<unknown> {
    const user = await this.findByEmail(email);

    if (user && (await compare(pass, user.password))) {
      return {
        email: user.email,
        password: user.password,
      };
    }

    return null;
  }

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('NO_USER_FOUND');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('INVALID_PASSWORD');
    }

    return {
      token: this.jwtService.sign({
        id: user.uuid,
      }),
      refreshToken: this.jwtService.sign(
        {
          id: user.uuid,
          tokenId: uuid(),
        },
        {
          secret: jwtConstants.refreshSecret,
          expiresIn: jwtConstants.refreshExpiresIn,
        },
      ),
      userUuid: user.uuid,
    };
  }

  async signup(body: SignupDto) {
    const newUser = plainToClass(CreateUserDto, body);

    await this.createUser(newUser);

    return this.login(body.email, body.password);
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const userInUse = await this.prismaService.user.findMany({
      where: {
        OR: [
          {
            email: user.email,
          },
          {
            username: user.username,
          },
        ],
      },
    });

    if (userInUse.length > 0) {
      userInUse.map((existingUser) => {
        if (existingUser.email === user.email) {
          throw new ConflictException('EMAIL_IN_USE');
        }

        if (existingUser.username === user.username) {
          throw new ConflictException('USERNAME_IN_USE');
        }
      });
    }

    user.password = await hash(user.password, roundsOfHashing);

    return this.prismaService.user.create({
      data: user,
    });
  }
}
