import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty() id: number;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiProperty({ required: false }) avatarUrl?: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
