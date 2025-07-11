import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { observeOn } from 'rxjs';

interface Skill {
  id: number;
  skill: string;
}

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.scss'
})
export class SkillComponent implements OnInit {
   data: any;
  nextId = 1;
  editingSkill: Skill | null = null;
  newSkill: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.getAllSkills();
  }

  getAllSkills() {
    this.authService.GetALlSkils().subscribe((res: any) => {
      this.data = res.data;
      //this.nextId = this.skills.length > 0 ? Math.max(...this.skills.map(s => s.id)) + 1 : 1;
    });
  }

  startEdit(skill: Skill) {
    this.editingSkill = { ...skill };
  }

  // saveEdit() {
  //   if (this.editingSkill) {
  //     const idx = this.skills.findIndex(s => s.id === this.editingSkill!.id);
  //     if (idx > -1) {
  //       this.skills[idx] = { ...this.editingSkill };
  //     }
  //     this.editingSkill = null;
  //   }
  // }

  // cancelEdit() {
  //   this.editingSkill = null;
  // }

  DeleteSkillByid(id: number) {
    this.authService.deleteSkill(id).subscribe((res: any) => {
      this.data = res.data;
      this.getAllSkills();
      //this.nextId = this.skills.length > 0 ? Math.max(...this.skills.map(s => s.id)) + 1 : 1;
    });
  }
  addSkill() {
    if (this.newSkill && this.newSkill.trim()) {
      const payload = { skills: this.newSkill.trim() };
      this.authService.Addskill(payload).subscribe({
        next: () => {
          this.getAllSkills(); // Refresh the table
          this.newSkill = '';
        },
        error: (err) => {
          // Optionally handle error (e.g., show a message)
          console.error('Failed to add skill', err);
        }
      });
    }
  }
}
