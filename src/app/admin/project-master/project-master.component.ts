import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  baseUrl: string = environment.apiUrl.replace(/\/api$/, '');
  editingProject: any = null;
  reportPreview: string | null = null;
  safeReportPreview: SafeResourceUrl | null = null;
  

  constructor( private fb: FormBuilder, 
    private modalService: NgbModal,
    private ngbModal: NgbModalModule,
    private APiService: AuthService
    , private sanitizer: DomSanitizer
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

  async editProject(project: any, content: TemplateRef<any>) {
    this.editingProject = project;
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });

    this.projectForm.patchValue({   
      title: project.title,
      subTitle: project.subTitle,
      description: project.description,
      websiteLink: project.websitelink,
      githubLink: project.githublink,
      logo: null,
      reportPdf: null
    });

    // Handle logo preview and patch
    let logoUrl = project.pLogo;
    if (logoUrl && !logoUrl.startsWith('http')) {
      logoUrl = this.baseUrl + logoUrl;
    }
    this.logoPreview = logoUrl;
    if (logoUrl) {
      const logoFile = await this.urlToFile(logoUrl, 'logo.jpg');
      this.projectForm.patchValue({ logo: logoFile });
    }

    // Handle report PDF preview and patch
    debugger;
    let reportUrl = project.reportP;
    if (reportUrl && !reportUrl.startsWith('http')) {
      reportUrl = this.baseUrl + reportUrl;
    }
    this.reportPreview = reportUrl;
    this.safeReportPreview = reportUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(reportUrl) : null;
    if (reportUrl) {
      const reportFile = await this.urlToFile(reportUrl, 'report.pdf');
      this.projectForm.patchValue({ reportPdf: reportFile });
    }
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

  async onSubmit() {
    if (this.projectForm.valid) {
      const formData = new FormData();
      formData.append('Title', this.projectForm.get('title')?.value);
      formData.append('subTitle', this.projectForm.get('subTitle')?.value);
      formData.append('Description', this.projectForm.get('description')?.value);
      formData.append('Websitelink', this.projectForm.get('websiteLink')?.value);
      formData.append('githublink', this.projectForm.get('githubLink')?.value);

      // Handle logo
      const logoFile = this.projectForm.get('logo')?.value;
      if (logoFile) {
        formData.append('Logo', logoFile);
      } else if (this.editingProject && this.logoPreview) {
        // Convert the preview URL to a File and append
        const file = await this.urlToFile(this.logoPreview as string, 'logo.jpg');
        formData.append('Logo', file);
      }

      // Handle report
      const reportFile = this.projectForm.get('reportPdf')?.value;
      if (reportFile) {
        formData.append('report', reportFile);
      }

      if (this.editingProject) {
        // Update existing project
        this.APiService.UpdateProject(this.editingProject.id, formData).subscribe({
          next: (res: any) => {
            this.modalService.dismissAll();
            this.projectForm.reset();
            this.editingProject = null;
            this.GetAllProjects();
          }
        });
      } else {
        // Add new project
        this.APiService.AddProject(formData).subscribe({
          next: (res: any) => {
            this.modalService.dismissAll();
            this.projectForm.reset();
            this.GetAllProjects();
          }
        });
      }
    } else {
      console.log('Form is invalid.');
    }
  }
 GetAllProjects() {
    this.APiService.getAllProjects().subscribe({
      next: (res: any) => {
        this.projects = res.data;
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

  // Helper function to convert image URL to File
  private async urlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }
}