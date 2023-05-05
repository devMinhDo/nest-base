import { Injectable } from '@nestjs/common';
import { MyTimeSheetService } from '../my-time-sheet/my-time-sheet.service';
import { BaseResDto } from '../config/dto/base-res.dto';
import { responseError } from '../utils/responseData';

@Injectable()
export class TimeSheetService {
  constructor(private myTimeSheetService: MyTimeSheetService) {}

  async getAll(query: any) {
    const { startDate, endDate, status } = query;
    const result = await this.myTimeSheetService.getTimeSheetByAggregate(
      new Date(startDate).getTime(),
      new Date(endDate).getTime(),
      Number(status),
    );
    const newResult: any[] = [];
    for (let i = 0; i < result.length; i++) {
      if (i % 2 === 0) {
        newResult.push(result[i]);
      }
    }
    return {
      ...BaseResDto,
      result: newResult,
    };
  }
  async approveTimeSheets(arrIds: number[]) {
    const ids = [...new Set(arrIds)];
    const findTimeSheet = await this.myTimeSheetService.findByFilter({
      id: { $in: ids },
    });
    if (findTimeSheet.length !== ids.length)
      return responseError(`TimeSheet not found!!`);
    const updateTimeSheet: any = await this.myTimeSheetService.updateMany(
      { id: { $in: ids } },
      { status: 2 },
    );
    return {
      ...BaseResDto,
      result: {
        success: ` - Success  timeSheets.`,
        successCount: updateTimeSheet.length,
        failedCount: ` - Fail 0 timeSheets.`,
        fail: ` - Fail 0 timeSheets.`,
        lockDate: `- Locked date: ${new Date()}`,
      },
    };
  }

  async rejectTimeSheets(arrIds: number[]) {
    const ids = [...new Set(arrIds)];
    const findTimeSheet = await this.myTimeSheetService.findByFilter({
      id: { $in: ids },
    });
    if (findTimeSheet.length !== ids.length)
      return responseError(`TimeSheet not found!!`);
    const updateTimeSheet: any = await this.myTimeSheetService.updateMany(
      { id: { $in: ids } },
      { status: 3 },
    );
    return {
      ...BaseResDto,
      result: {
        success: ` - Success ${updateTimeSheet.length} timeSheets.`,
        successCount: updateTimeSheet.length,
        failedCount: ` - Fail 0 timeSheets.`,
        fail: ` - Fail 0 timeSheets.`,
        lockDate: `- Locked date: ${new Date()}`,
      },
    };
  }
}
