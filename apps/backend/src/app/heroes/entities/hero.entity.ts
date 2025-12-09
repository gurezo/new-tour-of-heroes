import { ApiProperty } from '@nestjs/swagger';

export class Hero {
  @ApiProperty({ description: 'Hero ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Hero name', example: 'Dr. Nice' })
  name: string;
}
