/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

export const Admin = (admin: boolean) => SetMetadata('admin', admin);