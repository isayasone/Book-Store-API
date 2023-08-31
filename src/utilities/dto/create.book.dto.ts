import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { Book_Tag } from 'src/utilities';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  writer: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  point: number;


  @ApiProperty({
    description: 'List of  book tages',
    isArray: true,
    enum: Book_Tag
  })
  @IsEnum(Book_Tag, { each: true })
  tag: Book_Tag[];
}
