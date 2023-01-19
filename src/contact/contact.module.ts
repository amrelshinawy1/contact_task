import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ContactDataInitializerService } from './contact-data-initializer.service';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ContactController],
  providers: [ContactService, ContactDataInitializerService],
})
export class ContactModule{}
