import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';
import { TokenPairResponseDto } from './token-pair-response.dto';

export class RegisterResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty({ type: TokenPairResponseDto })
  tokens!: TokenPairResponseDto;
}
