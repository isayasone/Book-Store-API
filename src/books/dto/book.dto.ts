import { ApiProperty } from '@nestjs/swagger';
import { Book } from '@prisma/client';
import { Book_Status, Book_Tag } from 'src/common';

export class BookDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;

  @ApiProperty()
  writer: string;

  @ApiProperty()
  cover_image: string;

  @ApiProperty()
  point: number;

  @ApiProperty()
  tag: Book_Tag[];
  @ApiProperty()
  status: Book_Status;

  @ApiProperty()
  createdAt: Date;

  static mapToBookDto(book: Book) {
    const bookDto = new BookDto();
    bookDto.id = book.id;
    bookDto.title = book.title;
    bookDto.writer = book.writer;
    bookDto.point = book.point;
    bookDto.tag = book.tag as Book_Tag[];
    bookDto.status = book.status as Book_Status;
    bookDto.cover_image = book.cover_image;
    return bookDto;
  }
}
