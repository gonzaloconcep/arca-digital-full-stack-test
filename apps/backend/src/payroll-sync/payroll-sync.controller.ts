import { Controller, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PayrollSyncService, PayrollSyncResult } from './payroll-sync.service';

@ApiTags('payroll-sync')
@Controller('payroll-sync')
export class PayrollSyncController {
  constructor(private readonly payrollSyncService: PayrollSyncService) {}

  @Post(':companyId')
  @ApiOperation({ summary: 'Sync employees from external payroll provider' })
  @ApiParam({ name: 'companyId', description: 'Company UUID' })
  async syncPayroll(@Param('companyId') companyId: string): Promise<PayrollSyncResult> {
    return this.payrollSyncService.syncPayroll(companyId);
  }
}
