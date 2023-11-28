import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Logs } from "./Logs";
import { Profile } from "./Profile";
import { Roles } from "./Roles";

@Entity("user", { schema: "testdb" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "username", length: 255 })
  username: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];

  @OneToOne(() => Profile, (profile) => profile.u)
  profile: Profile;

  @ManyToMany(() => Roles, (roles) => roles.users)
  roles: Roles[];
}
