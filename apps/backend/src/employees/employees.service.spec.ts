import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeesService } from './employees.service';
import { Employee } from './employee.entity';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let repository: Repository<Employee>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getRepositoryToken(Employee),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    repository = module.get<Repository<Employee>>(getRepositoryToken(Employee));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      const employees = [
        { id: '1', email: 'test@example.com' },
      ] as Employee[];
      mockRepository.find.mockResolvedValue(employees);

      const result = await service.findAll();

      expect(result).toEqual(employees);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['company', 'pensionPlan'],
      });
    });
  });

  describe('findOne', () => {
    it('should return an employee by id', async () => {
      const employee = { id: '1', email: 'test@example.com' } as Employee;
      mockRepository.findOne.mockResolvedValue(employee);

      const result = await service.findOne('1');

      expect(result).toEqual(employee);
    });

    it('should throw NotFoundException if employee not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        'Employee with ID nonexistent not found',
      );
    });
  });

  // TODO: Add more tests for onboarding methods (TAREA 1)
});
