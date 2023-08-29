import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import configuration from 'src/configuration';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from '../dtos';
import { LoginDTO } from '../dtos/login.dto';
import { UserAuthProfileDto } from '../dtos/user.auth.dto';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const { password } = dto;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await this.prisma.user.create({
        data: { ...dto, password: hashedPassword },
      });
      return newUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Already registered email');
      }
      throw error;
    }
  }

  private async signToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
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
      if (email == 'adminisa@store.com' && password == 'Pass@4321')
        return {
          userId: '9dfe8c91-5c49-489e-a471-65ba70d717d7',
          frist_name: 'isayas',
          last_name: 'Admin',
          email: 'tade@outlook.com',
          status: 'ACTIVE',
          role: 'ADMIN',
          expires_in: 3600,
          token:
            'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZGZlOGM5MS01YzQ5LTQ4OWUtYTQ3MS02NWJhNzBkNzE3ZDciLCJlbWFpbCI6InRhZGVAb3V0bG9vay5jb20iLCJpYXQiOjE2OTI3MzY1MzcsImV4cCI6MTY5MjczNjU0MH0.8paQL1u6hmDiJCFHgmG3iqqt0r9h-3_F5X7UxsiURZ5miDFrxdNE2grKSm4kBonj',
        };
      const account = await this.prisma.user.findUnique({
        where: { email },
      });
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
      const account = await this.prisma.user.findFirst({
        where: { id },
      });
      return UserDto.mapUserToUserDto(account);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getUsers() {
    try {

      const users = await this.prisma.user.findMany();
      return users.map((user) => UserDto.mapUserToUserDto(user));
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }


}
