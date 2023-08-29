import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { OrdersModule } from './orders/orders.module';
@Module({
  imports: [
    OrdersModule,
    BooksModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule
  ]
})
export class AppModule {
}
