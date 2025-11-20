import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './admin-side-nav.component.html',
  styleUrls: ['./admin-side-nav.component.scss']
})
export class AdminSideNavComponent {
  isCollapsed = false;

  toggleNav(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  closeNav(): void {
    this.isCollapsed = false;
  }
}
