"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const roles_service_1 = require("./roles.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let RolesController = class RolesController {
    rolesService;
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async findPublicRoles() {
        try {
            console.log('🔄 Fetching public roles for signup...');
            const roles = await this.rolesService.findAll();
            return {
                data: roles,
            };
        }
        catch (error) {
            console.error('❌ Error in findPublicRoles:', error);
            throw error;
        }
    }
    async findAll() {
        try {
            console.log('🔄 Fetching all roles...');
            const roles = await this.rolesService.findAll();
            return {
                data: roles,
            };
        }
        catch (error) {
            console.error('❌ Error in findAll roles:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const roleId = parseInt(id, 10);
            if (isNaN(roleId)) {
                throw new Error('Invalid role ID');
            }
            console.log(`🔄 Fetching role with ID: ${roleId}`);
            const role = await this.rolesService.findById(roleId);
            return {
                data: role,
            };
        }
        catch (error) {
            console.error('❌ Error in findById roles:', error);
            throw error;
        }
    }
    async findByName(name) {
        try {
            console.log(`🔄 Fetching role with name: ${name}`);
            const role = await this.rolesService.findByName(name);
            return {
                data: role,
            };
        }
        catch (error) {
            console.error('❌ Error in findByName roles:', error);
            throw error;
        }
    }
    async create(roleData) {
        try {
            console.log('🔄 Creating new role:', roleData);
            const role = await this.rolesService.create(roleData);
            return {
                data: role,
            };
        }
        catch (error) {
            console.error('❌ Error in create role:', error);
            throw error;
        }
    }
    async update(id, roleData) {
        try {
            const roleId = parseInt(id, 10);
            if (isNaN(roleId)) {
                throw new Error('Invalid role ID');
            }
            console.log(`🔄 Updating role with ID: ${roleId}`, roleData);
            const role = await this.rolesService.update(roleId, roleData);
            return {
                data: role,
            };
        }
        catch (error) {
            console.error('❌ Error in update role:', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const roleId = parseInt(id, 10);
            if (isNaN(roleId)) {
                throw new Error('Invalid role ID');
            }
            console.log(`🔄 Deleting role with ID: ${roleId}`);
            const success = await this.rolesService.delete(roleId);
            return {
                success,
            };
        }
        catch (error) {
            console.error('❌ Error in delete role:', error);
            throw error;
        }
    }
    async getRolePermissions(id) {
        try {
            const roleId = parseInt(id, 10);
            if (isNaN(roleId)) {
                throw new Error('Invalid role ID');
            }
            console.log(`🔄 Fetching permissions for role ID: ${roleId}`);
            const permissions = await this.rolesService.getRolePermissions(roleId);
            return {
                data: permissions,
            };
        }
        catch (error) {
            console.error('❌ Error in getRolePermissions:', error);
            throw error;
        }
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findPublicRoles", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('name/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findByName", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':id/permissions'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getRolePermissions", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map