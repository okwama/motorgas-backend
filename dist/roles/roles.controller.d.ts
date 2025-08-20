import { RolesService } from './roles.service';
import { Role } from '../entities/role.entity';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findPublicRoles(): Promise<{
        data: Role[];
    }>;
    findAll(): Promise<{
        data: Role[];
    }>;
    findById(id: string): Promise<{
        data: Role | null;
    }>;
    findByName(name: string): Promise<{
        data: Role | null;
    }>;
    create(roleData: Partial<Role>): Promise<{
        data: Role;
    }>;
    update(id: string, roleData: Partial<Role>): Promise<{
        data: Role | null;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
    getRolePermissions(id: string): Promise<{
        data: string[];
    }>;
}
