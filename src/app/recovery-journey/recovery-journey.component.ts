import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-recovery-journey',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './recovery-journey.component.html',
  styleUrl: './recovery-journey.component.scss'
})
export class RecoveryJourneyComponent {
  currentPhase = 'early-recovery'; // Could be 'pre-op', 'early-recovery', 'strength-building', 'advanced-training', 'return-to-sport'
  daysPostSurgery = 14;
  
  milestones = [
    { name: 'Full extension', completed: true, date: '2025-02-20' },
    { name: 'Walk without crutches', completed: true, date: '2025-02-25' },
    { name: '90° flexion', completed: false, target: '2025-03-15' },
    { name: 'Full flexion', completed: false, target: '2025-04-10' },
    { name: 'Light jogging', completed: false, target: '2025-06-01' },
    { name: 'Return to sport', completed: false, target: '2025-09-01' }
  ];
}
