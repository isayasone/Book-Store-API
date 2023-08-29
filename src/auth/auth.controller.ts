import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UnauthorizedException,
  ValidationPipe,
  Version
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { RegisterDto } from './dtos';
import { LoginDTO } from './dtos/login.dto';
import { UserAuthProfileDto } from './dtos/user.auth.dto';
import { AuthService } from './services/auth.service';

@ApiTags('Account')
@Controller('user')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Post()
  createUser(@Body(ValidationPipe) dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: UserAuthProfileDto,
  })
  @Post('login')
  public async login(@Body(ValidationPipe) credentials: LoginDTO) {
    try {
      return await this.authService.login(credentials);
    } catch (ex) {
      throw new UnauthorizedException();
    }
  }



  @Get()
  async getUsers() {
    return this.authService.getUsers();
  }

  @Version('1')
  @Get(`:id`)
  async getUser(@Param('id') id) {
    if (!isUUID(id)) return new BadRequestException();
    return await this.authService.findOneByUserId(id);
  }


}
