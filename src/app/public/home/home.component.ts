import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../admin/services/auth.service';
import { HttpClient } from '@angular/common/http';



interface Service {
  icon: string;
  title: string;
  description: string;
}

interface Project {
  id: number;
  title: string;
  des: string;
  img: string;
  url: string;
  isExpanded?: boolean;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('skillsContainer') skillsContainer!: ElementRef;

  aboutMe: any;
  resume!: string;
  baseUrl: string = environment.apiUrl.replace(/\/api$/, '');

  // Services Data
  services: Service[] = [
    { icon: 'bi-code-slash', title: 'UI/UX Design', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur possimus voluptate iste temporibus impedit reiciendis.' },
    { icon: 'bi-crop', title: 'Web Design', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur possimus voluptate iste temporibus impedit reiciendis.' },
    { icon: 'bi-apple', title: 'App Design', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur possimus voluptate iste temporibus impedit reiciendis.' }
  ];

  skillCategories = [
    { name: 'Backend', icon: 'bi-database-fill', skills: ['DOTNET', 'EXPRESS'] },
    { name: 'Frontend', icon: 'bi-layout-text-sidebar-reverse', skills: ['ANGULAR', 'REACT'] },
    { name: 'Languages', icon: 'bi-code-slash', skills: ['JAVA', 'C#', 'JAVASCRIPT'] },
    { name: 'Tools', icon: 'bi-tools', skills: ['DOCKER', 'AWS'] }
  ];

  softCapabilities = [
    { name: 'COMMUNICATION', percentage: 80, color: '#00eeff' },
    { name: 'TEAMWORK', percentage: 95, color: '#00ffbf' },
    { name: 'PROBLEM SOLVING', percentage: 80, color: '#00eeff' },
    { name: 'CREATIVITY', percentage: 70, color: '#b026ff' }
  ];

  projects: Project[] = [
    { id: 1, title: 'Web Development', des: 'Modern web applications with fast performance, clean design, and reliable functionality. This comprehensive solution focuses on scalability and user engagement across all platforms.', img: 'assets/project1.png', url: 'https://uxbexpresslogistics.com/', isExpanded: false },
    { id: 2, title: 'Web Development', des: 'Interactive and user-friendly mobile experiences for iOS and Android. Our approach ensures native-like performance with a single codebase for faster delivery.', img: 'assets/project2.png', url: 'https://omstructuresolutions.com/', isExpanded: false },
    { id: 3, title: 'Web Development', des: 'Scalable e-commerce solutions with seamless payment integrations. Built to handle high traffic and provide a secure shopping experience for customers worldwide.', img: 'assets/project3.png', url: 'https://ritikraj2003.github.io/mbr/home', isExpanded: false }
  ];


  constructor(private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.fragment.subscribe(frag => {
      if (frag) {
        setTimeout(() => {
          const element = document.getElementById(frag);
          if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 500); // Small delay to ensure content is rendered
      }
    });

    this.GetAllAboutMe();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  // --- New Methods ---
  toggleExpansion(project: Project, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    project.isExpanded = !project.isExpanded;
  }

  // --- Existing Methods ---
  onSubmitContact(event: Event) {
    event.preventDefault();
    console.log('Contact form submitted!');
    alert('Thank you for your message! (This is a UI demo, no email was sent)');
  }

  OnClickAbout() {
    this.router.navigate(['/about']);
  }

  GetAllAboutMe() {
    this.authService.GetAllAboutMe().subscribe((res) => {
      this.aboutMe = res.data;
      this.resume = this.aboutMe[0].resumeFile ? this.baseUrl + this.aboutMe[0].resumeFile : '';
      sessionStorage.setItem('name', this.aboutMe[0].name);
    });
  }

  downloadResume() {
    this.http.get(this.resume, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Ritik_Resume.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Failed to download resume.')
    });
  }
}