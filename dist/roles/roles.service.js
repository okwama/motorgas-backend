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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../entities/role.entity");
let RolesService = class RolesService {
    rolesRepository;
    constructor(rolesRepository) {
        this.rolesRepository = rolesRepository;
    }
    async findAll() {
        try {
            const roles = await this.rolesRepository.find({
                order: { id: 'ASC' },
            });
            console.log(`✅ Found ${roles.length} roles`);
            return roles;
        }
        catch (error) {
            console.error('❌ Error fetching roles:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const role = await this.rolesRepository.findOne({
                where: { id },
            });
            if (role) {
                console.log(`✅ Found role: ${role.name} (ID: ${role.id})`);
            }
            else {
                console.log(`⚠️ Role not found with ID: ${id}`);
            }
            return role;
        }
        catch (error) {
            console.error('❌ Error fetching role by ID:', error);
            throw error;
        }
    }
    async findByName(name) {
        try {
            const role = await this.rolesRepository.findOne({
                where: { name },
            });
            if (role) {
                console.log(`✅ Found role: ${role.name} (ID: ${role.id})`);
            }
            else {
                console.log(`⚠️ Role not found with name: ${name}`);
            }
            return role;
        }
        catch (error) {
            console.error('❌ Error fetching role by name:', error);
            throw error;
        }
    }
    async create(roleData) {
        try {
            const role = this.rolesRepository.create(roleData);
            const savedRole = await this.rolesRepository.save(role);
            console.log(`✅ Created new role: ${savedRole.name} (ID: ${savedRole.id})`);
            return savedRole;
        }
        catch (error) {
            console.error('❌ Error creating role:', error);
            throw error;
        }
    }
    async update(id, roleData) {
        try {
            const role = await this.findById(id);
            if (!role) {
                return null;
            }
            Object.assign(role, roleData);
            const updatedRole = await this.rolesRepository.save(role);
            console.log(`✅ Updated role: ${updatedRole.name} (ID: ${updatedRole.id})`);
            return updatedRole;
        }
        catch (error) {
            console.error('❌ Error updating role:', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const role = await this.findById(id);
            if (!role) {
                return false;
            }
            await this.rolesRepository.remove(role);
            console.log(`✅ Deleted role: ${role.name} (ID: ${role.id})`);
            return true;
        }
        catch (error) {
            console.error('❌ Error deleting role:', error);
            throw error;
        }
    }
    async getRolePermissions(roleId) {
        try {
            const role = await this.findById(roleId);
            if (!role) {
                return [];
            }
            switch (role.name.toLowerCase()) {
                case 'manager':
                case 'admin':
                    return [
                        'approve_leave',
                        'manage_notices',
                        'manage_staff',
                        'view_reports',
                        'manage_inventory',
                        'process_sales',
                        'view_notices',
                        'apply_leave',
                    ];
                case 'attendant':
                case 'staff':
                    return [
                        'process_sales',
                        'view_notices',
                        'apply_leave',
                        'check_in_out',
                    ];
                default:
                    return [];
            }
        }
        catch (error) {
            console.error('❌ Error getting role permissions:', error);
            return [];
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map