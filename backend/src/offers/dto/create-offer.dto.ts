import { IsBoolean, IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
