import { Column, Entity, OneToOne } from "typeorm";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enums";
import { UserEntity } from "./user.entity";

@Entity(EntityName.Otp)
export class OtpEntity extends BaseEntity {
  @Column()
  code: string
  @Column()
  expiresIn: Date
  @Column()
  userId: number
  @OneToOne(() => UserEntity, user => user.otp, { onDelete: "CASCADE" })
  user: UserEntity
}