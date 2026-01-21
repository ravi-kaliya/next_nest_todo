// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
import { MailerConfigModule } from './mailer/mailer.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB connection
    MongooseModule.forRoot(process.env.MONGO_URI ?? ''),

    // Core feature modules
    AuthModule,
    UsersModule,
    TodoModule,

    // Infrastructure modules
    RedisModule,
    MailerConfigModule,
  ],
  
})
export class AppModule { }
