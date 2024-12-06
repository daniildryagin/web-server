import { Post } from "src/posts/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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