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
  
  // Typing Effect Data
  roles: string[] = ['Full Stack Developer', 'Problem Solver', 'Web Enthusiast'];
  displayedRole: string = '';
  private roleIndex: number = 0;
  private charIndex: number = 0;
  private isDeleting: boolean = false;
  private typingSpeed: number = 100;
  private deleteSpeed: number = 50;
  private pauseBetweenRoles: number = 2000;

  // Services Data
  services: Service[] = [
    { icon: 'bi-palette', title: 'UI/UX Design', description: 'Crafting intuitive and visually stunning user interfaces that provide seamless and engaging digital experiences for your users.' },
    { icon: 'bi-laptop', title: 'Web Application', description: 'Building robust, scalable, and high-performance web applications using modern frameworks tailored to your business goals.' },
    { icon: 'bi-graph-up-arrow', title: 'SEO (Digital Marketing)', description: 'Optimizing your online presence to rank higher in search results, drive organic traffic, and grow your brand visibility.' }
  ];

  skillCategories = [
    { name: 'Backend', icon: 'bi-database-fill', skills: ['DOTNET', 'EXPRESS'] },
    { name: 'Frontend', icon: 'bi-layout-text-sidebar-reverse', skills: ['ANGULAR', 'REACT'] },
    { name: 'Languages', icon: 'bi-code-slash', skills: ['JAVA', 'C#', 'JAVASCRIPT'] },
    { name: 'Tools', icon: 'bi-tools', skills: ['DOCKER', 'AWS'] }
  ];

  softCapabilities = [
    { name: 'COMMUNICATION', percentage: 80, color: '#ff8000' },
    { name: 'TEAMWORK', percentage: 95, color: '#ffa500' },
    { name: 'PROBLEM SOLVING', percentage: 80, color: '#ff9500' },
    { name: 'CREATIVITY', percentage: 70, color: '#ff6a00' }
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
    this.typeRole();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  typeRole(): void {
    const currentRole = this.roles[this.roleIndex];
    
    if (this.isDeleting) {
      this.displayedRole = currentRole.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.displayedRole = currentRole.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let delta = this.isDeleting ? this.deleteSpeed : this.typingSpeed;

    if (!this.isDeleting && this.charIndex === currentRole.length) {
      delta = this.pauseBetweenRoles;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      delta = 500;
    }

    setTimeout(() => this.typeRole(), delta);
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