import { OrderDto } from './order.dto';

export class UserOrderDto extends OrderDto {
  constructor() {
    super();
    delete this.customerName;
    delete this.customerEmail;
  }
}
