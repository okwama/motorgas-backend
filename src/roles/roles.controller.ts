import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from '../entities/role.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('public')
  async findPublicRoles(): Promise<{ data: Role[] }> {
    try {
      console.log('🔄 Fetching public roles for signup...');
      const roles = await this.rolesService.findAll();
      
      return {
        data: roles,
      };
    } catch (error) {
      console.error('❌ Error in findPublicRoles:', error);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<{ data: Role[] }> {
    try {
      console.log('🔄 Fetching all roles...');
      const roles = await this.rolesService.findAll();
      
      return {
        data: roles,
      };
    } catch (error) {
      console.error('❌ Error in findAll roles:', error);
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<{ data: Role | null }> {
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
    } catch (error) {
      console.error('❌ Error in findById roles:', error);
      throw error;
    }
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<{ data: Role | null }> {
    try {
      console.log(`🔄 Fetching role with name: ${name}`);
      const role = await this.rolesService.findByName(name);
      
      return {
        data: role,
      };
    } catch (error) {
      console.error('❌ Error in findByName roles:', error);
      throw error;
    }
  }

  @Post()
  async create(@Body() roleData: Partial<Role>): Promise<{ data: Role }> {
    try {
      console.log('🔄 Creating new role:', roleData);
      const role = await this.rolesService.create(roleData);
      
      return {
        data: role,
      };
    } catch (error) {
      console.error('❌ Error in create role:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() roleData: Partial<Role>,
  ): Promise<{ data: Role | null }> {
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
    } catch (error) {
      console.error('❌ Error in update role:', error);
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
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
    } catch (error) {
      console.error('❌ Error in delete role:', error);
      throw error;
    }
  }

  @Get(':id/permissions')
  async getRolePermissions(@Param('id') id: string): Promise<{ data: string[] }> {
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
    } catch (error) {
      console.error('❌ Error in getRolePermissions:', error);
      throw error;
    }
  }
}
