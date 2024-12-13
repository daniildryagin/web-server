import { ApiProperty, PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class UserResponseDto extends PickType(CreateUserDto, ['email', 'username', 'isAdmin']) {

  @ApiProperty({
    type: Number
  })
  readonly id: number
}