import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '../../.env' });
import { CompaniesModule } from './companies/companies.module';
import { EmployeesModule } from './employees/employees.module';
import { PensionPlansModule } from './pension-plans/pension-plans.module';
import { PayrollSyncModule } from './payroll-sync/payroll-sync.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME,
      schema: process.env.DATABASE_SCHEMA,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, // Only for development
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    CompaniesModule,
    EmployeesModule,
    PensionPlansModule,
    PayrollSyncModule,
    EventsModule,
  ],
})
export class AppModule {}
