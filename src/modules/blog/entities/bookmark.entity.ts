import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { EntityName } from "src/common/enums/entity.enums";
import { BlogEntity } from "./blog.entity";


@Entity(EntityName.BlogBookmark)
export class BlogBookEntity extends BaseEntity {
  @Column()
  blogId: number;

  @Column()
  userId: number

  @ManyToOne(() => UserEntity, user => user.blog_bookmarks, { onDelete: "CASCADE" })
  user: UserEntity

  @ManyToOne(() => BlogEntity, blog => blog.bookmarks, { onDelete: "CASCADE" })
  blog: BlogEntity
}