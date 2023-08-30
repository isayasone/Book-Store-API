import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { Book_Status, Order_status } from 'src/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderRepository  {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(customer_id:string,book_ids:string[],point:number,customerLeftPoint:number): Promise<Order> { 
    return await this.prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {customer_id,point }});
       const books = await Promise.all( book_ids.map(async (id) => {   
      return  await tx.book.update({
            where: { id},
            data: {
              status: Book_Status.ORDERED,
              order_id: order.id,
            },
          });
        }));
       await tx.user.update({where:{id:customer_id},data:{point:customerLeftPoint}})
        return {...order, books};
      });
  }
  async cancelOrder(orderId,customer_id ,customer_point): Promise<Order> {
    return await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where:{id:orderId},
        data: {status:Order_status.CANCELED },include: { books:{select:{id:true}}}});
     const  {books,point}=order;
     await Promise.all( books.map(async (book) => {   
    return  await tx.book.update({
          where: { id:book.id},
          data: {
            status: Book_Status.AVAILABLE,
            order_id: null,
          },
        });
      }));
   const returnPoint=customer_point+point
     await tx.user.update({where:{id:customer_id},data:{point:returnPoint}})
      return order;
    });
  }

  async deliverOrder(orderId)
  {
    return await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where:{id:orderId},
        data: {status:Order_status.DELIVERED },include: { books:{select:{id:true}}}});
     const  {books}=order;
     const soldBook = await Promise.all( books.map(async (book) => {   
    return  await tx.book.update({
          where: { id:book.id},
          data: {
            status: Book_Status.SOLD,
          },
        });
      }));
      return {...order,books:soldBook};
    });

  }


  async getOrder(id): Promise<Order> {
    return await this.prisma.order.findUnique({ where: { id },include:{books:true} });
  }

  async getOrders(): Promise<Order[]> {
    return await this.prisma.order.findMany({include:{books:true}});
  }

  



}
