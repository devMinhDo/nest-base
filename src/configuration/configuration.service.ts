import { Injectable, Logger } from '@nestjs/common';
import { BaseResDto } from '../config/dto/base-res.dto';
@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor() {}

  async getWorkingTimeConfigAllBranch() {
    const result = {
      additionalProp1: {
        morningStartAt: '8:30',
        morningEndAt: '12:00',
        afternoonStartAt: '13:00',
        afternoonEndAt: '17:30',
        morningWorking: '3.5',
        afternoonWorking: '4.5',
        id: 0,
      },
      additionalProp2: {
        morningStartAt: '8:00',
        morningEndAt: '12:00',
        afternoonStartAt: '13:00',
        afternoonEndAt: '17:00',
        morningWorking: '4',
        afternoonWorking: '4',
        id: 0,
      },
      additionalProp3: {
        morningStartAt: '8:30',
        morningEndAt: '12:00',
        afternoonStartAt: '13:00',
        afternoonEndAt: '17:30',
        morningWorking: '3.5',
        afternoonWorking: '4.5',
        id: 0,
      },
    };
    return {
      ...BaseResDto,
      result: result,
    };
  }
}
