import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const authRoleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as Array<string> | undefined;
  const isPublic = route.data['public'] ?? false;
  const currentUrl = state.url;

  try {
    if (isPublic) {
      return true; // Permitir acceso a rutas públicas
    }

    const isAuthenticated = await firstValueFrom(authService.isAuthenticated());
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectUrl', currentUrl);
      await router.navigate(['/login']);
      return false;
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const response = await firstValueFrom(authService.getRole());
      const userRole = response.role;

      if (!requiredRoles.includes(userRole)) {
        const redirectPath = userRole === 'CLIENTE' ? '/catalogo' : '/inicio';
        await router.navigate([redirectPath]);
        return false;
      }
    }

    return true;
  } catch (error) {
    sessionStorage.setItem('redirectUrl', currentUrl);
    await router.navigate(['/login']);
    return false;
  }
};
