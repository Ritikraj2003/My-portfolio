import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
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

export class SkillsComponent {

skills = [
    'Angular', 'TypeScript', 'JavaScript',
    '.NET Core', 'C#', 'Entity Framework',
    'SQL Server', 'HTML', 'CSS', 'SCSS',
    'REST API', 'Git', 'Azure'
  ];
}
