import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';


export class RegisterDto {
  @ApiProperty()
  @IsString()
  frist_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;



  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
