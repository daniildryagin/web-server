import { IsDate, IsEnum, IsNumber, IsOptional } from "class-validator"
import { Type } from "class-transformer"
import { ApiPropertyOptional } from "@nestjs/swagger"

export enum OrderingValues {
  Asc = 'asc',
  Desc = 'desc'
}

export enum PostsOrderParamValues {
  PublicationDate = 'publicationDate',
  Name = 'name'
}

export class FindPostsParamsDto {

  @ApiPropertyOptional({
    type: Number,
    description: 'Кол-во статей',
    default: 10
  })
  @IsOptional()
  @IsNumber()
  take?: number = 10

  @ApiPropertyOptional({
    type: Number,
    description: 'Кол-во пропущенных статей',
    default: 0
  })
  @IsOptional()
  @IsNumber()
  skip?: number = 0

  @ApiPropertyOptional({
    enum: PostsOrderParamValues,
    description: 'Сортировка по',
    default: PostsOrderParamValues.PublicationDate
  })
  @IsOptional()
  @IsEnum(PostsOrderParamValues)
  order?: PostsOrderParamValues = PostsOrderParamValues.PublicationDate

  @ApiPropertyOptional({
    enum: OrderingValues,
    description: 'По возрастанию / по убыванию',
    default: OrderingValues.Desc
  })
  @IsOptional()
  @IsEnum(OrderingValues)
  ordering?: OrderingValues = OrderingValues.Desc

  @ApiPropertyOptional({
    type: Date,
    description: 'Начальная дата',
    default: new Date(0)
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publicationDateFrom?: Date = new Date(0)

  @ApiPropertyOptional({
    type: Date,
    description: 'Конечная дата',
    default: new Date(Date.now())
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publicationDateTo?: Date = new Date(Date.now())

  @ApiPropertyOptional({
    type: Date,
    description: 'ID автора'
  })
  @IsOptional()
  @IsNumber()
  authorId?: number
}