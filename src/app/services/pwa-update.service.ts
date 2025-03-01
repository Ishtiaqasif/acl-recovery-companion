import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {
  private updateAvailable = new BehaviorSubject<boolean>(false);
  private installPromptEvent: any;
  private installAvailable = new BehaviorSubject<boolean>(false);

  constructor(private swUpdate: SwUpdate) {
    // Set up service worker update handling
    if (this.swUpdate.isEnabled) {
      // Check for updates every 30 minutes
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 30 * 60 * 1000);
      
      // When an update is available, notify the user
      this.swUpdate.versionUpdates
        .pipe(
          filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
          map(evt => {
            console.log(`Current app version: ${evt.currentVersion.hash}`);
            console.log(`Update available: ${evt.latestVersion.hash}`);
            return true;
          })
        )
        .subscribe(val => {
          this.updateAvailable.next(val);
        });
    }
    
    // Listen for beforeinstallprompt event to handle PWA installation
    window.addEventListener('beforeinstallprompt', (event: any) => {
      // Prevent the default browser install prompt
      event.preventDefault();
      
      // Store the event for later use
      this.installPromptEvent = event;
      
      // Notify any subscribers that installation is available
      this.installAvailable.next(true);
    });
  }
  
  /**
   * Update the application when a new version is available
   */
  updateApplication(): Promise<boolean> {
    if (!this.swUpdate.isEnabled) {
      return Promise.resolve(false);
    }
    
    return this.swUpdate.activateUpdate().then(() => {
      // Reload the page to apply the update
      document.location.reload();
      return true;
    });
  }
  
  /**
   * Prompt the user to install the PWA
   */
  installPwa(): Promise<boolean> {
    if (!this.installPromptEvent) {
      return Promise.resolve(false);
    }
    
    // Show the install prompt
    this.installPromptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    return this.installPromptEvent.userChoice.then((choice: any) => {
      // Reset the install prompt event
      this.installPromptEvent = null;
      this.installAvailable.next(false);
      
      // Return true if the user accepted the installation
      return choice.outcome === 'accepted';
    });
  }
  
  /**
   * Check if an update is available
   */
  get isUpdateAvailable(): Observable<boolean> {
    return this.updateAvailable.asObservable();
  }
  
  /**
   * Check if PWA installation is available
   */
  get isInstallAvailable(): Observable<boolean> {
    return this.installAvailable.asObservable();
  }
}
