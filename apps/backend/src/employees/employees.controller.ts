import { Controller, Get, Param, Patch, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { Employee } from './employee.entity';
import { OnboardingStepDto, PersonalInfoDto, PlanSelectionDto } from './dto/onboarding.dto';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'List all employees' })
  async findAll(@Query('companyId') companyId?: string): Promise<Employee[]> {
    if (companyId) {
      return this.employeesService.findByCompany(companyId);
    }
    return this.employeesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  async findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.findOne(id);
  }

  // ============================================
  // TAREA 1: Endpoints de Onboarding
  // ============================================

  @Get(':id/onboarding')
  @ApiOperation({ summary: 'Get onboarding progress for an employee' })
  async getOnboardingProgress(@Param('id') id: string) {
    return this.employeesService.getOnboardingProgress(id);
  }

  @Patch(':id/onboarding')
  @ApiOperation({ summary: 'Update onboarding step' })
  async updateOnboardingStep(
    @Param('id') id: string,
    @Body() body: OnboardingStepDto & { data: PersonalInfoDto | PlanSelectionDto | Record<string, never> },
  ): Promise<Employee> {
    return this.employeesService.updateOnboardingStep(id, body.step, body.data);
  }
}
