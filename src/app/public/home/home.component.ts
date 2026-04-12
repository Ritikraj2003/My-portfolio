import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router'
import { CommonModule } from '@angular/common';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../admin/services/auth.service';
import { HttpClient } from '@angular/common/http';

import * as Matter from 'matter-js';

interface Service {
  icon: string;
  title: string;
  description: string;
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
    { icon: 'bi-apple', title: 'App Design', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur possimus voluptate iste temporibus impedit reiciendis.' },
    { icon: 'bi-megaphone', title: 'Digital Marketing', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur possimus voluptate iste temporibus impedit reiciendis.' },
    { icon: 'bi-palette', title: 'Graphic Design', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur possimus voluptate iste temporibus impedit reiciendis.' },
    { icon: 'bi-camera-video', title: 'Video Editing', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur possimus voluptate iste temporibus impedit reiciendis.' }
  ];

  skills: string[] = ['C', 'C++', 'Java', 'Angular', 'Dotnet', 'Express', 'React', 'Git', 'Restfull API'];
  
  // Carousel State
  currentIndex = 0;
  slideInterval: any;

  // Physics State
  private engine!: Matter.Engine;
  private runner!: Matter.Runner;
  private bodies: { [key: string]: Matter.Body } = {};
  private boundaries: Matter.Body[] = [];
  private isPhysicsInitialized = false;

  constructor(private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.GetAllAboutMe();
    this.startAutoSlide();
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isPhysicsInitialized) {
          console.log('Skills section entered viewport. Initializing physics...');
          // Add a small delay for DOM stability
          setTimeout(() => {
            this.initPhysics();
          }, 500); // 500ms for stable rendering
          observer.unobserve(this.skillsContainer.nativeElement); 
        }
      });
    }, { threshold: 0.1 });

    if (this.skillsContainer) {
      observer.observe(this.skillsContainer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    this.cleanupPhysics();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isPhysicsInitialized) {
      this.cleanupPhysics();
      this.initPhysics();
    }
  }

  // --- Physics Playground Methods ---
  private initPhysics(retryCount = 0) {
    if (!this.skillsContainer) return;

    const container = this.skillsContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Safety check: if container has no size yet, retry
    if (width === 0 || height === 0) {
      if (retryCount < 5) {
        console.warn('Playground container has no size, retrying in 200ms...');
        setTimeout(() => this.initPhysics(retryCount + 1), 200);
      }
      return;
    }

    this.engine = Matter.Engine.create();
    this.engine.gravity.y = 1; 

    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);

    // Walls
    const wallOptions = { isStatic: true, render: { visible: false } };
    this.boundaries = [
      Matter.Bodies.rectangle(width / 2, -50, width, 100, wallOptions), // Top
      Matter.Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions), // Bottom
      Matter.Bodies.rectangle(-50, height / 2, 100, height, wallOptions), // Left
      Matter.Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions) // Right
    ];
    Matter.World.add(this.engine.world, this.boundaries);

    let bodiesCreated = 0;

    // Skill Bodies
    this.skills.forEach((skill, index) => {
      const el = document.getElementById(`skill-${index}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Fallback size if measurement fails
        const w = rect.width || 100;
        const h = rect.height || 40;
        
        const x = Math.random() * (width - 150) + 75;
        const y = Math.random() * 50 + 10; // Start inside the box, near the top
        
        const body = Matter.Bodies.rectangle(x, y, w, h, {
          restitution: 0.5,
          friction: 0.1,
          frictionAir: 0.01,
          chamfer: { radius: 10 }
        });
        
        this.bodies[skill] = body;
        Matter.World.add(this.engine.world, body);
        bodiesCreated++;
      } else {
        console.error(`Skill element skill-${index} not found!`);
      }
    });

    if (bodiesCreated === 0 && retryCount < 5) {
      console.warn('No skill elements found in DOM, retrying in 500ms...');
      this.cleanupPhysics();
      setTimeout(() => this.initPhysics(retryCount + 1), 500);
      return;
    }

    console.log(`Physics initialized with ${bodiesCreated} bodies.`);
    this.isPhysicsInitialized = true;

    // Mouse control
    const mouse = Matter.Mouse.create(container);
    const mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Matter.World.add(this.engine.world, mouseConstraint);

    // Sync loop
    Matter.Events.on(this.engine, 'afterUpdate', () => {
      this.skills.forEach((skill, index) => {
        const body = this.bodies[skill];
        const el = document.getElementById(`skill-${index}`);
        if (body && el) {
          el.style.transform = `translate(${body.position.x - el.clientWidth / 2}px, ${body.position.y - el.clientHeight / 2}px) rotate(${body.angle}rad)`;
          el.style.opacity = '1';
        }
      });
    });
  }

  private cleanupPhysics() {
    if (this.runner) Matter.Runner.stop(this.runner);
    if (this.engine) {
      Matter.World.clear(this.engine.world, false);
      Matter.Engine.clear(this.engine);
    }
    this.bodies = {};
    this.boundaries = [];
    this.isPhysicsInitialized = false;
  }

  // --- Carousel Methods ---
  startAutoSlide() {
    if (this.services.length > 3) {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, 3000);
    }
  }

  stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.services.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.services.length) % this.services.length;
  }

  getTransform() {
    const cardWidth = window.innerWidth <= 768 ? 100 : 33.33;
    return `translateX(-${this.currentIndex * cardWidth}%)`;
  }

  // --- Existing Methods ---
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