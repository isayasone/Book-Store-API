import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import configuration from 'src/utilities/configuration';
import { LoginDTO } from 'src/utilities/dto/login.dto';
import { RegisterDto } from 'src/utilities/dto/register.dto';
import { UserAuthProfileDto } from '../utilities/dto/user.auth.dto';
import { UserDto } from '../utilities/dto/user.dto';
import { UsersRepository } from 'src/repository/users.repository';
import { DefualtAdmin } from 'src/utilities/defualt.admin';

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

      return newUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Already registered email');
      }
      throw error;
    }
  }

  private async signToken(id: string, email: string): Promise<string> {
    const payload = {
      id,
      email,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: configuration.jwt.secret,
    });

    return token;
  }

  /**
   * Authentication  User
   * @param {LoginDTO}  :user user name and password.
   * @return {UserAuthProfileDto} userAuthProfileDto if  account found.
   * @return {UnauthorizedException} if user not found or invalid password or user name
   * @return {HttpStatus.BAD_REQUEST}  is user status is blocked
   */
  async login({ email, password }: LoginDTO) {
    try {
      if (email == 'admin@store.com' && password == 'Pass@4321')
        return DefualtAdmin;
      const account = await this.usersRepository.getUser({ email });
      if (!account)
        throw new UnauthorizedException('Invalid  user eamil or password');
      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch)
        throw new UnauthorizedException('Invalid  user email or password');

      const access_token = await this.signToken(account.id, account.email);

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

  /**
   * Returns userAuthProfileDto
   * find  from account table
   * @param {string} user_id: user id.
   * @return {UserAuthProfileDto} userAuthProfileDto if  account found.
   * @return {null} null if no account found.
   */
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
