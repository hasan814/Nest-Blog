import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { BlogCategoryEntity } from "src/modules/blog/entities/blog-category.entity"
import { BlogCommentEntity } from "src/modules/blog/entities/comment.entity"
import { BlogLikesEntity } from "src/modules/blog/entities/like.entity"
import { CategoryEntity } from "src/modules/category/entities/category.entity"
import { BlogBookEntity } from "src/modules/blog/entities/bookmark.entity"
import { ProfileEntity } from "src/modules/user/entities/profile.entity"
import { UserEntity } from "src/modules/user/entities/user.entity"
import { BlogEntity } from "src/modules/blog/entities/blog.entity"
import { OtpEntity } from "src/modules/user/entities/otp.entity"
import { ImageEntity } from "src/modules/image/entities/image.entity"
import { FollowEntity } from "src/modules/user/entities/follow.entity"


export function TypeOrmConfig(): TypeOrmModuleOptions {
  const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env
  return {
    type: "postgres",
    host: DB_HOST,
    port: +DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    autoLoadEntities: false,
    synchronize: false,
    entities: [
      OtpEntity,
      BlogEntity,
      UserEntity,
      ImageEntity,
      FollowEntity,
      ProfileEntity,
      BlogBookEntity,
      CategoryEntity,
      BlogLikesEntity,
      BlogCommentEntity,
      BlogCategoryEntity,
    ]
  }
}