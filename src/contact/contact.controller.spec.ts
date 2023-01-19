import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Contact } from 'database/contact.model';
import { Response } from 'express';
import { lastValueFrom, Observable, of } from 'rxjs';
import { anyNumber, anyString, instance, mock, verify, when } from 'ts-mockito';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactServiceStub } from './contact.service.stub';
import { CreateContactDto } from './create-contact.dto';
import { UpdateContactDto } from './update-contact.dto';

describe('Contact Controller', () => {
  describe('Replace ContactService in provider(useClass: ContactServiceStub)', () => {
    let controller: ContactController;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: ContactService,
            useClass: ContactServiceStub,
          },
        ],
        controllers: [ContactController],
      }).compile();

      controller = await module.resolve<ContactController>(ContactController);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('GET on /contacts should return all contacts', async () => {
      const contacts = await lastValueFrom(controller.getAllContacts());
      expect(contacts.length).toBe(3);
    });

    it('GET on /contacts/:id should return one contact ', (done) => {
      controller.getContactById('1').subscribe((data) => {
        expect(data._id).toEqual('1');
        done();
      });
    });

    it('POST on /contacts should save contact', async () => {
      const contact: CreateContactDto = {
        name: 'contact 1',
        phoneNumber: '+201273604089',
        surName: 'amr'
      };
      const saved = await lastValueFrom(
        controller.createContact(
          contact,
          createMock<Response>({
            status: jest.fn().mockReturnValue({
              send: jest.fn().mockReturnValue({
                status: 201,
              }),
            }),
          }),
        ),
      );
      // console.log(saved);
      expect(saved.status).toBe(201);
    });

    it('PUT on /contacts/:id should update the existing contact', (done) => {
      const contact: UpdateContactDto = {
        name: 'contact 1',
      };
      controller
        .updateContact(
          '1',
          contact,
          createMock<Response>({
            status: jest.fn().mockReturnValue({
              send: jest.fn().mockReturnValue({
                status: 204,
              }),
            }),
          }),
        )
        .subscribe((data) => {
          expect(data.status).toBe(204);
          done();
        });
    });

    it('DELETE on /contacts/:id should delete contact', (done) => {
      controller
        .deleteContactById(
          '1',
          createMock<Response>({
            status: jest.fn().mockReturnValue({
              send: jest.fn().mockReturnValue({
                status: 204,
              }),
            }),
          }),
        )
        .subscribe((data) => {
          expect(data).toBeTruthy();
          done();
        });
    });
  });

  describe('Replace ContactService in provider(useValue: fake object)', () => {
    let controller: ContactController;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: ContactService,
            useValue: {
              findAll: (_keyword?: string, _skip?: number, _limit?: number) =>
                of<any[]>([
                  {
                    _id: 'testid',
                    serial: '123_456_789',
                    name: 'contact 1',
                    ip4address: '192.168.0.1'
                              },
                ]),
            },
          },
        ],
        controllers: [ContactController],
      }).compile();

      controller = await module.resolve<ContactController>(ContactController);
    });

    it('should get all contacts(useValue: fake object)', async () => {
      const result = await lastValueFrom(controller.getAllContacts());
      expect(result[0]._id).toEqual('testid');
    });
  });

  describe('Replace ContactService in provider(useValue: jest mocked object)', () => {
    let controller: ContactController;
    let contactService: ContactService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: ContactService,
            useValue: {
              constructor: jest.fn(),
              findAll: jest
                .fn()
                .mockImplementation(
                  (_keyword?: string, _skip?: number, _limit?: number) =>
                    of<any[]>([
                      {
                        _id: 'testid',
                        serial: '123_456_789',
                        name: 'contact 1',
                        ip4address: '192.168.0.1'
                                      },
                    ]),
                ),
            },
          },
        ],
        controllers: [ContactController],
      }).compile();

      controller = await module.resolve<ContactController>(ContactController);
      contactService = module.get<ContactService>(ContactService);
    });

    it('should get all contacts(useValue: jest mocking)', async () => {
      const result = await lastValueFrom(controller.getAllContacts('test', 10, 0));
      expect(result[0]._id).toEqual('testid');
      expect(contactService.findAll).toBeCalled();
      expect(contactService.findAll).lastCalledWith('test', 0, 10);
    });
  });

  describe('Mocking ContactService using ts-mockito', () => {
    let controller: ContactController;
    const mockedContactService: ContactService = mock(ContactService);

    beforeEach(async () => {
      controller = new ContactController(instance(mockedContactService));
    });

    it('should get all contacts(ts-mockito)', async () => {
      when(
        mockedContactService.findAll(anyString(), anyNumber(), anyNumber()),
      ).thenReturn(
        of([
          {
            _id: 'testid',
            name: 'contact 1'
          },
        ]) as Observable<Contact[]>,
      );
      const result = await lastValueFrom(controller.getAllContacts('', 10, 0));
      expect(result.length).toEqual(1);
      expect(result[0].name).toBe('contact 1');
      verify(
        mockedContactService.findAll(anyString(), anyNumber(), anyNumber()),
      ).once();
    });
  });
});
