import { Component, OnInit } from '@angular/core'
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { AuthService } from '../admin/services/auth.service';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';


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

   constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.GetAllAboutMe();
  }

GetAllAboutMe() {
  debugger;
    this.authService.GetAllAboutMe().subscribe((res) => {
      console.log(res);
      this.aboutMe = res;
      this.resume = environment.apiUrl + this.aboutMe[0].resume;
      sessionStorage.setItem('name', this.aboutMe[0].name);
    });
  }
}
