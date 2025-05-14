export type Permission = 'read' | 'edit' | 'delete' | 'managePanel';
export type Role = 'super_admin' | 'admin' | 'user';

export const rolesAndPermissions: Record<Role, Permission[]> = {
    super_admin: ['read', 'edit', 'delete', 'managePanel'],
    admin: ['read', 'edit', 'delete'],
    user: ['read']
}

export const checkPermission = (action: Permission, role?: Role) => {
    return role ? (rolesAndPermissions[role]?.includes(action) || false) : false;
};