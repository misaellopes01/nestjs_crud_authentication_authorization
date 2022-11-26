/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { BookDTO } from './books.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create({ title, description, bar_code }: BookDTO) {
    const bookExists = await this.prisma.book.findFirst({
      where: {
        bar_code,
      },
    });

    if (bookExists) {
      throw new Error('Book already exists');
    }

    const book = await this.prisma.book.create({
      data: {
        title,
        description,
        bar_code,
      },
    });

    return book;
  }

  async findAll() {
    return this.prisma.book.findMany();
  }

  async update(id: string, data: BookDTO) {
    const bookExists = await this.prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!bookExists) {
      throw new Error('Book does not exists');
    }

    return await this.prisma.book.update({
      data,
      where: {
        id,
      },
    });
  }

  async delete(id: string) {
    const bookExists = await this.prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!bookExists) {
      throw new Error('Book does not exists');
    }

    return await this.prisma.book.delete({
      where: {
        id,
      },
    });
  }
}
