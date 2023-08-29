import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BooksRepository } from './books.repository';
import { BookDto } from './dto/book.dto';
import { CreateBookDto } from './dto/create.book.dto';

@Injectable()
export class BooksService {
  constructor(private repository: BooksRepository) {}

  async createBook(data: CreateBookDto) {
    try {
      const book = await this.repository.createBook({ data });
      return BookDto.mapToBookDto(book);
    } catch (err) {
      if (err.code === 'P2002')
        throw new ForbiddenException(' Book Already Registered ');
      throw new InternalServerErrorException(err.message);
    }
  }
  async getBooks() {
    try {
      const books = await this.repository.getBooks();
      return books.map((book) => BookDto.mapToBookDto(book));
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
  async getBook(id: string) {
    try {
      const book = await this.repository.getBook({ id });
      return BookDto.mapToBookDto(book);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
  async updataBook(data: CreateBookDto, id) {
    try {
      const book = await this.repository.updateBook({ where: { id }, data });
      return BookDto.mapToBookDto(book);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
  async deleteBook(id) {
    try {
      const book = await this.repository.deleteBook({ where: { id } });
      return BookDto.mapToBookDto(book);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getBookByTitle(title) {
    try {
      const book = await this.repository.getBook({ where: { title } });
      return BookDto.mapToBookDto(book);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }



}
