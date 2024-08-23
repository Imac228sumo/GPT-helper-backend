import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StableService } from './stable.service';
import { CreateStableDto } from './dto/create-stable.dto';
import { UpdateStableDto } from './dto/update-stable.dto';

@Controller('stable')
export class StableController {
  constructor(private readonly stableService: StableService) {}

  @Post()
  create(@Body() createStableDto: CreateStableDto) {
    return this.stableService.create(createStableDto);
  }

  @Get()
  findAll() {
    return this.stableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stableService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStableDto: UpdateStableDto) {
    return this.stableService.update(+id, updateStableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stableService.remove(+id);
  }
}
