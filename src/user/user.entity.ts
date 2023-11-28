import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import { Profile } from 'src/user/profile.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  AfterInsert,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // typescript -> 数据库 关联关系 Mapping
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];

  @ManyToMany(() => Roles, (roles) => roles.users)
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile: Profile;

  // service层调用save插入数据的时候触发的钩子
  @AfterInsert()
  afterInsert() {
    console.log('after in sert');
  }
  // service层调用remove删除数据的时候触发的钩子
  @AfterRemove()
  afterRemove() {
    console.log('after remove');
  }
}
