/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../authentication/guard';
import { Admin } from '../authorization/roles.decorator';
import { RolesGuard } from '../authorization/roles.guard';
import { BookDTO } from './books.dto';
import { BooksService } from './books.service';

@UseGuards(JwtGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @UseGuards(RolesGuard)
  @Admin(true)
  @Post()
  async create(@Body() data: BookDTO) {
    return this.booksService.create(data);
  }

  @Get()
  async findAll() {
    return this.booksService.findAll();
  }

  @UseGuards(RolesGuard)
  @Admin(true)
  // books/535623e9-4f94-4146-aa8c-0fc499ebbb4b
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: BookDTO) {
    return this.booksService.update(id, data);
  }

  @UseGuards(RolesGuard)
  @Admin(true)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedBook = await this.booksService.delete(id);

    const message = JSON.stringify(`${deletedBook.title} successful removed!`);

    return message;
  }
}
