import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { isNotEmpty, isUUID } from 'class-validator';
import { BooksService } from '../service/books.service';
import { BookDto } from '../utilities/dto/book.dto';
import { CreateBookDto } from '../utilities/dto/create.book.dto';

// @ApiBearerAuth()
@ApiTags('Book')
@Controller('book')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiResponse({
    description: `Books List`,
    type: [BookDto],
    status: 200,
  })
  @Get()
  async getBooks() {
    return this.booksService.getBooks();
  }

  @Get(`/by-title/:title`)
  async getBookByTitle(@Param('title') title) {
    if (!isNotEmpty(title)) return new BadRequestException();
    return await this.booksService.getBookByTitle(title);
  }

  @ApiResponse({
    description: `Get Book by id`,
    type: BookDto,
    status: 200,
  })
  @Get(`/:id`)
  async getBook(@Param('id') id) {
    if (!isUUID(id)) return new BadRequestException();
    return await this.booksService.getBook(id);
  }

  @ApiResponse({
    description: `Add Book`,
    type: BookDto,
    status: 201,
  })
  @Post()
  async addBook(@Body(ValidationPipe) dto: CreateBookDto) {
    return await this.booksService.createBook(dto);
  }

  @ApiResponse({
    description: `Update Book`,
    type: BookDto,
    status: 201,
  })
  @Put(`:id`)
  async updateBook(@Param('id') id, @Body(ValidationPipe) dto: CreateBookDto) {
    if (!isUUID(id)) return new BadRequestException();
    return await this.booksService.updataBook(dto, id);
  }

  @ApiResponse({
    description: `remove Book`,
    type: BookDto,
    status: 200,
  })
  @Delete(`:id`)
  async deleteBook(@Param('id') id) {
    if (!isUUID(id)) return new BadRequestException();
    return await this.booksService.deleteBook(id);
  }
}