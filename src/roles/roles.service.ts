import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    try {
      const roles = await this.rolesRepository.find({
        order: { id: 'ASC' },
      });
      
      console.log(`✅ Found ${roles.length} roles`);
      return roles;
    } catch (error) {
      console.error('❌ Error fetching roles:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Role | null> {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id },
      });
      
      if (role) {
        console.log(`✅ Found role: ${role.name} (ID: ${role.id})`);
      } else {
        console.log(`⚠️ Role not found with ID: ${id}`);
      }
      
      return role;
    } catch (error) {
      console.error('❌ Error fetching role by ID:', error);
      throw error;
    }
  }

  async findByName(name: string): Promise<Role | null> {
    try {
      const role = await this.rolesRepository.findOne({
        where: { name },
      });
      
      if (role) {
        console.log(`✅ Found role: ${role.name} (ID: ${role.id})`);
      } else {
        console.log(`⚠️ Role not found with name: ${name}`);
      }
      
      return role;
    } catch (error) {
      console.error('❌ Error fetching role by name:', error);
      throw error;
    }
  }

  async create(roleData: Partial<Role>): Promise<Role> {
    try {
      const role = this.rolesRepository.create(roleData);
      const savedRole = await this.rolesRepository.save(role);
      
      console.log(`✅ Created new role: ${savedRole.name} (ID: ${savedRole.id})`);
      return savedRole;
    } catch (error) {
      console.error('❌ Error creating role:', error);
      throw error;
    }
  }

  async update(id: number, roleData: Partial<Role>): Promise<Role | null> {
    try {
      const role = await this.findById(id);
      if (!role) {
        return null;
      }

      Object.assign(role, roleData);
      const updatedRole = await this.rolesRepository.save(role);
      
      console.log(`✅ Updated role: ${updatedRole.name} (ID: ${updatedRole.id})`);
      return updatedRole;
    } catch (error) {
      console.error('❌ Error updating role:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const role = await this.findById(id);
      if (!role) {
        return false;
      }

      await this.rolesRepository.remove(role);
      
      console.log(`✅ Deleted role: ${role.name} (ID: ${role.id})`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting role:', error);
      throw error;
    }
  }

  async getRolePermissions(roleId: number): Promise<string[]> {
    try {
      const role = await this.findById(roleId);
      if (!role) {
        return [];
      }

      // This could be expanded to use a permissions table
      // For now, we'll use role-based permissions
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
    } catch (error) {
      console.error('❌ Error getting role permissions:', error);
      return [];
    }
  }
}
