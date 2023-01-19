import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

interface Contact extends Document {
  readonly name: string;
  readonly middleName: string;
  readonly surName: string;
  readonly phoneNumber: string;
  readonly note: string;
  readonly location: Point;
}
interface Point {
  type: string;
  coordinates: number[];
}

type ContactModel = Model<Contact>;

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const ContactSchema = new Schema<Contact>(
  {
    name: {type: SchemaTypes.String, required: true},
    middleName: {type: SchemaTypes.String, required: false},
    surName: {type: SchemaTypes.String, required: true},
    phoneNumber: {type: SchemaTypes.String, required: true},
    note: {type: SchemaTypes.String, required: false},
    location: {
      type: pointSchema,
      required: false
    }
    },
  { timestamps: true },
);

const createContactModel: (conn: Connection) => ContactModel = (conn: Connection) =>
  conn.model<Contact>('Contact', ContactSchema, 'Contacts');

export { Contact, ContactModel, createContactModel };
