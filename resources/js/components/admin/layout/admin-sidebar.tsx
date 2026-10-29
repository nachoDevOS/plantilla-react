/**
 * MENÚ LATERAL del panel. Para agregar una opción, súmala a una de estas listas.
 * Íconos disponibles: https://lucide.dev/icons
 *
 * permission: la opción solo aparece para quien tiene ese permiso (config/roles.php).
 * Si un grupo se queda sin opciones visibles, el grupo entero no se muestra.
 */
import { NavMain } from '@/components/admin/layout/nav-main';
import { NavUser } from '@/components/admin/layout/nav-user';
import AppLogo from '@/components/shared/app-logo';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ClipboardList, Contact, LayoutGrid, Package, Palette, Settings, Shapes, ShieldCheck, ShoppingCart, SquareKanban, Users } from 'lucide-react';

// Grupo "Plataforma": lo ve todo usuario logueado
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
];

// Grupo "Administración": cada opción pide su permiso
const adminNavItems: NavItem[] = [
    {
        title: 'Usuarios',
        url: '/admin/users',
        icon: Users,
        permission: 'usuarios.ver',
    },
    {
        title: 'Roles y permisos',
        url: '/admin/roles',
        icon: ShieldCheck,
        permission: 'roles.ver',
    },
];

// Grupo "Ejemplos": pantallas de muestra con datos escritos a mano (routes/admin.php → examples).
// Bórralo junto con pages/admin/examples/ cuando empieces tus propios módulos.
const exampleNavItems: NavItem[] = [
    { title: 'Productos', url: '/admin/examples/products', icon: Package },
    { title: 'Ventas', url: '/admin/examples/sales', icon: ShoppingCart },
    { title: 'Clientes', url: '/admin/examples/customers', icon: Contact },
    { title: 'Tareas', url: '/admin/examples/tasks', icon: SquareKanban },
    { title: 'Formulario', url: '/admin/examples/form', icon: ClipboardList },
    { title: 'Componentes', url: '/admin/examples/components', icon: Shapes },
];

// Enlaces de abajo del menú
const footerNavItems: NavItem[] = [
    {
        title: 'Mi perfil',
        url: '/settings/profile',
        icon: Settings,
    },
    {
        title: 'Apariencia',
        url: '/settings/appearance',
        icon: Palette,
    },
];

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="group-data-[collapsible=icon]:overflow-visible group-data-[collapsible=icon]:p-0! hover:bg-transparent"
                        >
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain label="Plataforma" items={mainNavItems} />
                <NavMain label="Ejemplos" items={exampleNavItems} />
                <NavMain label="Administración" items={adminNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavMain items={footerNavItems} className="mt-auto" />
                {/* Botón del usuario (abre Ajustes / Cerrar sesión) */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
