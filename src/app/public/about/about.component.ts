import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core'
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../admin/services/auth.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  animations: [
    trigger('fadeInStagger', [
      transition(':enter', [
        query('h2, p, .details div, .download-btn', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(150, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ]
})
export class AboutComponent implements OnInit {
  aboutMe: any;
  resume: any;
   baseUrl: string = environment.apiUrl.replace(/\/api$/, '');
   image: any;

   constructor(
     private authService: AuthService,
     @Inject(PLATFORM_ID) private platformId: Object,
     private seoService: SeoService
   ) {}
  ngOnInit(): void {
    this.seoService.updateSeoTags({
      title: 'About Me',
      description: 'Learn more about Ritik Raj, his experience in .NET and Angular development, and his passion for building scalable web solutions.',
      keywords: 'About Ritik Raj, Software Developer Experience, .NET Expert, Angular Developer'
    });
    this.GetAllAboutMe();
  }

  GetAllAboutMe() {
    this.authService.GetAllAboutMe().subscribe((res) => {
      console.log(res);
      this.aboutMe = res.data;
      this.resume = this.aboutMe[0].resumeFile ? this.baseUrl + this.aboutMe[0].resumeFile : '';
      this.image = this.aboutMe[0].imageFile ? this.baseUrl + this.aboutMe[0].imageFile : '';
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.setItem('name', this.aboutMe[0].name);
      }
    });
  }

  downloadResume() {
  if (!isPlatformBrowser(this.platformId)) return;

  fetch(this.resume, { mode: 'cors' })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Ritik_Resume.pdf'; // You can set a custom file name here
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch(() => alert('Failed to download resume.'));
}
}
