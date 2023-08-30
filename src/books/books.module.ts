import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BooksController } from './books.controller';
import { BooksRepository } from './books.repository';
import { BooksService } from './books.service';

@Module({
  imports: [],
  controllers: [BooksController],
  providers: [BooksService, BooksRepository, PrismaService],
  exports:[BooksRepository]
})
export class BooksModule {}
