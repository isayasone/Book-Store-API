import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/auth/dtos/user.dto';
import { BookDto } from 'src/books/dto/book.dto';

export class OrderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerEmail: string;

  @ApiProperty()
  books: BookDto[];

  @ApiProperty()
  Totalpoint: number;

  @ApiProperty()
  createdAt: Date;

  static mapToOrderDto(order, customer: UserDto) {
    const orderDto = new OrderDto();
    orderDto.id = order.id;
    orderDto.customerName = `${customer.frist_name}  ${customer.last_name}`;
    orderDto.createdAt = order.createdAt;
    orderDto.customerEmail = customer.email;
    orderDto.books = order?.books?.map((book) => BookDto.mapToBookDto(book));
    return orderDto;
  }
}
