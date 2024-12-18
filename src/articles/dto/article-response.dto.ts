import { ApiProperty, PickType } from "@nestjs/swagger"
import { CreateArticleDto } from "./create-article.dto"

export class ArticleResponseDto extends PickType(CreateArticleDto, ['description', 'name'] as const) {

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