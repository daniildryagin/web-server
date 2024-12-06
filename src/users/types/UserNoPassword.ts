import { OmitType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class UserNoPassword extends OmitType(User, ['password', 'posts'] as const) {

}