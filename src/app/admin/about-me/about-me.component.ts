import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {
  aboutMeForm: FormGroup;
  editMode = false;
  id: number = 0;
  safeResumeUrl: SafeResourceUrl | null = null;
   baseUrl = environment.apiUrl.replace(/\/api$/, '');
   selectedImageFile: File | null = null;
   selectedResumeFile: File | null = null;

  constructor(private fb: FormBuilder,
    private APiService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.aboutMeForm = this.fb.group({
      
      Name: [{ value: '', disabled: true }],
      Gmail: [{ value: '', disabled: true }],
      PhoneNumber: [{ value: '', disabled: true }],
      Bio: [{ value: '', disabled: true }],
      Image: [{ value: '', disabled: true }],
      Resume: [{ value: '', disabled: true }],
      Description: [{ value: '', disabled: true }],
      Experience: [{ value: '', disabled: true }],
      Location: [{ value: '', disabled: true }],
    });
  }
  ngOnInit(): void {
    this.GetAllAboutMe();
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    Object.keys(this.aboutMeForm.controls).forEach(key => {
      if (this.editMode) {
        this.aboutMeForm.get(key)?.enable();
      } else {
        this.aboutMeForm.get(key)?.disable();
      }
    });
  }

  // onSubmit() {
  //   debugger; 
  //   if (this.aboutMeForm.valid) {
  //     const formData = new FormData();
  //     Object.keys(this.aboutMeForm.controls).forEach(key => {
  //       const value = this.aboutMeForm.get(key)?.value;
  //       if ((key === 'Image' || key === 'Resume') && value && value instanceof File) {
  //         formData.append(key, value);
  //       } else if (key !== 'Image' && key !== 'Resume' && value !== null && value !== undefined) {
  //         formData.append(key, value);
  //       }
  //     });
  //     if (this.id != 0) {
  //       this.APiService.UpdateAboutMe(this.id, formData).subscribe((res: any) => {
  //         console.log(res);
  //       });
  //     } else {
  //       this.APiService.AddAboutMe(formData).subscribe((res: any) => {
  //         console.log(res);
  //       });
  //     }
  //     this.editMode = false;
  //     Object.keys(this.aboutMeForm.controls).forEach(key => {
  //       this.aboutMeForm.get(key)?.disable();
  //     });
  //   }
  // }

   onSubmit() {
  if (this.aboutMeForm.valid) {
    const formData = new FormData();
    Object.keys(this.aboutMeForm.controls).forEach(key => {
      const value = this.aboutMeForm.get(key)?.value;
      if (key === 'Image') {
        if (this.selectedImageFile) {
          formData.append('Image', this.selectedImageFile);
        } else if (typeof value === 'string' && value) {
          // Extract file name from URL if needed
          const fileName = value.split('/').pop() || value;
          formData.append('ImageFile', fileName);
        }
      } else if (key === 'Resume') {
        if (this.selectedResumeFile) {
          formData.append('Resume', this.selectedResumeFile);
        } else if (typeof value === 'string' && value) {
          const fileName = value.split('/').pop() || value;
          formData.append('ResumeFile', fileName);
        }
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    // ...existing code for API call...
    if (this.id != 0) {
      this.APiService.UpdateAboutMe(this.id, formData).subscribe((res: any) => {
        console.log(res);
      });
    } else {
      this.APiService.AddAboutMe(formData).subscribe((res: any) => {
        console.log(res);
      });
    }
    this.editMode = false;
    Object.keys(this.aboutMeForm.controls).forEach(key => {
      this.aboutMeForm.get(key)?.disable();
    });
    // Reset selected files after submit
    this.selectedImageFile = null;
    this.selectedResumeFile = null;
  }
}


  GetAllAboutMe() {
    this.APiService.GetAllAboutMe().subscribe((res: any) => {
      if (Array.isArray(res) && res.length > 0) {
        const data = res[0];
        
        const resumeUrl = data.resumeFile ? this.baseUrl + data.resumeFile : '';
        this.id = data.id;
        this.aboutMeForm.patchValue({
          
          Name: data.name || '',
          Gmail: data.gmail || '',
          PhoneNumber: data.phoneNumber || '',
          Bio: data.bio || '',
          Image: data.imageFile ? this.baseUrl + data.imageFile : '',
          Resume: resumeUrl,
          Description: data.description || '',
          Experience: data.experience || '',
          Location: data.location || '',
        });
        this.safeResumeUrl = resumeUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(resumeUrl) : null;
      } else {
        this.safeResumeUrl = null;
      }
    });
  }

//  onImageChange(event: Event) {
//   const input = event.target as HTMLInputElement;
//   if (input.files && input.files[0]) {
//     const file = input.files[0];
//     const reader = new FileReader();
//     reader.onload = () => {
//       this.aboutMeForm.patchValue({ Image: reader.result });
//     };
//     reader.readAsDataURL(file);
//   }
// }
onImageChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    this.selectedImageFile = file; // store file for upload
    const reader = new FileReader();
    reader.onload = () => {
      this.aboutMeForm.patchValue({ Image: reader.result });
    };
    reader.readAsDataURL(file);
  }
}

onResumeChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    this.selectedResumeFile = file; // store file for upload
    const fileUrl = URL.createObjectURL(file);
    this.aboutMeForm.patchValue({ Resume: fileUrl });
    this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }
}

// onResumeChange(event: Event) {
//   const input = event.target as HTMLInputElement;
//   if (input.files && input.files[0]) {
//     const file = input.files[0];
//     const fileUrl = URL.createObjectURL(file);
//     this.aboutMeForm.patchValue({ Resume: fileUrl });
//     this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
//   }
// }
}
