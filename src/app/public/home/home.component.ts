import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../admin/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('staggerProjects', [
      transition(':enter', [
        query('.card', [
          style({ opacity: 0, transform: 'scale(0.95)' }),
          stagger(150, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
          ])
        ])
      ])
    ])
  ]
})

export class HomeComponent implements OnInit {
  aboutMe: any;
  resume!: string;
  baseUrl: string = environment.apiUrl.replace(/\/api$/, '');
  
    constructor(private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.GetAllAboutMe();
    //const baseUrl = environment.apiUrl.replace(/\/api$/, '');
  }

  OnClickAbout() {
    this.router.navigate(['/about']);  // Navigate programmatically to /about page
  }

  GetAllAboutMe() {
    this.authService.GetAllAboutMe().subscribe((res) => {
      console.log(res);
      this.aboutMe = res;
      this.resume = this.aboutMe[0].resumeFile ? this.baseUrl + this.aboutMe[0].resumeFile : '';
      sessionStorage.setItem('name', this.aboutMe[0].name);
    });
  }


downloadResume() {
  debugger
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

// "resumeFile": "/Uploads/Resume/daa2224b-1e86-44d0-9a45-d9a6fe0828a8.pdf",