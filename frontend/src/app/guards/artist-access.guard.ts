import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const canAccessRoute: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);
  
  // Si l'utilisateur n'est pas connecté, laisser passer (géré par d'autres guards)
  if (!auth.isAuthenticated()) {
    return true;
  }
  
  // Si l'utilisateur n'est pas un artiste, laisser passer
  if (!auth.isArtiste()) {
    return true;
  }
  
  // Si l'utilisateur est un artiste, vérifier les routes autorisées
  const currentPath = route.routeConfig?.path || '';
  const fullUrl = `/${currentPath}`;
  
  // Routes autorisées pour les artistes
  const allowedRoutes = [
    '', // homepage
    'artistes', // artists page
    'dashboard/artiste', // artist dashboard
    'dashboard/artiste/nouveau', // create artwork
    'dashboard/artiste/:id' // edit artwork
  ];
  
  // Vérifier si la route actuelle est autorisée
  const isAllowed = allowedRoutes.some(allowedRoute => {
    if (allowedRoute === '') {
      return fullUrl === '/' || currentPath === '';
    }
    if (allowedRoute.includes(':id')) {
      // Pour les routes avec paramètres comme dashboard/artiste/:id
      const baseRoute = allowedRoute.split('/:')[0];
      return currentPath.startsWith(baseRoute);
    }
    return currentPath === allowedRoute || fullUrl === `/${allowedRoute}`;
  });
  
  if (!isAllowed) {
    // Afficher notification d'accès restreint
    notification.showError(
      'Accès restreint', 
      'En tant qu\'artiste, vous ne pouvez accéder qu\'à la page d\'accueil et à la page artistes.'
    );
    
    // Rediriger vers la page d'accueil
    router.navigate(['/']);
    return false;
  }
  
  return true;
};