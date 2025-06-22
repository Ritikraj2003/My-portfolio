import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-project-master',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.scss']
})
export class ProjectMasterComponent implements OnInit {
  projects: any[] = [];
  projectForm!: FormGroup;
  logoPreview: string | ArrayBuffer | null = null;

  constructor( private fb: FormBuilder, 
    private modalService: NgbModal,
    private ngbModal: NgbModalModule,
    private APiService: AuthService
  ) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      subTitle: [''],
      description: [''],
      websiteLink: [''],
      githubLink: [''],
      logo: [''],
      reportPdf: ['']
    });

    this.GetAllProjects();
  }

  openModal(content: TemplateRef<any>) {
    this.projectForm.reset();
    this.logoPreview = null;
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.projectForm.patchValue({ logo: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onReportFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.projectForm.patchValue({ reportPdf: file });
    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const formData = new FormData();
      formData.append('Title', this.projectForm.get('title')?.value);
      formData.append('subTitle', this.projectForm.get('subTitle')?.value);
      formData.append('Description', this.projectForm.get('description')?.value);
      formData.append('Websitelink', this.projectForm.get('websiteLink')?.value);
      formData.append('githublink', this.projectForm.get('githubLink')?.value);

      // Use correct keys for files as expected by backend
      const logoFile = this.projectForm.get('logo')?.value;
      if (logoFile) {
        formData.append('Logo', logoFile); // <-- must match model property
      }

      const reportFile = this.projectForm.get('reportPdf')?.value;
      if (reportFile) {
        formData.append('report', reportFile); // <-- must match model property
      }

      this.APiService.AddProject(formData).subscribe({
        next: (res: any) => {
          this.modalService.dismissAll();
          console.log('Project added successfully:', res);
          this.projectForm.reset();
        }
      });
    } else {
      console.log('Form is invalid.');
    }
  }
    GetAllProjects() {
    this.APiService.getAllProjects().subscribe({
      next: (res: any) => {
        this.projects = res;
        console.log('Projects fetched successfully:', this.projects);
      },
      error: (err: any) => {
        console.error('Error fetching projects:', err);
      }
    });
}

DeleteProject(id: number) {
  this.APiService.DeleteProject(id).subscribe({
    next: (res: any) => {
      console.log('Project deleted successfully:', res);
      this.GetAllProjects(); // Refresh the project list after deletion
    },
    error: (err: any) => {
      console.error('Error deleting project:', err);
    }
  });
}

}