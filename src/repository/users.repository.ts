import { Injectable } from '@nestjs/common';
import { Book, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/utilities/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(params: { data: Prisma.UserCreateInput }): Promise<User> {
    const { data } = params;
    return await this.prisma.user.create({ data });
  }

  async getUser(query): Promise<User> {
    return await this.prisma.user.findUnique({ where: query});
  }

  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
}
