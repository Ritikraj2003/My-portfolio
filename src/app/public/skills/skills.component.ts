import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { AuthService } from '../../admin/services/auth.service';
import { SeoService } from '../../core/services/seo.service';
@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  animations: [
    trigger('skillAnimation', [
      transition(':enter', [
        query(
          '.skill',
          [
            style({ opacity: 0, transform: 'scale(0.8)' }),
            stagger(100, [
              animate(
                '400ms ease-out',
                style({ opacity: 1, transform: 'scale(1)' })
              )
            ])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})

export class SkillsComponent implements OnInit {

 skills: any[] = []; // Initialize as an empty array  
  constructor(
    private authService: AuthService,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  
ngOnInit(): void {
  this.seoService.updateSeoTags({
    title: 'Skills & Expertise',
    description: 'Technical skills and soft capabilities of Ritik Raj, including Angular, .NET Core, SQL Server, and full-stack development expertise.',
    keywords: 'Ritik Raj Skills, Angular Developer Skills, .NET Developer Expertise'
  });

  if (isPlatformBrowser(this.platformId)) {
    this.GetAllSkills();
  }
}

StaticSkill = [
    'Angular', 'TypeScript', 'JavaScript',
    '.NET Core', 'C#', 'Entity Framework',
    'SQL Server', 'HTML', 'CSS', 'SCSS',
    'REST API', 'Git', 'Azure'
  ];
GetAllSkills() {
  this.authService.GetALlSkils().subscribe({
    next: (res: any) => {
      this.skills = res.data
      console.log(this.skills);
    }
  });
}
}
