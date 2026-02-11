import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PensionPlansService } from './pension-plans.service';
import { PensionPlan } from './pension-plan.entity';

@ApiTags('pension-plans')
@Controller('pension-plans')
export class PensionPlansController {
  constructor(private readonly pensionPlansService: PensionPlansService) {}

  @Get()
  @ApiOperation({ summary: 'List all available pension plans' })
  async findAll(): Promise<PensionPlan[]> {
    return this.pensionPlansService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pension plan by ID' })
  async findOne(@Param('id') id: string): Promise<PensionPlan> {
    return this.pensionPlansService.findOne(id);
  }
}
