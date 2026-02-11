import { IsString, IsNotEmpty, IsOptional, IsObject, IsIn, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '../event.entity';

const EVENT_TYPES: EventType[] = [
  'onboarding_started',
  'onboarding_step_personal_info',
  'onboarding_step_plan_selection',
  'onboarding_completed',
  'plan_viewed',
  'plan_selected',
];

export class CreateEventDto {
  @ApiProperty({ enum: EVENT_TYPES })
  @IsIn(EVENT_TYPES)
  type: EventType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
