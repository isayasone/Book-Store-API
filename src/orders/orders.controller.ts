import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { AuthUser } from 'src/common/authUser.decorator';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { CreateOrderDto } from './dto/create.order.dto';
import { OrderDto } from './dto/order.dto';
import { OrdersService } from './order.service';

// @ApiBearerAuth()
@ApiTags('Order')
@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiResponse({
    description: `order books`,
    type: OrderDto,
    status: 201,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async addOrder(@Body(ValidationPipe) dto: CreateOrderDto, @AuthUser() user) {
    return await this.ordersService.orderBooks(dto, user.id);
  }

  @ApiResponse({
    description: `cancel order`,
    type: OrderDto,
    status: 200,
  })
  @Put(`cancel/:id`)
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Param('id') id, @AuthUser() user) {
    if (!isUUID(id)) return new BadRequestException();
    return await this.ordersService.cancelOrder(id, user.id);
  }

  @ApiResponse({
    description: `deliver order`,
    type: OrderDto,
    status: 200,
  })
  @Put(`deliver/:id`)
  @UseGuards(JwtAuthGuard)
  async deliverOrder(@Param('id') id) {
    if (!isUUID(id)) return new BadRequestException();
    return await this.ordersService.deliverOrder(id);
  }
}
