import {
  Controller,
  Get,
  Post,
  Headers,
  Query,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { GetUserDto } from './dto/get-user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { UnorderedBulkOperation } from 'typeorm';

@Controller('user')
@UseFilters(new TypeormFilter())
export class UserController {
  constructor(
    private userService: UserService,
    private configModule: ConfigService,
  ) {}
  @Get()
  getUsers(@Query() query: GetUserDto): any {
    /**
     * page-页码
     * limit-每页条数
     * condition 查询条件（username,role,gender）
     */
    console.log('Query', query);
    return this.userService.findAll(query);
  }

  @Get('/profile')
  getUserProfile(): any {
    return this.userService.findProfile(2);
  }

  @Get('/:id')
  getUser(@Query() query): any {
    console.log('Query', query);
    return 'hello world';
  }

  @Post()
  async addUser(@Body() userdto: any, @Headers() headers: any): Promise<any> {
    console.log('param12', userdto);
    console.log('headers', headers);
    const user = userdto as User;
    const res = await this.userService.create(user);
    return res;
  }

  @Patch('/:id')
  updateUser(
    @Body() dto: any,
    @Param('id') id: number,
    @Headers('Authorization') headers: any,
  ): any {
    // 权限1：判断用户是否是自己
    // 权限2：判断用户是否有更新user的权限
    // 返回数据：不能包含敏感的password等信息
    console.log('header', headers);
    if (id == headers) {
      const user = dto as User;
      return this.userService.update(id, user);
    } else {
      throw new UnauthorizedException();
    }
  }
  // 1.controller 名 vs services 名 vs repository名应该怎么取
  // 2.typeorm里面delete与remove的区别
  @Delete('/:id')
  deleteUser(@Param('id') id: number): any {
    // :TODO  传递参数id
    return this.userService.remove(id);
  }

  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }
}
