import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LinkStorageService {
  localStorageKey: string = 'linkStorage';
  urls: { originalLink: string; shortenedLink: string }[] = [];
  success: boolean = false;
  urlsChanged: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    this.loadFromLocalStorage();
  }

  setLinks(originalLink: string, shortenedLink: string) {
    this.urls.push({ originalLink, shortenedLink });
    this.saveToLocalStorage();
  }

  getUrls(): { originalLink: string; shortenedLink: string }[] {
    return this.urls;
  }

  clearLinks() {
    this.urls = [];
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.localStorageKey);
    }
  }

  private saveToLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.urls));
    }
  }

  private loadFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem(this.localStorageKey);
      if (data) {
        this.urls = JSON.parse(data);
      }
    }
  }
}
