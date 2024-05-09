import { Component } from '@angular/core';
import { UrlsListComponent } from '../urls-list/urls-list.component';

@Component({
  selector: 'app-main-section',
  standalone: true,
  imports: [UrlsListComponent],
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.scss',
})
export class MainSectionComponent {}
