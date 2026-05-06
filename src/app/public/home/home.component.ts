import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../admin/services/auth.service';
import { SeoService } from '../../core/services/seo.service';
import { HttpClient } from '@angular/common/http';



interface Service {
  icon: string;
  title: string;
  description: string;
}

interface Project {
  id: number;
  application: string;
  title: string;
  des: string;
  img: string;
  url: string;
  isExpanded?: boolean;
}

interface Feedback {
  name: string;
  designation: string;
  rating: number;
  image: string;
  review: string;
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
    { name: 'Frontend', icon: 'bi-layout-text-sidebar-reverse', skills: ['ANGULAR', 'ANGULAR.JS', 'REACT', 'HTML', 'CSS'] },
    { name: 'Languages', icon: 'bi-code-slash', skills: ['JAVA', 'C#', 'JAVASCRIPT',] },
    { name: 'Tools', icon: 'bi-tools', skills: ['DOCKER', 'AWS', 'GIT'] }
  ];

  softCapabilities = [
    { name: 'COMMUNICATION', percentage: 80, color: '#ff8000' },
    { name: 'TEAMWORK', percentage: 95, color: '#ffa500' },
    { name: 'PROBLEM SOLVING', percentage: 80, color: '#ff9500' },
    { name: 'CREATIVITY', percentage: 70, color: '#ff6a00' }
  ];

  projects: Project[] = [
    {
      id: 1,
      application: 'Web Site',
      title: 'UXB Express Logistics',
      des: 'An end-to-end logistics platform designed for UXB Express, featuring real-time cargo tracking, secure shipment management, and a high-performance dashboard for global operations.',
      img: 'assets/project1.png',
      url: 'https://uxbexpresslogistics.com/',
      isExpanded: false
    },
    {
      id: 2,
      application: 'Web Application',
      title: 'Om Structure Solutions',
      des: 'A leading infrastructure and construction platform providing comprehensive civil, structural, and solar engineering solutions across Eastern India.',
      img: 'assets/project2.png',
      url: 'https://omstructuresolutions.com/',
      isExpanded: false
    },
    {
      id: 3,
      application: 'Web Application',
      title: 'MBR Digitech Solutions',
      des: 'A digital agency platform offering quick and hassle-free website development, software solutions, and digital marketing services for small businesses.',
      img: 'assets/project3.png',
      url: 'https://ritikraj2003.github.io/mbr/home',
      isExpanded: false
    },
    {
      id: 4,
      application: 'Web Application',
      title: 'Moments Studio',
      des: 'A premium photography portfolio specializing in wedding and event photography, capturing timeless moments with creative perfection in the Patna region.',
      img: 'assets/moments.png',
      url: 'https://momentsstudio.in/',
      isExpanded: false
    }
  ];


  feedbacks: Feedback[] = [
    {
      name: 'Ajeet Singh',
      designation: 'Managing Director, UXB Express',
      rating: 5,
      image: 'assets/project1.png',
      review: 'Ritik delivered an exceptional logistics dashboard. The performance is outstanding and the UI is exactly what we needed for our operations.'
    },
    {
      name: 'Vikas Kumar',
      designation: 'Founder, Om Structure',
      rating: 5,
      image: 'assets/project2.png',
      review: 'Highly skilled developer! The architectural website he built for us is both beautiful and functional. Very impressed with the attention to detail.'
    },
    {
      name: 'Sneha Kumari',
      designation: 'Project Lead, MBR',
      rating: 4,
      image: 'assets/project3.png',
      review: 'Great experience working with Ritik. He is very responsive and solved complex technical challenges during the development of our platform.'
    }
  ];

  currentFeedbackIndex: number = 0;
  private feedbackInterval: any;


  constructor(private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private seoService: SeoService
  ) { }

  ngOnInit(): void {
    this.seoService.updateSeoTags({
      title: 'Home',
      description: 'Explore the professional portfolio of Ritik Raj, a Full Stack Developer specialized in Angular and .NET.',
      keywords: 'Ritik Raj, Portfolio, Full Stack Developer, Web Development, Angular, .NET'
    });

    if (isPlatformBrowser(this.platformId)) {
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
    }

    this.GetAllAboutMe();
    if (isPlatformBrowser(this.platformId)) {
      this.typeRole();
      this.startFeedbackTimer();
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.feedbackInterval) {
      clearInterval(this.feedbackInterval);
    }
  }

  startFeedbackTimer() {
    this.feedbackInterval = setInterval(() => {
      this.nextFeedback();
    }, 5000);
  }

  nextFeedback() {
    this.currentFeedbackIndex = (this.currentFeedbackIndex + 1) % this.feedbacks.length;
  }

  prevFeedback() {
    this.currentFeedbackIndex = (this.currentFeedbackIndex - 1 + this.feedbacks.length) % this.feedbacks.length;
  }

  goToFeedback(index: number) {
    this.currentFeedbackIndex = index;
    // Reset timer on manual jump
    clearInterval(this.feedbackInterval);
    this.startFeedbackTimer();
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

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
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
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.setItem('name', this.aboutMe[0].name);
      }
    });
  }

  downloadResume() {
    if (!isPlatformBrowser(this.platformId)) return;

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