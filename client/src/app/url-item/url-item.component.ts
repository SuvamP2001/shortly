import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';

@Component({
  selector: 'app-url-item',
  standalone: true,
  imports: [CommonModule, ClipboardModule],
  templateUrl: './url-item.component.html',
  styleUrl: './url-item.component.scss',
})
export class UrlItemComponent {
  @Input() originalLink: string = '';
  @Input() shortenedLink: string = '';
  copySuccess: boolean = false;

  onCopySuccess() {
    this.copySuccess = true;
  }
}
