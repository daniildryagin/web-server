import { ApiProperty } from "@nestjs/swagger"

export class Tokens {

  @ApiProperty({ type: String })
  access_token: string

  @ApiProperty({ type: String })
  refresh_token: string
}