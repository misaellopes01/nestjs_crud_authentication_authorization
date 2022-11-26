/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const admin = this.reflector.get<string[]>('admin', context.getHandler());
        if (!admin) {
            return true;
        }
        const request = context.switchToHttp().getRequest();

        const user = request.user;

        if (user.admin !== admin) {
            throw new UnauthorizedException()
        }

        return true
    }
}  