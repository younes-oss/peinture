import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { NotificationComponent } from './components/shared/notification/notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
