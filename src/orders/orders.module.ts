import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { BooksModule } from 'src/books/books.module';
import { PrismaService } from 'src/prisma.service';
import { OrdersService } from './order.service';
import { OrdersController } from './orders.controller';
import { OrderRepository } from './orders.repository';

@Module({
  imports: [BooksModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, PrismaService],
})
export class OrdersModule {}
