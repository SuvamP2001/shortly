import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LinkStorageService } from '../link-storage.service';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss',
})
export class InputFormComponent {
  originalURL: string = '';
  showError: boolean = false;

  constructor(
    private http: HttpClient,
    private linkStorageService: LinkStorageService
  ) {}

  handleSubmit() {
    console.log(this.originalURL);
    this.http
      .post<any>('http://localhost:8081/shorten/saveURl', {
        OriginalURL: this.originalURL,
      })
      .subscribe({
        next: (data) => {
          console.log('Response:', data);
          this.linkStorageService.setLinks(this.originalURL, data.shorten_url);
          this.originalURL = '';
          this.linkStorageService.success = true;
        },
        error: (error) => {
          console.error('Error:', error);
          if (error.error && error.error.message) {
            console.error('Error Message:', error.error.message);
            this.showError = true;
          }
        },
      });
  }
}
