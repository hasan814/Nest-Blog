import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enums";
import { UserEntity } from "./user.entity";

@Entity(EntityName.Follow)
export class FollowEntity extends BaseEntity {
  @Column()
  followingId: number;

  @Column()
  followerId: number

  @ManyToOne(() => UserEntity, user => user.following, { onDelete: 'CASCADE' })
  following: UserEntity

  @ManyToOne(() => UserEntity, user => user.followers, { onDelete: 'CASCADE' })
  follower: UserEntity

  @CreateDateColumn()
  created_at: Date

}