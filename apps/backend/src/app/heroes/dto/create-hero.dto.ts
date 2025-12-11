import { ApiProperty } from '@nestjs/swagger';

export class CreateHeroDto {
  @ApiProperty({ description: 'Hero name', example: 'Dr. Nice' })
  name!: string;
}
