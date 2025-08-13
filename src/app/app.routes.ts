import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './shared/components/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { ServicesComponent } from './shared/components/services/services.component';
import { PropertiesListComponent } from './pages/properties-list/properties-list.component';
import { PropertyManageComponent } from './pages/property-manage/property-manage.component';
import { HouseManageComponent } from './pages/house-manage/house-manage.component';
import { PropertiesDetilComponent } from './pages/properties-detil/properties-detil.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { authRoleGuard } from './guard/auth-role.guard';
import { UserComponent } from './pages/user/user.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { AgentListComponent } from './pages/agent-list/agent-list.component';
import { AgentManageComponent } from './pages/agent-manage/agent-manage.component';
export const routes: Routes = [
    { path: 'home', component: HomeComponent, data: { public: true } },
    { path: 'contacto', component: ContactComponent, data: { public: true } },
    { path: 'servicios', component: ServicesComponent, data: { public: true } },
    { path: 'quienes-somos', component: AboutUsComponent, data: { public: true } },
    { path: 'lista-propiedades', component: PropertiesListComponent, data: { public: true }, runGuardsAndResolvers: 'pathParamsOrQueryParamsChange', },
    {
        path: 'propiedades',
        component: HouseManageComponent,
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] }
    },
    {
        path: 'gestion-propiedades',
        component: PropertyManageComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] }
    },
    {
        path: 'gestion-usuarios',
        component: UserListComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] }

    },
    {
        path: 'gestion-agentes',
        component: AgentListComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] }

    },
    {
        path:'usuarios',
        component: UserComponent,
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] }
    },
    {
        path:'agentes',
        component: AgentManageComponent,
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] }
    },
    { 
        path: 'detalle-propiedad',
        component: PropertiesDetilComponent,
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
        data: { public: true } 
    },
    { path: 'login', component: LoginComponent, data: { public: true } }
];

