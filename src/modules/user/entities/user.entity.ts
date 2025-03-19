import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";
import { ProfileEntity } from "./profile.entity";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enums";
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

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
