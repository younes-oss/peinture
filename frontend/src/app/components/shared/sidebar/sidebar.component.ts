import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { User } from '../../../models/auth.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  isMobileMenuOpen = false;
  
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.currentUser = state.user;
    });
  }
  
  isArtiste(): boolean {
    return this.authService.isArtiste();
  }
  
  isRouteAllowed(route: string): boolean {
    if (!this.isArtiste()) {
      return true; // Non-artists can access all routes
    }
    
    // For artists, only allow specific routes
    const allowedRoutes = ['/', '/artistes'];
    return allowedRoutes.includes(route);
  }
  
  handleNavigation(route: string, event: Event): void {
    if (!this.isRouteAllowed(route)) {
      event.preventDefault();
      this.notificationService.showError(
        'Accès restreint',
        'En tant qu\'artiste, vous ne pouvez accéder qu\'à la page d\'accueil et à la page artistes.'
      );
      return;
    }
    
    // Close mobile menu after navigation
    this.isMobileMenuOpen = false;
    
    // If route is allowed, navigate normally
    this.router.navigate([route]);
  }
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
} 