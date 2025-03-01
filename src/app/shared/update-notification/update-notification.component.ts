import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { PwaUpdateService } from '../../services/pwa-update.service';

@Component({
  selector: 'app-update-notification',
  standalone: true,
  imports: [NgIf],
  templateUrl: './update-notification.component.html',
  styleUrl: './update-notification.component.scss'
})
export class UpdateNotificationComponent implements OnInit {
  updateAvailable = false;
  installAvailable = false;

  constructor(private pwaUpdateService: PwaUpdateService) {}

  ngOnInit(): void {
    // Subscribe to update notifications
    this.pwaUpdateService.isUpdateAvailable.subscribe(isAvailable => {
      this.updateAvailable = isAvailable;
    });
    
    // Subscribe to install notifications
    this.pwaUpdateService.isInstallAvailable.subscribe(isAvailable => {
      this.installAvailable = isAvailable;
    });
  }
  
  updateApp(): void {
    this.pwaUpdateService.updateApplication();
  }
  
  installApp(): void {
    this.pwaUpdateService.installPwa();
  }
  
  dismissUpdateNotification(): void {
    this.updateAvailable = false;
  }
  
  dismissInstallNotification(): void {
    this.installAvailable = false;
  }
}
