import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User_Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'src/repository/users.repository';
import configuration from 'src/utilities/configuration';
import { LoginDTO } from 'src/utilities/dto/login.dto';
import { RegisterDto } from 'src/utilities/dto/register.dto';
import { UserAuthProfileDto } from '../utilities/dto/user.auth.dto';
import { UserDto } from '../utilities/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private usersRepository: UsersRepository,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const { password } = dto;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await this.usersRepository.createUser({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });

      return UserDto.mapUserToUserDto(newUser);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Already registered email');
      }
      throw error;
    }
  }

  private async signToken(
    id: string,
    email: string,
    role: User_Role,
  ): Promise<string> {
    const payload = {
      id,
      email,
      role,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: configuration.jwt.secret,
    });

    return token;
  }


  async login({ email, password }: LoginDTO) {
    try {
      const account = await this.usersRepository.getUser({ email });
      if (!account)
        throw new UnauthorizedException('Invalid  user eamil or password');
      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch)
        throw new UnauthorizedException('Invalid  user email or password');

      const access_token = await this.signToken(
        account.id,
        account.email,
        account.role,
      );

      const expires = new Date();
      expires.setSeconds(
        expires.getSeconds() + Number(this.config.get('JWT_EXPIRATION')),
      );
      return UserAuthProfileDto.mapUserToUserAuthProfileDto(
        account,
        configuration.jwt.tokenExpiration,
        access_token,
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }


  async findOneByUserId(id: string) {
    try {
      const account = await this.usersRepository.getUser({ id });
      return UserDto.mapUserToUserDto(account);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getUsers() {
    try {
      const users = await this.usersRepository.getUsers();
      return users.map((user) => UserDto.mapUserToUserDto(user));
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
