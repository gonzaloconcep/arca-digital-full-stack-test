import { DataSource } from 'typeorm';
import { Company } from '../../companies/company.entity';
import { Employee } from '../../employees/employee.entity';
import { PensionPlan } from '../../pension-plans/pension-plan.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5432,
  database: process.env.DATABASE_NAME,
  schema: process.env.DATABASE_SCHEMA || 'public',
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  entities: [Company, Employee, PensionPlan],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function seed() {
  console.log('Connecting to database...');
  await dataSource.initialize();
  console.log('Connected.');

  const companyRepo = dataSource.getRepository(Company);
  const employeeRepo = dataSource.getRepository(Employee);
  const pensionPlanRepo = dataSource.getRepository(PensionPlan);

  // Clear existing data
  console.log('Clearing existing data...');
  await employeeRepo.createQueryBuilder().delete().execute();
  await companyRepo.createQueryBuilder().delete().execute();
  await pensionPlanRepo.createQueryBuilder().delete().execute();

  // Seed Pension Plans
  console.log('Seeding pension plans...');
  const plans = await pensionPlanRepo.save([
    {
      name: 'Plan Conservador',
      description: 'Inversión en renta fija de alta calidad. Ideal para perfiles que priorizan la estabilidad sobre la rentabilidad.',
      riskLevel: 'conservative' as const,
      expectedReturnMin: 1.5,
      expectedReturnMax: 3.0,
      managementFee: 0.5,
    },
    {
      name: 'Plan Equilibrado',
      description: 'Combinación de renta fija y variable. Balance entre seguridad y potencial de crecimiento.',
      riskLevel: 'balanced' as const,
      expectedReturnMin: 3.0,
      expectedReturnMax: 6.0,
      managementFee: 0.8,
    },
    {
      name: 'Plan Dinámico',
      description: 'Mayor exposición a renta variable. Para perfiles con horizonte temporal largo y tolerancia al riesgo.',
      riskLevel: 'dynamic' as const,
      expectedReturnMin: 5.0,
      expectedReturnMax: 10.0,
      managementFee: 1.2,
    },
  ]);

  // Seed Companies
  console.log('Seeding companies...');
  const companies = await companyRepo.save([
    {
      name: 'TechStartup SL',
      taxId: 'B12345678',
    },
    {
      name: 'Consultores Asociados SA',
      taxId: 'A87654321',
    },
  ]);

  // Seed Employees
  console.log('Seeding employees...');
  await employeeRepo.save([
    // TechStartup employees
    {
      companyId: companies[0].id,
      email: 'ana.garcia@techstartup.com',
      firstName: 'Ana',
      lastName: 'García',
      nif: '12345678A',
      birthDate: '1990-03-15',
      pensionPlanId: plans[1].id,
      onboardingStatus: 'completed' as const,
      onboardingCompletedAt: new Date('2024-01-15'),
    },
    {
      companyId: companies[0].id,
      email: 'carlos.lopez@techstartup.com',
      firstName: 'Carlos',
      lastName: 'López',
      nif: '23456789B',
      birthDate: '1985-07-22',
      pensionPlanId: plans[2].id,
      onboardingStatus: 'completed' as const,
      onboardingCompletedAt: new Date('2024-01-20'),
    },
    {
      companyId: companies[0].id,
      email: 'maria.fernandez@techstartup.com',
      onboardingStatus: 'not_started' as const,
    },
    // Consultores employees
    {
      companyId: companies[1].id,
      email: 'pedro.martinez@consultores.com',
      onboardingStatus: 'not_started' as const,
    },
    {
      companyId: companies[1].id,
      email: 'laura.sanchez@consultores.com',
      firstName: 'Laura',
      lastName: 'Sánchez',
      nif: '34567890C',
      birthDate: '1988-11-08',
      onboardingStatus: 'personal_info' as const,
    },
  ]);

  console.log('Seed completed!');
  console.log(`Created: ${plans.length} pension plans, ${companies.length} companies, 5 employees`);

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
