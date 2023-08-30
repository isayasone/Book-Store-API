import { Module } from '@nestjs/common';
import { BooksModule } from 'src/books/books.module';
import { OrdersService } from './order.service';
import { OrderRepository } from './orders.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [BooksModule,AuthModule],
  controllers: [],
  providers: [OrdersService,OrderRepository],
})
export class OrdersModule {}
