import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EventsService, AnalyticsFunnel, EventsPerDay } from './events.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/event.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Track a new event' })
  async create(@Body() dto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List events with optional filters' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'sessionId', required: false })
  @ApiQuery({ name: 'type', required: false })
  async findAll(
    @Query('employeeId') employeeId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('type') type?: string,
  ): Promise<Event[]> {
    return this.eventsService.findAll({
      employeeId,
      sessionId,
      type: type as Event['type'],
    });
  }

  // ============================================
  // TAREA 3: Endpoints de Analytics
  // ============================================

  @Get('analytics/funnel')
  @ApiOperation({ summary: 'Get onboarding conversion funnel' })
  @ApiQuery({ name: 'startDate', required: false, description: 'ISO date string' })
  @ApiQuery({ name: 'endDate', required: false, description: 'ISO date string' })
  async getFunnel(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<AnalyticsFunnel> {
    return this.eventsService.getOnboardingFunnel(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('analytics/events-per-day')
  @ApiOperation({ summary: 'Get event count per day' })
  @ApiQuery({ name: 'startDate', required: false, description: 'ISO date string' })
  @ApiQuery({ name: 'endDate', required: false, description: 'ISO date string' })
  async getEventsPerDay(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<EventsPerDay[]> {
    return this.eventsService.getEventsPerDay(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}
