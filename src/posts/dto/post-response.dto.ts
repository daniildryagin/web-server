import { ApiProperty, PickType } from "@nestjs/swagger"
import { CreatePostDto } from "./create-post.dto"

export class PostResponseDto extends PickType(CreatePostDto, ['description', 'name'] as const) {

  @ApiProperty({
    type: Number
  })
  readonly id: number

  @ApiProperty({
    type: Date
  })
  readonly publicationDate: Date

  @ApiProperty({
    type: Number
  })
  readonly authorId: number
}