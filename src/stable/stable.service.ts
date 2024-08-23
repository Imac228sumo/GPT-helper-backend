import { Injectable } from '@nestjs/common';
import { CreateStableDto } from './dto/create-stable.dto';
import { UpdateStableDto } from './dto/update-stable.dto';

@Injectable()
export class StableService {
  create(createStableDto: CreateStableDto) {
    return 'This action adds a new stable';
  }

  findAll() {
    return `This action returns all stable`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stable`;
  }

  update(id: number, updateStableDto: UpdateStableDto) {
    return `This action updates a #${id} stable`;
  }

  remove(id: number) {
    return `This action removes a #${id} stable`;
  }
}
