import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RecoveryJourneyComponent } from './recovery-journey/recovery-journey.component';
import { ExerciseLibraryComponent } from './exercise-library/exercise-library.component';
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component';
import { CommunityComponent } from './community/community.component';
import { ResourceCenterComponent } from './resource-center/resource-center.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'recovery-journey', component: RecoveryJourneyComponent },
  { path: 'exercises', component: ExerciseLibraryComponent },
  { path: 'progress', component: ProgressTrackerComponent },
  { path: 'community', component: CommunityComponent },
  { path: 'resources', component: ResourceCenterComponent },
  { path: '**', redirectTo: '' }
];
