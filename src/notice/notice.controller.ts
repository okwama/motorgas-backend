import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notice-board')
@UseGuards(JwtAuthGuard)
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const [notices, total] = await this.noticeService.findAll(page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data: notices,
      total,
      page,
      limit,
      total_pages: totalPages,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.noticeService.findOne(+id);
  }

  @Post()
  async create(@Body() createNoticeDto: CreateNoticeDto) {
    return this.noticeService.create(createNoticeDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ) {
    return this.noticeService.update(+id, updateNoticeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.noticeService.remove(+id);
  }
}
