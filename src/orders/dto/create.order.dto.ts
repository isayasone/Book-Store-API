import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize ,IsString } from 'class-validator';


export class CreateOrderDto {
  @ApiProperty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  book_ids: string[];
}
