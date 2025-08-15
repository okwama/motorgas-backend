"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const staff_module_1 = require("./staff/staff.module");
const stations_module_1 = require("./stations/stations.module");
const checkin_module_1 = require("./checkin/checkin.module");
const notice_module_1 = require("./notice/notice.module");
const sos_module_1 = require("./sos/sos.module");
const visitor_module_1 = require("./visitor/visitor.module");
const order_module_1 = require("./order/order.module");
const product_module_1 = require("./product/product.module");
const report_module_1 = require("./report/report.module");
const auth_module_1 = require("./auth/auth.module");
const leave_module_1 = require("./leave/leave.module");
const upload_module_1 = require("./upload/upload.module");
const sales_module_1 = require("./sales/sales.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST || '102.218.215.35',
                port: parseInt(process.env.DB_PORT || '3306'),
                username: process.env.DB_USERNAME || 'citlogis_bryan',
                password: process.env.DB_PASSWORD || '@bo9511221.qwerty',
                database: process.env.DB_DATABASE || 'citlogis_forecourt',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: false,
                logging: process.env.NODE_ENV === 'development',
            }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '5h' },
            }),
            passport_1.PassportModule,
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            staff_module_1.StaffModule,
            stations_module_1.StationsModule,
            leave_module_1.LeaveModule,
            checkin_module_1.CheckinModule,
            notice_module_1.NoticeModule,
            sos_module_1.SosModule,
            visitor_module_1.VisitorModule,
            order_module_1.OrderModule,
            product_module_1.ProductModule,
            report_module_1.ReportModule,
            upload_module_1.UploadModule,
            sales_module_1.SalesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map