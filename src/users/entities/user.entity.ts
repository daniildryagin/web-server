import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../../posts/entities/post.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: false })
  isAdmin: boolean

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[]
}