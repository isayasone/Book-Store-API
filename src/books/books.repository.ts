import { Injectable } from '@nestjs/common';
import { Book, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BooksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBook(params: { data: Prisma.BookCreateInput }): Promise<Book> {
    const { data } = params;
    return await this.prisma.book.create({ data });
  }

  async getBook(id): Promise<Book> {
    return await this.prisma.book.findUnique({ where: { id } });
  }

  async getBooks(): Promise<Book[]> {
    return await this.prisma.book.findMany();
  }

  async updateBook(params: {
    where: Prisma.BookWhereUniqueInput;
    data: Prisma.BookUpdateInput;
  }): Promise<Book> {
    const { where, data } = params;
    return await this.prisma.book.update({ where, data });
  }

  async deleteBook(params: {
    where: Prisma.BookWhereUniqueInput;
  }): Promise<Book> {
    const { where } = params;
    return await this.prisma.book.delete({ where });
  }
}
