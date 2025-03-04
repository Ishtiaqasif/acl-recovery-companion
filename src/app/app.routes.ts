import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RecoveryJourneyComponent } from './recovery-journey/recovery-journey.component';
import { ExerciseLibraryComponent } from './exercise-library/exercise-library.component';
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component';
import { CommunityComponent } from './community/community.component';
import { ResourceCenterComponent } from './resource-center/resource-center.component';
import { AUTH_ROUTES } from './auth/auth.routes';
//import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { 
    path: '', 
    component: LandingPageComponent,
    title: 'ACL Recovery Companion' 
  },
  { 
    path: 'resources', 
    component: ResourceCenterComponent,
    title: 'Resources - ACL Recovery Companion' 
  },
  
  // Auth routes
  {
    path: 'auth',
    children: AUTH_ROUTES
  },
  
  // Protected routes (require login)
  { 
    path: 'recovery-journey', 
    component: RecoveryJourneyComponent,
    //canActivate: [authGuard],
    title: 'My Recovery Journey - ACL Recovery Companion'
  },
  { 
    path: 'exercises', 
    component: ExerciseLibraryComponent,
    //canActivate: [authGuard],
    title: 'Exercise Library - ACL Recovery Companion'
  },
  { 
    path: 'progress', 
    component: ProgressTrackerComponent,
    //canActivate: [authGuard],
    title: 'Progress Tracker - ACL Recovery Companion'
  },
  { 
    path: 'community', 
    component: CommunityComponent,
    //canActivate: [authGuard],
    title: 'Community - ACL Recovery Companion'
  },
  
  // Fallback route
  { path: '**', redirectTo: '' }
];
