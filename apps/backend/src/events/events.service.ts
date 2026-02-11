import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventType } from './event.entity';
import { CreateEventDto } from './dto/event.dto';

export interface FunnelStep {
  step: string;
  count: number;
  conversionRate: number;
}

export interface AnalyticsFunnel {
  totalStarted: number;
  totalCompleted: number;
  overallConversionRate: number;
  steps: FunnelStep[];
}

export interface EventsPerDay {
  date: string;
  count: number;
}

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create({
      type: dto.type,
      employeeId: dto.employeeId ?? null,
      sessionId: dto.sessionId,
      payload: dto.payload ?? {},
    });
    return this.eventRepository.save(event);
  }

  async findAll(filters?: {
    employeeId?: string;
    sessionId?: string;
    type?: EventType;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Event[]> {
    const query = this.eventRepository.createQueryBuilder('event');

    if (filters?.employeeId) {
      query.andWhere('event.employeeId = :employeeId', { employeeId: filters.employeeId });
    }
    if (filters?.sessionId) {
      query.andWhere('event.sessionId = :sessionId', { sessionId: filters.sessionId });
    }
    if (filters?.type) {
      query.andWhere('event.type = :type', { type: filters.type });
    }
    if (filters?.startDate) {
      query.andWhere('event.timestamp >= :startDate', { startDate: filters.startDate });
    }
    if (filters?.endDate) {
      query.andWhere('event.timestamp <= :endDate', { endDate: filters.endDate });
    }

    return query.orderBy('event.timestamp', 'DESC').getMany();
  }

  // ============================================
  // TAREA 3: Implementar estos métodos
  // ============================================

  async getOnboardingFunnel(startDate?: Date, endDate?: Date): Promise<AnalyticsFunnel> {
    // TODO: Implementar
    // Query SQL para calcular el funnel de conversión del onboarding:
    // - onboarding_started → onboarding_step_personal_info → onboarding_step_plan_selection → onboarding_completed
    // - Calcular conversión entre cada paso
    // - Retornar métricas agregadas
    //
    // Hint: Usar GROUP BY y COUNT para contar eventos por tipo
    // Hint: La conversión es (eventos_paso_N / eventos_paso_N-1) * 100

    throw new Error('Not implemented - TAREA 3');
  }

  async getEventsPerDay(startDate?: Date, endDate?: Date): Promise<EventsPerDay[]> {
    // TODO: Implementar
    // Query SQL para contar eventos por día
    // - Agrupar por fecha (DATE(timestamp))
    // - Ordenar por fecha ascendente
    // - Filtrar por rango de fechas si se proporcionan

    throw new Error('Not implemented - TAREA 3');
  }
}
