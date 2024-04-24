import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SignupDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(16)
  @Matches(/^[a-z0-9._]+$/, {
    message: 'username.invalid_characters',
  })
  @ApiProperty()
  username: string;

  @Expose()
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;
}
