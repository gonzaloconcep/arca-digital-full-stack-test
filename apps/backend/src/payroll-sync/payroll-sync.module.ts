import { Module } from '@nestjs/common';
import { PayrollSyncService } from './payroll-sync.service';
import { PayrollSyncController } from './payroll-sync.controller';
import { EmployeesModule } from '../employees/employees.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [EmployeesModule, CompaniesModule],
  providers: [PayrollSyncService],
  controllers: [PayrollSyncController],
})
export class PayrollSyncModule {}
