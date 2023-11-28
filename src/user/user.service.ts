import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from 'src/logs/logs.entity';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRespository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRespository: Repository<Logs>,
  ) {}

  findAll(query: GetUserDto) {
    const { limit, page, role, gender, username } = query;
    const take = limit || 10;
    const skip = (page - 1) * limit;
    // 1: SELECT * FROM user u,profile p,role r WHERE u.id = p.uid AND u.id = r.uid And...
    // 2: SELECT * FROM user u LEFT JOIN profile p ON u.id = p.uid LEFT JOIN role r ON u.id = r.uid WHERE ...
    // 3: 分页 SQL -> LIMIT 10 OFFSET 10
    return this.userRespository.find({
      select: {
        // 指定users表返回id、username字段
        id: true,
        username: true,
        // 指定profile表只返回gender字段
        profile: {
          gender: true,
        },
      },
      // 关联profile表和roles表查询
      relations: {
        profile: true,
        roles: true,
      },
      where: {
        // username 是user表的自由字段
        username,
        // profile表的gender字段
        profile: {
          gender,
        },
        // roles表的id字段
        roles: {
          id: role,
        },
      },
      take,
      skip, // (2 - 1) * 10 = 10
    });
  }
  find(username: string) {
    return this.userRespository.findOne({ where: { username } });
  }
  findOne(id: number) {
    return this.userRespository.findOne({ where: { id } });
  }
  async create(user: User) {
    const userTmp = this.userRespository.create(user);
    return this.userRespository.save(userTmp);
  }
  update(id: number, user: Partial<User>) {
    return this.userRespository.update(id, user);
  }
  remove(id: number) {
    return this.userRespository.delete(id);
  }
  // 联合查询
  findProfile(id: number) {
    return this.userRespository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }
  async findUserLogs(id: number) {
    const user = await this.findOne(id);
    return this.logsRespository.find({
      where: {
        user,
      },
      relations: {
        user: true,
      },
    });
  }
}
