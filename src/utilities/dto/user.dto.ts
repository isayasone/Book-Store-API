import { ApiProperty } from '@nestjs/swagger';
import { User, User_Role } from '@prisma/client';

export class UserDto {
  @ApiProperty() id: string;
  @ApiProperty() frist_name: string;
  @ApiProperty() last_name: string;
  @ApiProperty() email: string;
  @ApiProperty() point: number;
  @ApiProperty() role: User_Role;

  static mapUserToUserDto(user: User) {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.frist_name = user.frist_name;
    userDto.last_name = user.last_name;
    userDto.email = user.email;
    userDto.role = user.role;
    userDto.point = user.point;
    return userDto;
  }
}
