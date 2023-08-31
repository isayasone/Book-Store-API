import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { AuthUser } from 'src/utilities/authUser.decorator';
import { JwtAuthGuard } from 'src/utilities/jwt-auth.guard';
import { OrdersService } from '../service/order.service';
import { CreateOrderDto } from '../utilities/dto/create.order.dto';
import { OrderDto } from '../utilities/dto/order.dto';

// @ApiBearerAuth()
@ApiTags('Order')
@ApiBearerAuth()
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
  @ApiParam({
    name: 'id',
    required: true,
    description: 'order id',
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
  @ApiParam({
    name: 'id',
    required: true,
    description: 'order id',
  })
  // @Roles(User_Role.ADMIN)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async deliverOrder(@Param('id') id) {
    if (!isUUID(id)) return new BadRequestException();
    return await this.ordersService.deliverOrder(id);
  }


  @ApiResponse({
    description: ` List of orders`,
    type: [OrderDto],
    status: 200,
  })
  @Get()
  async getOrders() {
    return await this.ordersService.getOrders();
  }

  @ApiResponse({
    description: `pending orders`,
    type: [OrderDto],
    status: 200,
  })
  @Get('/pending')
  async getPendingOrder() {
    return await this.ordersService.getPendingOrder();
  }

  @ApiResponse({
    description: `pending orders`,
    type: [OrderDto],
    status: 200,
  })
  @Get('/pending')
  async getCanceledOrder() {
    return await this.ordersService.getCanceledOrders();
  }


  @ApiResponse({
    description: `User Order List`,
    type: [OrderDto],
    status: 200,
  })
  @Get(`/user-order/`)
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@AuthUser() user) {
    return await this.ordersService.getUserOrders(user.id)
  }

}
