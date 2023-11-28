import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/const';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';
const envFilePath = `.env.${process.env.NODE_ENV || 'dev'}`;
@Module({
  imports: [
    ConfigModule.forRoot({
      // 是否是全局的
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        // envionment variables  : valid DB_PORT field
        DB_PORT: Joi.number().valid(3306, 3000, 3333).default(3306),
        // envionment variables  : valid DB_PORT field
        NODE_ENV: Joi.string().valid('dev', 'test', 'prod').default('dev'),
        DB_URL: Joi.string().domain(),
        DB_TYPE: Joi.string().valid('mysql', 'postgres'),
      }),
    }),
    // 第一种方式
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'example',
    //   database: 'testdb',
    //   entities: [],
    //   // 同步本地的schema与数据库 -> 初始化的时候去使用
    //   synchronize: true,
    //   logging: ['error'],
    // }),
    // 第二种方式
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          // 这里的type 需要在上面validationSchema内对DB_TYPE做类型断言才能,保证useFactory函数不报错
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [User, Profile, Logs, Roles],
          // 同步本地的schema与数据库 -> 初始化的时候去使用
          synchronize: configService.get(ConfigEnum.DB_SYNC),
          logging: ['error'],
        }) as TypeOrmModuleOptions,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
