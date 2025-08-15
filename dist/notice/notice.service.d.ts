import { Repository } from 'typeorm';
import { Notice } from '../entities/notice.entity';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
export declare class NoticeService {
    private noticeRepository;
    constructor(noticeRepository: Repository<Notice>);
    findAll(page?: number, limit?: number): Promise<[Notice[], number]>;
    findOne(id: number): Promise<Notice>;
    create(createNoticeDto: CreateNoticeDto): Promise<Notice>;
    update(id: number, updateNoticeDto: UpdateNoticeDto): Promise<Notice>;
    remove(id: number): Promise<void>;
}
