import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity("roles", { schema: "testdb" })
export class Roles {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({
    name: "users_roles",
    joinColumns: [{ name: "rolesId", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "userId", referencedColumnName: "id" }],
    schema: "testdb",
  })
  users: User[];
}
