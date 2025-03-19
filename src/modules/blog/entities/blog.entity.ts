import { Entity, Column, UpdateDateColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { BlogCommentEntity } from "./comment.entity";
import { BlogLikesEntity } from "./like.entity";
import { BlogBookEntity } from "./bookmark.entity";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enums";
import { BlogStatus } from "../enum/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity(EntityName.Blog)
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column()
  image: string;

  @Column({ default: BlogStatus.Draft })
  status: string;

  @Column()
  authorId: number;

  @ManyToOne(() => UserEntity, user => user.blogs, { onDelete: "CASCADE" })
  author: UserEntity

  @OneToMany(() => BlogLikesEntity, like => like.blog)
  likes: BlogLikesEntity[]

  @OneToMany(() => BlogBookEntity, bookmark => bookmark.blog)
  bookmarks: BlogBookEntity[]

  @OneToMany(() => BlogCommentEntity, comment => comment.blog)
  comments: BlogCommentEntity[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
