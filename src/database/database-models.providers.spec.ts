import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';
import { Contact, ContactModel } from './contact.model';
import { databaseModelsProviders } from './database-models.providers';
import {
  DATABASE_CONNECTION, GATEWAY_MODEL,
  USER_MODEL
} from './database.constants';
import { User, UserModel } from './user.model';

describe('DatabaseModelsProviders', () => {
  let conn: any;
  let userModel: any;
  let contactModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...databaseModelsProviders,

        {
          provide: DATABASE_CONNECTION,
          useValue: {
            model: jest
              .fn()
              .mockReturnValue({} as Model<User | Contact>),
          },
        },
      ],
    }).compile();

    conn = module.get<Connection>(DATABASE_CONNECTION);
    userModel = module.get<UserModel>(USER_MODEL);
    contactModel = module.get<ContactModel>(GATEWAY_MODEL);
  });

  it('DATABASE_CONNECTION should be defined', () => {
    expect(conn).toBeDefined();
  });

  it('USER_MODEL should be defined', () => {
    expect(userModel).toBeDefined();
  });

  it('POST_MODEL should be defined', () => {
    expect(contactModel).toBeDefined();
  });

});
