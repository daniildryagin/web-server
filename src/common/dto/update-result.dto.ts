import { ApiProperty } from "@nestjs/swagger";
import { ObjectLiteral } from "typeorm";

export class UpdateResultDto {

  @ApiProperty()
  raw: any;

  @ApiProperty({
    type: Number
  })
  affected?: number;

  @ApiProperty()
  generatedMaps: ObjectLiteral[];
}