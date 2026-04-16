import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isMobileMenuOpen = false;

  constructor(private router: Router) { }
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  navigateToSection(sectionId: string) {
    this.closeMobileMenu();
    
    // Check if we are already on home page (ignoring fragments)
    const currentUrl = this.router.url.split('#')[0];
    if (currentUrl === '/home' || currentUrl === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        // Offset for the fixed header (approx 80px)
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      this.router.navigate(['/home'], { fragment: sectionId });
    }
  }
}
