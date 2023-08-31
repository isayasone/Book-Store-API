import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { UserService } from 'src/service/user.service';
import { RegisterDto } from 'src/utilities/dto/register.dto';
import { LoginDTO } from '../utilities/dto/login.dto';
import { UserAuthProfileDto } from '../utilities/dto/user.auth.dto';
import { UserDto } from 'src/utilities/dto/user.dto';
import { JwtAuthGuard, User_Role } from 'src/utilities';
import { Roles } from 'src/utilities/roles.decorator';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiResponse({
    description: `Add User`,
    type: UserDto,
    status: 201,
  })
  @Post()
  createUser(@Body(ValidationPipe) dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @ApiResponse({
    status: 201,
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

  @ApiResponse({
    description: `Get Users`,
    type: [UserDto],
    status: 200,
  })

  @Get()
  @Roles(User_Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return this.userService.getUsers();
  }

  @ApiResponse({
    description: `Get User by id`,
    type: UserDto,
    status: 200,
  })

  @Get(`:id`)
  @Roles(User_Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id) {
    if (!isUUID(id)) return new BadRequestException();
    return await this.userService.findOneByUserId(id);
  }

}
