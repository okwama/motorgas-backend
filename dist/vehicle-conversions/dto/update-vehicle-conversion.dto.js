"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVehicleConversionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_vehicle_conversion_dto_1 = require("./create-vehicle-conversion.dto");
class UpdateVehicleConversionDto extends (0, mapped_types_1.PartialType)(create_vehicle_conversion_dto_1.CreateVehicleConversionDto) {
}
exports.UpdateVehicleConversionDto = UpdateVehicleConversionDto;
//# sourceMappingURL=update-vehicle-conversion.dto.js.map