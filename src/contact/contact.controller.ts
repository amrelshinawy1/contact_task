import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  Scope
} from '@nestjs/common';
import { Contact } from 'database/contact.model';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParseObjectIdPipe } from '../shared/pipe/parse-object-id.pipe';
import { ContactService } from './contact.service';
import { CreateContactDto } from './create-contact.dto';
import { UpdateContactDto } from './update-contact.dto';

@Controller({ path: 'contacts', scope: Scope.REQUEST })
export class ContactController {
  constructor(private contactService: ContactService) { }

  @Get('')
  getAllContacts(
    @Query('q') keyword?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ): Observable<Contact[]> {
    return this.contactService.findAll(keyword, skip, limit);
  }

  @Get(':id')
  getContactById(@Param('id', ParseObjectIdPipe) id: string): Observable<Contact> {
    return this.contactService.findById(id);
  }

  @Post('')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @HasRoles(RoleType.USER, RoleType.ADMIN)
  createContact(
    @Body() contact: CreateContactDto,
    @Res() res: Response,
  ): Observable<Response> {
    return this.contactService.save(contact).pipe(
      map((contact: Contact) => {
        return res
          .status(201)
          .send({id: contact._id });
      }),
    );
  }

  @Put(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @HasRoles(RoleType.USER, RoleType.ADMIN)
  updateContact(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() contact: UpdateContactDto,
    @Res() res: Response,
  ): Observable<Response> {
    return this.contactService.update(id, contact).pipe(
      map(() => {
        return res.status(200).send();
      }),
    );
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @HasRoles(RoleType.ADMIN)
  deleteContactById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: Response,
  ): Observable<Response> {
    return this.contactService.deleteById(id).pipe(
      map(() => {
        return res.status(200).send({message: `contact with id: ${id} Deleted.`});
      }),
    );
  }

}
