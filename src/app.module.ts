import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BooksController } from './controller/books.controller';
import { OrdersController } from './controller/orders.controller';
import { UserController } from './controller/user.controller';
import { BooksRepository } from './repository/books.repository';
import { OrderRepository } from './repository/orders.repository';
import { BooksService } from './service/books.service';
import { OrdersService } from './service/order.service';
import { UserService } from './service/user.service';
import { JwtStrategy } from './utilities/jwt.strategy';
import { PrismaService } from './utilities/prisma.service';
import { UsersRepository } from './repository/users.repository';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
        algorithm: 'HS384',
      },
    }),
  ],
  controllers: [UserController, BooksController, OrdersController],
  providers: [
    UserService,
    JwtStrategy,
    UsersRepository,
    BooksService,
    BooksRepository,
    OrdersService,
    OrderRepository,
    PrismaService,
  ],
})
export class AppModule {}
