import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateHeroDto {
  @ApiProperty({ description: 'Hero name', example: 'Dr. Nice' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
