import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, OnboardingStatus } from './employee.entity';
import { PersonalInfoDto, PlanSelectionDto } from './dto/onboarding.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({ relations: ['company', 'pensionPlan'] });
  }

  async findByCompany(companyId: string): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: { companyId },
      relations: ['pensionPlan'],
    });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['company', 'pensionPlan'],
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({ where: { email } });
  }

  async create(data: Partial<Employee>): Promise<Employee> {
    const employee = this.employeeRepository.create(data);
    return this.employeeRepository.save(employee);
  }

  async upsertByEmail(data: Partial<Employee> & { email: string }): Promise<{ employee: Employee; created: boolean }> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      Object.assign(existing, data);
      const updated = await this.employeeRepository.save(existing);
      return { employee: updated, created: false };
    }
    const created = await this.create(data);
    return { employee: created, created: true };
  }

  // ============================================
  // TAREA 1: Implementar estos métodos
  // ============================================

  async getOnboardingProgress(employeeId: string): Promise<{
    employeeId: string;
    currentStatus: OnboardingStatus;
    completedSteps: string[];
    data: {
      personalInfo?: PersonalInfoDto;
      selectedPlanId?: string;
    };
  }> {
    // TODO: Implementar
    // - Obtener el empleado
    // - Retornar su progreso actual de onboarding
    // - Incluir los datos ya completados
    throw new Error('Not implemented - TAREA 1');
  }

  async updateOnboardingStep(
    employeeId: string,
    step: 'personal_info' | 'plan_selection' | 'confirmation',
    data: PersonalInfoDto | PlanSelectionDto | Record<string, never>,
  ): Promise<Employee> {
    // TODO: Implementar
    // - Validar que el paso es el correcto según el estado actual
    // - Actualizar los datos del empleado
    // - Actualizar el onboardingStatus
    // - Si es 'confirmation', marcar como completed
    throw new Error('Not implemented - TAREA 1');
  }
}
