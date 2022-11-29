/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_REFRESH_SECRET'),
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: {
        sub: string
        email: string
    }) {

        const refreshToken = req.get('authorization').replace('Bearer', '').trim()

        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        })

        if (!user) {
            throw new UnauthorizedException();
        }

        delete user.password

        return {
            payload,
            refreshToken
        }
    }
}
