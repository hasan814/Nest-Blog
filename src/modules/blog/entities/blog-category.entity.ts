import { Column, Entity, ManyToOne } from "typeorm";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { BlogEntity } from "./blog.entity";
import { EntityName } from "src/common/enums/entity.enums";
import { BaseEntity } from "src/common/abstracts/base.entity";


@Entity(EntityName.BlogCategory)
export class BlogCategoryEntity extends BaseEntity {
  @Column()
  blogId: number;

  @Column()
  categoryId: number;

  @ManyToOne(() => BlogEntity, blog => blog.categories, { onDelete: "CASCADE" })
  blog: BlogEntity

  @ManyToOne(() => CategoryEntity, category => category.blog_categories, { onDelete: "CASCADE" })
  category: CategoryEntity
}