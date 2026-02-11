import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsService } from './events.service';
import { Event } from './event.entity';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      select: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const eventDto = {
        type: 'onboarding_started' as const,
        sessionId: 'session-123',
        employeeId: 'emp-123',
        payload: { step: 1 },
      };

      const savedEvent = { id: 'event-1', ...eventDto, timestamp: new Date() };
      mockRepository.create.mockReturnValue(savedEvent);
      mockRepository.save.mockResolvedValue(savedEvent);

      const result = await service.create(eventDto);

      expect(result).toEqual(savedEvent);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // TODO: Implement tests for TAREA 3
  // Tests should cover:
  // - getOnboardingFunnel calculation
  // - getEventsPerDay aggregation
  // - Date filtering

  describe('getOnboardingFunnel', () => {
    it.todo('should calculate funnel conversion rates');
    it.todo('should filter by date range');
    it.todo('should handle empty data');
  });

  describe('getEventsPerDay', () => {
    it.todo('should aggregate events by day');
    it.todo('should filter by date range');
    it.todo('should return empty array when no events');
  });
});
