import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsString, Length } from "class-validator";
import { Optional } from "@nestjs/common";

export class UpdateUserDto extends PartialType(CreateUserDto) {
}