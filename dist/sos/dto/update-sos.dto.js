"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSosDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_sos_dto_1 = require("./create-sos.dto");
class UpdateSosDto extends (0, mapped_types_1.PartialType)(create_sos_dto_1.CreateSosDto) {
}
exports.UpdateSosDto = UpdateSosDto;
//# sourceMappingURL=update-sos.dto.js.map