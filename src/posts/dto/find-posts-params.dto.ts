import { IsDate, IsEnum, IsNumber, IsOptional } from "class-validator"
import { Type } from "class-transformer"

export enum OrderingValues {
  asc = 'asc',
  desc = 'desc'
}
export enum PostsOrderParamValues {
  publicationDate = 'publicationDate',
  name = 'name'
}
export class FindPostsParamsDto {

  @IsOptional()
  @IsNumber()
  take?: number

  @IsOptional()
  @IsNumber()
  skip?: number

  @IsOptional()
  @IsEnum(PostsOrderParamValues)
  order?: PostsOrderParamValues

  @IsOptional()
  @IsEnum(OrderingValues)
  ordering?: OrderingValues

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publicationDateFrom?: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publicationDateTo?: Date

  @IsOptional()
  @IsNumber()
  authorId?: number
}