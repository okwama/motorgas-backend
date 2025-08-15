"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckinModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const checkin_controller_1 = require("./checkin.controller");
const checkin_service_1 = require("./checkin.service");
const checkin_record_entity_1 = require("../entities/checkin-record.entity");
const staff_entity_1 = require("../entities/staff.entity");
const station_entity_1 = require("../entities/station.entity");
let CheckinModule = class CheckinModule {
};
exports.CheckinModule = CheckinModule;
exports.CheckinModule = CheckinModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([checkin_record_entity_1.CheckinRecord, staff_entity_1.Staff, station_entity_1.Station])],
        controllers: [checkin_controller_1.CheckinController],
        providers: [checkin_service_1.CheckinService],
        exports: [checkin_service_1.CheckinService],
    })
], CheckinModule);
//# sourceMappingURL=checkin.module.js.map