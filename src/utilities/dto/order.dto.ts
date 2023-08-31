import { ApiProperty } from '@nestjs/swagger';
import { BookDto } from 'src/utilities/dto/book.dto';
import { UserDto } from 'src/utilities/dto/user.dto';

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

  static mapToOrderDto(order, customer?: UserDto) {
    const orderDto = new OrderDto();
    orderDto.id = order.id;
    if (customer) {
      orderDto.customerName = `${customer.frist_name}  ${customer.last_name}`;
      orderDto.customerEmail = customer.email;
    }
    orderDto.createdAt = order.createdAt;
    orderDto.books = order?.books?.map((book) => BookDto.mapToBookDto(book));
    return orderDto;
  }
}
