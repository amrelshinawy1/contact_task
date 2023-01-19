import { Connection } from 'mongoose';
import { createContactModel } from './contact.model';
import {
  DATABASE_CONNECTION, GATEWAY_MODEL,
  USER_MODEL
} from './database.constants';
import { createUserModel } from './user.model';

export const databaseModelsProviders = [
  {
    provide: GATEWAY_MODEL,
    useFactory: (connection: Connection) => createContactModel(connection),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) => createUserModel(connection),
    inject: [DATABASE_CONNECTION],
  },
];
