import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { environment } from '../../../environments/environment';  
import { AuthService } from '../../admin/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  constructor(private APiService: AuthService, private modalService: NgbModal) {}

  @ViewChild('descModal') descModal!: TemplateRef<any>;
  fullDescription: string = '';
  selectedProject: any = null;

  ngOnInit(): void {
    this.GetAllProjects();
  }

  projects: any[] = [];

  openDescriptionModal(project: any) {
    this.selectedProject = project;
    this.fullDescription = project.description;
    this.modalService.open(this.descModal, { size: 'md', centered: true });
  }

  isTruncated(element: HTMLElement): boolean {
    return element.scrollHeight > element.clientHeight + 1;
  }

  // Helper method to ensure URLs have a protocol (e.g., https://)
  private ensureUrlProtocol(url: string): string {
    if (!url || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  }

  // Helper to prepend API URL to a relative path, removing '/api' for static files and any trailing comma
  private prependApiUrl(path: string): string {
    if (!path) return '';
    // Trim whitespace and remove trailing comma if present
    let cleanPath = path.trim();
    if (cleanPath.endsWith(',')) {
      cleanPath = cleanPath.slice(0, -1);
    }
    cleanPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${cleanPath}`;
  }

  GetAllProjects() {
    this.APiService.getAllProjects().subscribe({
      next: (res: any) => {
        this.projects = res.data.map((project: any) => ({
          ...project,
          githublink: this.ensureUrlProtocol(project.githublink),
          websitelink: this.ensureUrlProtocol(project.websitelink),
          logo: this.prependApiUrl(project.pLogo)
        }));
      },
      error: (err: any) => {
        console.error('Error fetching projects:', err);
      }
    });
  }
}
