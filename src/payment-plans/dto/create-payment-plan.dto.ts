import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  price_cents: number;

  @IsInt()
  @Min(1)
  duration_days: number;

  @IsOptional()
  @IsString()
  description?: string;
}
