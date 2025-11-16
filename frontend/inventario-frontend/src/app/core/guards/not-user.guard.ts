// src/app/core/guards/not-user.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const notUserGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // ✅ Solo pasa si NO es user
  if (!auth.isUser()) {
    return true;
  }

  // 🚫 Si es user, lo mandamos de vuelta a Productos
  router.navigate(['/productos']);
  return false;
};
