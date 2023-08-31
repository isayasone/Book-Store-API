import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isNotEmpty, isUUID } from 'class-validator';
import { AuthUser, JwtAuthGuard } from 'src/utilities';
import { SoldBookDto } from 'src/utilities/dto/sold.book.dto';
import { BooksService } from '../service/books.service';
import { BookDto } from '../utilities/dto/book.dto';
import { CreateBookDto } from '../utilities/dto/create.book.dto';

// @ApiBearerAuth()
@ApiTags('Book')
@ApiBearerAuth()
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

  @ApiResponse({
    description: `User Bought Books List`,
    type: [BookDto],
    status: 200,
  })
  @Get(`/user-bought/`)
  @UseGuards(JwtAuthGuard)
  async getUserBoughtBook(@AuthUser() user) {
    return await this.booksService.getUserBoughtBook(user.id);
  }

  @ApiResponse({
    description: `Sold Books List`,
    type: [SoldBookDto],
    status: 200,
  })
  @Get(`/sold/`)
  async getSoldBook() {
    return await this.booksService.getSoldBook();
  }

  @ApiResponse({
    description: `Get Book  by title`,
    type: BookDto,
    status: 200,
  })
  @ApiParam({
    name: 'title',
    required: true,
    description: 'book title',
  })
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
  @ApiParam({
    name: 'id',
    required: true,
    description: 'book id',
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
    description: `remove Book`,
    type: BookDto,
    status: 200,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'book id',
  })
  @Delete(`:id`)
  // @Roles(User_Role.ADMIN)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteBook(@Param('id') id) {
    if (!isUUID(id)) return new BadRequestException();
    return await this.booksService.deleteBook(id);
  }
}
