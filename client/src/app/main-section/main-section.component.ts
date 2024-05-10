import { Component } from '@angular/core';
import { UrlsListComponent } from '../urls-list/urls-list.component';
import { InputFormComponent } from '../input-form/input-form.component';
import { LinkStorageService } from '../link-storage.service';

@Component({
  selector: 'app-main-section',
  standalone: true,
  imports: [UrlsListComponent, InputFormComponent],
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.scss',
})
export class MainSectionComponent {
  constructor(private linkStorageService: LinkStorageService) {}
}
