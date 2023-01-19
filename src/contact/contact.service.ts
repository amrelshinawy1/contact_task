import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Contact } from 'database/contact.model';
import { Model } from 'mongoose';
import { EMPTY, from, Observable, of } from 'rxjs';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';
import { GATEWAY_MODEL } from '../database/database.constants';
import { CreateContactDto } from './create-contact.dto';
import { UpdateContactDto } from './update-contact.dto';

@Injectable({ scope: Scope.REQUEST })
export class ContactService {
  constructor(
    @Inject(GATEWAY_MODEL) private contactModel: Model<Contact>,
  ) { }

  findAll(keyword?: string, skip = 0, limit = 10): Observable<Contact[]> {
    if (keyword) {
      return from(
        this.contactModel
          .find({
            $or: [
              { name: { $regex: '.*' + keyword + '.*' } },
              { surName: { $regex: '.*' + keyword + '.*' } },
              { middleName: { $regex: '.*' + keyword + '.*' } }
            ]
          })
          .skip(skip)
          .limit(limit)
          .exec(),
      );
    } else {
      return from(this.contactModel.find({}).skip(skip).limit(limit).exec());
    }
  }

  findById(id: string): Observable<Contact> {
    return from(this.contactModel.findOne({ _id: id }).exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`contact:$id was not found`)),
    );
  }

  save(data: CreateContactDto): Observable<Contact> {
    //console.log('req.user:'+JSON.stringify(this.req.user));
    const createContact: Promise<Contact> = this.contactModel.create({
      ...data,
    });
    return from(createContact);
  }

  update(id: string, data: UpdateContactDto): Observable<Contact> {
    return from(
      this.contactModel
        .findOneAndUpdate(
          { _id: id },
          data,
          { new: true },
        )
        .exec(),
    ).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`contact:$id was not found`)),
    );
  }

  deleteById(id: string): Observable<Contact> {
    return from(this.contactModel.findOneAndDelete({ _id: id }).exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`contact:$id was not found`)),
    );
  }

  deleteAll(): Observable<any> {
    return from(this.contactModel.deleteMany({}).exec());
  }
}
