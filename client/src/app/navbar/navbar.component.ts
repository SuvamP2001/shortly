import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  handleClick(event: any) {
    const navigationElement =
      event.target.closest('.btn-hamburger').nextElementSibling;

    navigationElement.classList.toggle('active');

    if (navigationElement.classList.contains('active'))
      event.target.setAttribute('src', '../../assets/images/cross.svg');
    else event.target.setAttribute('src', '../../assets/images/hamburger.svg');
  }
}
