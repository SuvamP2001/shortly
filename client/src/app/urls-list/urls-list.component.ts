import { Component, OnInit } from '@angular/core';
import { UrlItemComponent } from '../url-item/url-item.component';
import { LinkStorageService } from '../link-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-urls-list',
  standalone: true,
  imports: [UrlItemComponent, CommonModule],
  templateUrl: './urls-list.component.html',
  styleUrl: './urls-list.component.scss',
})
export class UrlsListComponent implements OnInit {
  urlsList: { originalLink: string; shortenedLink: string }[] | undefined = [];

  constructor(private linkStorageService: LinkStorageService) {}

  ngOnInit() {
    this.urlsList = this.linkStorageService.getUrls();
    console.log(this.urlsList);
  }

  ngOnChanges() {
    this.urlsList = this.linkStorageService.getUrls();
    console.log(this.urlsList);
  }

  getUrls() {}
}
