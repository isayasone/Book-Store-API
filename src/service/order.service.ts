import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Book_Status } from '@prisma/client';
import { BooksRepository } from 'src/repository/books.repository';
import { Order_status } from 'src/utilities';
import { UserDto } from 'src/utilities/dto/user.dto';
import { OrderRepository } from '../repository/orders.repository';
import { CreateOrderDto } from '../utilities/dto/create.order.dto';
import { OrderDto } from '../utilities/dto/order.dto';
import { UserService } from './user.service';
import { UserOrderDto } from 'src/utilities/dto/user.order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private orderRepository: OrderRepository,
    private booksRepository: BooksRepository,
    private userService: UserService,
  ) {}
  async orderBooks(dto: CreateOrderDto, userId: string): Promise<OrderDto> {
    try {
      const { book_ids } = dto;
      //validation
      const books = await Promise.all(
        book_ids.map(async (id: string) => {
          const book = await this.booksRepository.getBook({ id });
          if (!book) throw new BadRequestException('Book not found');
          if (book.status != Book_Status.AVAILABLE)
            throw new BadRequestException(`Book : ${book.title} not available`);
          return book;
        }),
      );
      const booksPoints = books
        .map((a) => a.point)
        .reduce(function (a, b) {
          return a + b;
        }, 0);

      const customer = await this.userService.findOneByUserId(userId);

      if (booksPoints > customer.point)
        throw new ForbiddenException(
          "You don't have valid point to order the book",
        );
      // create order
      const order = await this.orderRepository.createOrder(
        userId,
        book_ids,
        booksPoints,
        customer.point - booksPoints,
      );
      return OrderDto.mapToOrderDto(order, customer);
    } catch (err) {
      throw err;
    }
  }

  async cancelOrder(orderId: string, userId) {
    try {
      await this.checkOrderOnPennding(orderId);
      const customer = await this.userService.findOneByUserId(userId);
      const order = await this.orderRepository.cancelOrder(
        orderId,
        userId,
        customer.point,
      );
      return OrderDto.mapToOrderDto(order, customer);
    } catch (err) {
      throw err;
    }
  }

  async deliverOrder(orderId: string) {
    try {
      await this.checkOrderOnPennding(orderId);
      const order = await this.orderRepository.deliverOrder(orderId);
      return OrderDto.mapToOrderDto(
        order,
        UserDto.mapUserToUserDto(order.customer),
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getCanceledOrders() {
    try {
      const orders = await this.orderRepository.getOrdersByStatus(
        Order_status.CANCELED,
      );
      return orders.map((order) =>
        OrderDto.mapToOrderDto(order, UserDto.mapUserToUserDto(order.customer)),
      );
    } catch (err) {
      throw err;
    }
  }

  async getPendingOrder() {
    try {
      const orders = await this.orderRepository.getOrdersByStatus(
        Order_status.PENDING,
      );
      return orders.map((order) =>
        OrderDto.mapToOrderDto(order, UserDto.mapUserToUserDto(order.customer)),
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getOrders() {
    try {
      return await this.orderRepository.getOrders();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getUserOrders(customer_id) {
    try {
      const orders = await this.orderRepository.getOrdersWhereClue({
        customer_id,
      });
      return orders.map((order) => UserOrderDto.mapToOrderDto(order));
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  private async checkOrderOnPennding(id) {
    try {
      const order = await this.orderRepository.getOrder(id);
      if (!order) throw new NotFoundException('Order Not Found');
      else if (order.status != Order_status.PENDING)
        throw new BadRequestException('Order not on pending');
    } catch (err) {
      throw err;
    }
  }
}
