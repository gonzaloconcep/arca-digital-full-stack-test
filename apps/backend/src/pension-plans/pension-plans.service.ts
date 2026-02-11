import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PensionPlan } from './pension-plan.entity';

@Injectable()
export class PensionPlansService {
  constructor(
    @InjectRepository(PensionPlan)
    private readonly pensionPlanRepository: Repository<PensionPlan>,
  ) {}

  async findAll(): Promise<PensionPlan[]> {
    return this.pensionPlanRepository.find({
      order: { riskLevel: 'ASC' },
    });
  }

  async findOne(id: string): Promise<PensionPlan> {
    const plan = await this.pensionPlanRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Pension plan with ID ${id} not found`);
    }
    return plan;
  }

  async create(data: Partial<PensionPlan>): Promise<PensionPlan> {
    const plan = this.pensionPlanRepository.create(data);
    return this.pensionPlanRepository.save(plan);
  }
}
