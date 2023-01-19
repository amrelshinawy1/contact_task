import { IsNotEmpty } from "class-validator";

export class UpdateContactDto {

  @IsNotEmpty()
  readonly name: string;

}
