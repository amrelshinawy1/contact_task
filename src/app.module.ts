import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    DatabaseModule,
    ContactModule,
    AuthModule,
    UserModule,
    LoggerModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[AppService]
})
export class AppModule { }
