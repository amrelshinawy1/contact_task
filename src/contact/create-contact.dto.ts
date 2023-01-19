import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
export class CreateContactDto {

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly surName: string;
  
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phoneNumber: string;
  
}
