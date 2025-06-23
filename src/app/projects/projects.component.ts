import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { AuthService } from '../admin/services/auth.service';
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  animations: [
    trigger('staggerProjects', [
      transition(':enter', [
        query('.project', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(150, [
            animate(
              '600ms ease-out',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ])
      ])
    ])
  ]
})
export class ProjectsComponent implements OnInit {
  constructor(private APiService: AuthService) {}


  ngOnInit(): void {
    this.GetAllProjects();
  }

  projects: any[] = [];

  // Helper method to ensure URLs have a protocol (e.g., https://)
  private ensureUrlProtocol(url: string): string {
    if (!url || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  }

  GetAllProjects() {
    this.APiService.getAllProjects().subscribe({
      next: (res: any) => {
        // Process the links to ensure they work correctly
        this.projects = res.map((project: any) => ({
          ...project,
          githublink: this.ensureUrlProtocol(project.githublink),
          websitelink: this.ensureUrlProtocol(project.websitelink),
        }));
        console.log('Projects fetched and links processed:', this.projects);
      },
      error: (err: any) => {
        console.error('Error fetching projects:', err);
      }
    });
  }
}
