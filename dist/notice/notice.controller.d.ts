import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
export declare class NoticeController {
    private readonly noticeService;
    constructor(noticeService: NoticeService);
    findAll(page?: number, limit?: number): Promise<{
        data: import("../entities/notice.entity").Notice[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    findOne(id: string): Promise<import("../entities/notice.entity").Notice>;
    create(createNoticeDto: CreateNoticeDto): Promise<import("../entities/notice.entity").Notice>;
    update(id: string, updateNoticeDto: UpdateNoticeDto): Promise<import("../entities/notice.entity").Notice>;
    remove(id: string): Promise<void>;
}
