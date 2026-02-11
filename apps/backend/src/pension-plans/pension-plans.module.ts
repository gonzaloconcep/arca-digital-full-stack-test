import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PensionPlan } from './pension-plan.entity';
import { PensionPlansService } from './pension-plans.service';
import { PensionPlansController } from './pension-plans.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PensionPlan])],
  providers: [PensionPlansService],
  controllers: [PensionPlansController],
  exports: [PensionPlansService],
})
export class PensionPlansModule {}
