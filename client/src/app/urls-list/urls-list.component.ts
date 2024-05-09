import { Component } from '@angular/core';
import { UrlItemComponent } from '../url-item/url-item.component';

@Component({
  selector: 'app-urls-list',
  standalone: true,
  imports: [UrlItemComponent],
  templateUrl: './urls-list.component.html',
  styleUrl: './urls-list.component.scss',
})
export class UrlsListComponent {}
