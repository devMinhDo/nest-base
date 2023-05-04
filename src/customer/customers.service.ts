import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { GetAllUserDto } from '../users/dto/get-all-user.dto';
import { filterOptions } from '../utils/filterText';
import { TEXT_SEARCH_CUSTOMER } from './constant/text-search-customer';
import { BaseResDto } from '../config/dto/base-res.dto';
import { SaveDto } from './dto/save.dto';
import { responseError } from '../utils/responseData';
@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async getAllPagination(getAllUserDto: GetAllUserDto) {
    const {
      sort,
      sortDirection,
      searchText,
      skipCount,
      maxResultCount,
      filterItems,
    } = getAllUserDto;
    const { items, totalCount } = await filterOptions(
      sort,
      sortDirection,
      filterItems,
      searchText,
      skipCount,
      maxResultCount,
      this.customerModel,
      TEXT_SEARCH_CUSTOMER,
    );
    return {
      ...BaseResDto,
      result: {
        items,
        totalCount,
      },
    };
  }

  async save(saveDto: SaveDto) {
    const { name, id } = saveDto;
    if (!id) {
      const findCustomer = await this.customerModel.findOne({ name });
      if (findCustomer)
        return responseError(
          `Name Customer already exist`,
          `Name Customer already exist`,
        );
      const findLastCustomer = await this.customerModel
        .findOne({})
        .sort({ id: -1 });
      if (!findLastCustomer) {
        saveDto.id = 1;
      } else {
        saveDto.id = findLastCustomer.id + 1;
      }
      const newCustomer = await this.customerModel.create(saveDto);
      return {
        ...BaseResDto,
        result: newCustomer,
      };
    } else {
      const findCustomer = await this.customerModel.findOne({ id });
      if (!findCustomer)
        return responseError(`Customer not found!`, `Customer not found!`);
      const updateCustomer = await this.customerModel.findOneAndUpdate(
        { id },
        { name: saveDto.name, address: saveDto.address },
        { new: true },
      );
      return {
        ...BaseResDto,
        result: updateCustomer,
      };
    }
  }

  async getAll() {
    const result = await this.customerModel.find({});
    return {
      ...BaseResDto,
      result: result,
    };
  }
}
