import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
export declare class RolesService {
    private rolesRepository;
    constructor(rolesRepository: Repository<Role>);
    findAll(): Promise<Role[]>;
    findById(id: number): Promise<Role | null>;
    findByName(name: string): Promise<Role | null>;
    create(roleData: Partial<Role>): Promise<Role>;
    update(id: number, roleData: Partial<Role>): Promise<Role | null>;
    delete(id: number): Promise<boolean>;
    getRolePermissions(roleId: number): Promise<string[]>;
}
