/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { AuthLoginDTO, AuthRegisterDTO, Tokens } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }

  hashRefreshToken(refresh_token: string) {
    return argon.hash(refresh_token)
  }

  async signToken(userId: string, email: string): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
    };

    const expiresTokenIn = await this.config.get('JWT_EXPIRES_IN');
    const secretToken = await this.config.get('JWT_SECRET');

    const expiresRefreshTokenIn = await this.config.get('JWT_REFRESH_EXPIRES_IN');
    const secretRefreshToken = await this.config.get('JWT_REFRESH_SECRET');

    const [token, refresh_token] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: expiresTokenIn,
        secret: secretToken,
      }),
      this.jwt.signAsync(payload, {
        expiresIn: expiresRefreshTokenIn,
        secret: secretRefreshToken,
      })
    ])

    return {
      access_token: token,
      refresh_token
    }

  }

  async updateUserRefreshToken(user_id: string, refresh_token: string) {
    const hashedRt = await this.hashRefreshToken(refresh_token)

    await this.prisma.user.update({
      data: {
        hashedRt
      },
      where: {
        id: user_id
      }
    })
  }


  async signup({ email, password, name }: AuthRegisterDTO): Promise<Tokens> {
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userAlreadyExists) {
      throw new ForbiddenException('User already exists!');
    }

    const hashedPassword = await argon.hash(password);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,

      },
    });

    const { access_token, refresh_token } = await this.signToken(user.id, user.email);

    await this.updateUserRefreshToken(user.id, refresh_token)

    return {
      access_token,
      refresh_token
    }

  }

  async signin({ email, password }: AuthLoginDTO): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Credentials incorrect!');
    }
    const passwordMatch = await argon.verify(user.password, password);

    if (!passwordMatch) {
      throw new ForbiddenException('Credentials incorrect!');
    }

    const { access_token, refresh_token } = await this.signToken(user.id, user.email);

    await this.updateUserRefreshToken(user.id, refresh_token)

    return {
      access_token,
      refresh_token
    }

  }




  async logout() {
  }

  async refreshToken() {
  }

}

// to show only wanted data in Prisma
// select: {
//     id: true,
//     email: true,
//     name: true,
//     created_at: true
// }
