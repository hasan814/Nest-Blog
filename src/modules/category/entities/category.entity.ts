import { Column, Entity, OneToMany } from "typeorm";
import { BlogCategoryEntity } from "src/modules/blog/entities/blog-category.entity";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enums";

@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  priority: number

  @OneToMany(() => BlogCategoryEntity, blog => blog.category)
  blog_categories: BlogCategoryEntity[]
}
