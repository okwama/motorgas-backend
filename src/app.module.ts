import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StaffModule } from './staff/staff.module';
import { StationsModule } from './stations/stations.module';
import { CheckinModule } from './checkin/checkin.module';
import { NoticeModule } from './notice/notice.module';
import { SosModule } from './sos/sos.module';
import { VisitorModule } from './visitor/visitor.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ReportModule } from './report/report.module';
import { AuthModule } from './auth/auth.module';
import { LeaveModule } from './leave/leave.module';
import { UploadModule } from './upload/upload.module';
import { SalesModule } from './sales/sales.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '102.218.215.35',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'citlogis_bryan',
      password: process.env.DB_PASSWORD || '@bo9511221.qwerty',
      database: process.env.DB_DATABASE || 'citlogis_forecourt',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Set to false for production
      logging: process.env.NODE_ENV === 'development',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '5h' },
    }),
    PassportModule,
    MulterModule.register({
      dest: './uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    StaffModule,
    StationsModule,
    LeaveModule,
    CheckinModule,
    NoticeModule,
    SosModule,
    VisitorModule,
    OrderModule,
    ProductModule,
    ReportModule,
    UploadModule,
    SalesModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
