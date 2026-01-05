import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  subscription_id: string;

  @IsInt()
  amount_cents: number;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  transaction_ref?: string;
}
