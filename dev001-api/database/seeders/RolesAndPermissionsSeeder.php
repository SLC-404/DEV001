<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $modules =['users','roles','permissions'];
        $actions = ['view','create','update','delete'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name'=>"{$module}.{$action}"]);
            }
        }

        Role::firstOrCreate(['name'=>"Admin"])
            ->syncPermissions(Permission::all());
        Role::firstOrCreate(['name'=>"Supervisor"])
            ->syncPermissions(['users.view','roles.view']);
        Role::firstOrCreate(['name'=>"Usuarios"]);
    }
}
