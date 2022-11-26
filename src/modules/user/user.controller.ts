/* eslint-disable prettier/prettier */
import { Controller, Get, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { GetUser } from '../authentication/decorator';
import { JwtGuard } from '../authentication/guard';
import { Admin } from '../authorization/roles.decorator';
import { RolesGuard } from '../authorization/roles.guard';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userService: UserService) { }


  @Get('me')
  async getMe(@GetUser('') user: UserDTO) {
    return user
  }

  @Get('list')
  @UseGuards(RolesGuard)
  @Admin(true)
  async list() {
    return { message: 'All lists' }
  }
}    
