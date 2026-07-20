import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsIn } from 'class-validator';

export class GrantPermissionsDto {
  @ApiProperty({
    example: ['MENU_PUBLISH', 'MENU_ROLLBACK'],
    description: 'Permissions to grant',
    enum: ['MENU_PUBLISH', 'MENU_ROLLBACK'],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsIn(['MENU_PUBLISH', 'MENU_ROLLBACK'], { each: true })
  permissions!: string[];
}
