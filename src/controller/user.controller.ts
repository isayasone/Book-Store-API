import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UnauthorizedException,
  ValidationPipe
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { UserService } from 'src/service/user.service';
import { RegisterDto } from 'src/utilities/dto/register.dto';
import { LoginDTO } from '../utilities/dto/login.dto';
import { UserAuthProfileDto } from '../utilities/dto/user.auth.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body(ValidationPipe) dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: UserAuthProfileDto,
  })
  @Post('login')
  public async login(@Body(ValidationPipe) credentials: LoginDTO) {
    try {
      return await this.userService.login(credentials);
    } catch (ex) {
      throw new UnauthorizedException();
    }
  }

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get(`:id`)
  async getUser(@Param('id') id) {
    if (!isUUID(id)) return new BadRequestException();
    return await this.userService.findOneByUserId(id);
  }


}
