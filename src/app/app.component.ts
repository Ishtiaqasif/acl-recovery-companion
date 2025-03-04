import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { UpdateNotificationComponent } from './shared/update-notification/update-notification.component';
import { PwaUpdateService } from './services/pwa-update.service';
import { DbManagerService } from './services/db-manager.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, UpdateNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ACL Recovery Companion';
  
  constructor(
    private pwaUpdateService: PwaUpdateService,
    private dbManager: DbManagerService
    ) {
      this.dbManager.initializeDatabase()
      .catch(error => console.error('Error initializing database:', error));
    // The service is injected here to ensure it's initialized
    // This will set up the update and install listeners
  }
}
