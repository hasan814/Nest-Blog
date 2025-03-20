import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { BlogCommentEntity } from "src/modules/blog/entities/comment.entity";
import { BlogLikesEntity } from "src/modules/blog/entities/like.entity";
import { BlogBookEntity } from "src/modules/blog/entities/bookmark.entity";
import { ProfileEntity } from "./profile.entity";
import { ImageEntity } from "src/modules/image/entities/image.entity";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enums";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";
import { OtpEntity } from "./otp.entity";

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string

  @Column({ unique: true, nullable: true })
  phone: string

  @Column({ unique: true, nullable: true })
  email: string

  @Column({ nullable: true })
  new_email: string

  @Column({ nullable: true })
  new_phone: string

  @Column({ nullable: true, default: false })
  verify_email: boolean

  @Column({ nullable: true, default: false })
  verify_phone: boolean

  @Column({ nullable: true })
  password: string

  @Column({ nullable: true })
  otpId: number

  @Column({ nullable: true })
  profileId: number

  @OneToOne(() => OtpEntity, otp => otp.user, { nullable: true })
  @JoinColumn()
  otp: OtpEntity

  @OneToOne(() => ProfileEntity, profile => profile.user, { nullable: true })
  @JoinColumn()
  profile: ProfileEntity

  @OneToMany(() => BlogEntity, blog => blog.author)
  blogs: BlogEntity[]

  @OneToMany(() => BlogLikesEntity, like => like.user)
  blog_likes: BlogLikesEntity[]

  @OneToMany(() => BlogBookEntity, bookmark => bookmark.user)
  blog_bookmarks: BlogBookEntity[]

  @OneToMany(() => BlogCommentEntity, comment => comment.user)
  blog_comments: BlogCommentEntity[]

  @OneToMany(() => ImageEntity, image => image.user)
  images: ImageEntity

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
