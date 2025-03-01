import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exercise-library',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './exercise-library.component.html',
  styleUrl: './exercise-library.component.scss'
})
export class ExerciseLibraryComponent {
  selectedPhase: string = 'all';
  searchQuery: string = '';
  
  phases = [
    { id: 'all', name: 'All Phases' },
    { id: 'pre-op', name: 'Pre-operative' },
    { id: 'early-recovery', name: 'Early Recovery (0-2 weeks)' },
    { id: 'strength-building', name: 'Strength Building (2-6 weeks)' },
    { id: 'advanced-training', name: 'Advanced Training (6-12 weeks)' },
    { id: 'return-to-sport', name: 'Return to Sport (12+ weeks)' }
  ];
  
  exercises = [
    {
      id: 1,
      name: 'Heel Slides',
      phase: 'early-recovery',
      targetAreas: ['Knee flexion', 'Range of motion'],
      description: 'Slide your heel toward your buttocks by bending your knee while keeping your heel on the surface.',
      videoUrl: 'https://example.com/videos/heel-slides',
      thumbnail: 'assets/exercise-thumbnails/heel-slides.jpg',
      difficulty: 'Beginner'
    },
    {
      id: 2,
      name: 'Quad Sets',
      phase: 'early-recovery',
      targetAreas: ['Quadriceps strength'],
      description: 'Tighten your thigh muscle while pushing the back of your knee down toward the floor.',
      videoUrl: 'https://example.com/videos/quad-sets',
      thumbnail: 'assets/exercise-thumbnails/quad-sets.jpg',
      difficulty: 'Beginner'
    },
    {
      id: 3,
      name: 'Straight Leg Raises',
      phase: 'early-recovery',
      targetAreas: ['Quadriceps strength', 'Hip flexors'],
      description: 'Tighten your thigh muscle and lift your leg straight up about 12 inches off the ground.',
      videoUrl: 'https://example.com/videos/straight-leg-raises',
      thumbnail: 'assets/exercise-thumbnails/straight-leg-raises.jpg',
      difficulty: 'Beginner'
    },
    {
      id: 4,
      name: 'Wall Slides',
      phase: 'strength-building',
      targetAreas: ['Quadriceps', 'Controlled knee flexion'],
      description: 'With your back against a wall, slide down into a partial squat position, then slide back up.',
      videoUrl: 'https://example.com/videos/wall-slides',
      thumbnail: 'assets/exercise-thumbnails/wall-slides.jpg',
      difficulty: 'Intermediate'
    },
    {
      id: 5,
      name: 'Hamstring Curls',
      phase: 'strength-building',
      targetAreas: ['Hamstrings'],
      description: 'While standing, bend your knee and bring your heel up toward your buttocks.',
      videoUrl: 'https://example.com/videos/hamstring-curls',
      thumbnail: 'assets/exercise-thumbnails/hamstring-curls.jpg',
      difficulty: 'Intermediate'
    },
    {
      id: 6,
      name: 'Step-ups',
      phase: 'advanced-training',
      targetAreas: ['Quadriceps', 'Balance', 'Functional strength'],
      description: 'Step up onto a platform with one leg, then bring the other leg up, before stepping back down.',
      videoUrl: 'https://example.com/videos/step-ups',
      thumbnail: 'assets/exercise-thumbnails/step-ups.jpg',
      difficulty: 'Advanced'
    },
    {
      id: 7,
      name: 'Lateral Lunges',
      phase: 'advanced-training',
      targetAreas: ['Lateral stability', 'Hip mobility'],
      description: 'Step to the side and bend the knee of the stepping leg while keeping the other leg straight.',
      videoUrl: 'https://example.com/videos/lateral-lunges',
      thumbnail: 'assets/exercise-thumbnails/lateral-lunges.jpg',
      difficulty: 'Advanced'
    },
    {
      id: 8,
      name: 'Plyometric Exercises',
      phase: 'return-to-sport',
      targetAreas: ['Power', 'Explosive strength'],
      description: 'Various jumping exercises that build power and prepare for dynamic sports movements.',
      videoUrl: 'https://example.com/videos/plyometrics',
      thumbnail: 'assets/exercise-thumbnails/plyometrics.jpg',
      difficulty: 'Expert'
    }
  ];
  
  get filteredExercises() {
    return this.exercises.filter(exercise => {
      // Filter by phase
      const phaseMatch = this.selectedPhase === 'all' || exercise.phase === this.selectedPhase;
      
      // Filter by search query
      const searchMatch = this.searchQuery === '' || 
        exercise.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        exercise.targetAreas.some(area => area.toLowerCase().includes(this.searchQuery.toLowerCase()));
        
      return phaseMatch && searchMatch;
    });
  }
  
  getPhaseName(phaseId: string): string {
    const phase = this.phases.find(p => p.id === phaseId);
    return phase ? phase.name : 'Unknown Phase';
  }
}
