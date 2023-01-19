import { Contact } from 'database/contact.model';
import { Observable, of } from 'rxjs';
import { ContactService } from './contact.service';
import { CreateContactDto } from './create-contact.dto';
import { UpdateContactDto } from './update-contact.dto';

export class ContactServiceStub implements Pick<ContactService, keyof ContactService> {
  private contacts: Contact[] = [
    {
      _id: '5ee49c3115a4e75254bb732e',
      name: 'contact 1'
    } as Contact,
    {
      _id: '5ee49c3115a4e75254bb732f',
      name: 'contact 2'
    } as Contact,
    {
      _id: '5ee49c3115a4e75254bb7330',
      name: 'contact 3'
    } as Contact,
  ];

  findAll(): Observable<Contact[]> {
    return of(this.contacts);
  }

  findById(id: string): Observable<Contact> {
    const { name } = this.contacts[0];
    return of({ _id: id, name } as Contact);
  }

  save(data: CreateContactDto): Observable<Contact> {
    return of({ _id: this.contacts[0]._id, ...data } as Contact);
  }

  update(id: string, data: UpdateContactDto): Observable<Contact> {
    return of({ _id: id, ...data } as Contact);
  }

  deleteById(id: string): Observable<Contact> {
    return of({ _id: id, name: 'contact 1'} as Contact);
  }

  deleteAll(): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
