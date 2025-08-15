import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from '../entities/notice.entity';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<[Notice[], number]> {
    const skip = (page - 1) * limit;
    
    const [notices, total] = await this.noticeRepository.findAndCount({
      skip,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });

    return [notices, total];
  }

  async findOne(id: number): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    
    if (!notice) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }
    
    return notice;
  }

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    const notice = this.noticeRepository.create(createNoticeDto);
    return this.noticeRepository.save(notice);
  }

  async update(id: number, updateNoticeDto: UpdateNoticeDto): Promise<Notice> {
    const notice = await this.findOne(id);
    
    Object.assign(notice, updateNoticeDto);
    return this.noticeRepository.save(notice);
  }

  async remove(id: number): Promise<void> {
    const notice = await this.findOne(id);
    await this.noticeRepository.remove(notice);
  }
}
