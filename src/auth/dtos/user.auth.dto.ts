import { ApiProperty } from '@nestjs/swagger';
export class UserAuthProfileDto {
  @ApiProperty() userId?: string;
  @ApiProperty() frist_name: string;
  @ApiProperty() last_name: string;
  @ApiProperty() email: string;
  @ApiProperty() expires_in: number;
  @ApiProperty() token?: string;
  static mapUserToUserAuthProfileDto(
    user: any,
    tokenExp?: number,
    token?: string,
  ) {
    const userAuthProfileDto = new UserAuthProfileDto();
    userAuthProfileDto.userId = user.id;
    userAuthProfileDto.frist_name = user.frist_name;
    userAuthProfileDto.last_name = user.last_name;
    userAuthProfileDto.email = user.email;
    userAuthProfileDto.expires_in = tokenExp;
    userAuthProfileDto.token = token;
    return userAuthProfileDto;
  }
}
