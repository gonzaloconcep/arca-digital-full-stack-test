import { IsString, IsNotEmpty, IsUUID, IsDateString, Matches, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PersonalInfoDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'García' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '12345678A', description: 'Spanish NIF format' })
  @IsString()
  @Matches(/^[0-9]{8}[A-Z]$/, { message: 'NIF must be 8 digits followed by a letter' })
  nif: string;

  @ApiProperty({ example: '1990-05-15' })
  @IsDateString()
  birthDate: string;
}

export class PlanSelectionDto {
  @ApiProperty({ example: 'uuid-of-plan' })
  @IsUUID()
  pensionPlanId: string;
}

export class OnboardingStepDto {
  @ApiProperty({ enum: ['personal_info', 'plan_selection', 'confirmation'] })
  @IsIn(['personal_info', 'plan_selection', 'confirmation'])
  step: 'personal_info' | 'plan_selection' | 'confirmation';
}
