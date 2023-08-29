import { ApiProperty } from '@nestjs/swagger';


export class UserDto {
  @ApiProperty() id: string;
  @ApiProperty() frist_name: string;
  @ApiProperty() last_name: string;
  @ApiProperty() email: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  static mapUserToUserDto(user: any) {
    const userAuthProfileDto = new UserDto();
    userAuthProfileDto.id = user.id;
    userAuthProfileDto.frist_name = user.frist_name;
    userAuthProfileDto.last_name = user.last_name;
    userAuthProfileDto.email = user.email;
    userAuthProfileDto.createdAt = user.createdAt;
    userAuthProfileDto.updatedAt = user.updatedAt;
    return userAuthProfileDto;
  }
}
