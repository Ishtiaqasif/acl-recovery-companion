import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ProgressEntry {
  date: Date;
  painLevel: number;
  swelling: 'none' | 'mild' | 'moderate' | 'severe';
  flexion: number; // degrees
  extension: number; // degrees
  notes: string;
}

interface Goal {
  id: number;
  name: string;
  target: Date;
  description: string;
  category: 'mobility' | 'strength' | 'activity' | 'pain';
  achieved: boolean;
  achievedDate?: Date;
}

@Component({
  selector: 'app-progress-tracker',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, FormsModule, RouterLink, CommonModule],
  templateUrl: './progress-tracker.component.html',
  styleUrl: './progress-tracker.component.scss'
})
export class ProgressTrackerComponent implements OnInit {
  surgeryDate = new Date(2025, 1, 15); // February 15, 2025
  today = new Date();
  
  // Calculate days since surgery
  daysSinceSurgery = Math.floor((this.today.getTime() - this.surgeryDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // For math operations in template
  Math = Math;
  
  painLevelOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  swellingOptions = ['none', 'mild', 'moderate', 'severe'];
  
  // New entry being created
  newEntry: ProgressEntry = {
    date: new Date(),
    painLevel: 3,
    swelling: 'mild',
    flexion: 70,
    extension: -5,
    notes: ''
  };
  
  // Progress history
  progressHistory: ProgressEntry[] = [
    {
      date: new Date(2025, 1, 20), // Feb 20, 2025
      painLevel: 8,
      swelling: 'severe',
      flexion: 45,
      extension: -15,
      notes: 'First day of physical therapy. Significant pain and swelling.'
    },
    {
      date: new Date(2025, 1, 27), // Feb 27, 2025
      painLevel: 6,
      swelling: 'moderate',
      flexion: 60,
      extension: -10,
      notes: 'Swelling reduced after consistent icing. Still difficult to bend knee fully.'
    },
    {
      date: new Date(2025, 2, 5), // March 5, 2025
      painLevel: 4,
      swelling: 'mild',
      flexion: 70,
      extension: -5,
      notes: 'Can put more weight on leg now. Extension is improving.'
    }
  ];
  
  // Recovery goals
  goals: Goal[] = [
    {
      id: 1,
      name: 'Full Extension',
      target: new Date(2025, 2, 15), // March 15, 2025
      description: 'Achieve 0 degrees of knee extension (straight leg)',
      category: 'mobility',
      achieved: false
    },
    {
      id: 2,
      name: '90° Flexion',
      target: new Date(2025, 3, 1), // April 1, 2025
      description: 'Bend knee to 90 degrees',
      category: 'mobility',
      achieved: false
    },
    {
      id: 3,
      name: 'Minimal Swelling',
      target: new Date(2025, 2, 20), // March 20, 2025
      description: 'Reduce swelling to minimal or none',
      category: 'pain',
      achieved: false
    },
    {
      id: 4,
      name: 'Walk without Crutches',
      target: new Date(2025, 3, 15), // April 15, 2025
      description: 'Walk without assistance from crutches',
      category: 'activity',
      achieved: false
    },
    {
      id: 5,
      name: 'Pain Level < 3',
      target: new Date(2025, 3, 10), // April 10, 2025
      description: 'Reduce daily pain level to less than 3 out of 10',
      category: 'pain',
      achieved: false
    },
    {
      id: 6,
      name: 'Leg Press (50% bodyweight)',
      target: new Date(2025, 4, 15), // May 15, 2025
      description: 'Perform leg press with 50% of bodyweight',
      category: 'strength',
      achieved: false
    }
  ];
  
  // Progress chart data
  flexionData: {date: string, value: number}[] = [];
  extensionData: {date: string, value: number}[] = [];
  painData: {date: string, value: number}[] = [];
  
  // Current active tab
  activeTab = 'summary';
  
  constructor() { }
  
  ngOnInit(): void {
    this.processChartData();
  }
  
  // Process data for charts
  processChartData(): void {
    // Sort entries by date
    const sortedEntries = [...this.progressHistory].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    this.flexionData = sortedEntries.map(entry => ({
      date: this.formatDate(entry.date),
      value: entry.flexion
    }));
    
    this.extensionData = sortedEntries.map(entry => ({
      date: this.formatDate(entry.date),
      value: entry.extension
    }));
    
    this.painData = sortedEntries.map(entry => ({
      date: this.formatDate(entry.date),
      value: entry.painLevel
    }));
  }
  
  // Add new progress entry
  updateEntryDate(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const dateValue = inputElement.value;
    this.newEntry.date = new Date(dateValue);
  }
  
  addProgressEntry(): void {
    // Create a deep copy to avoid reference issues
    const entry: ProgressEntry = {
      date: new Date(this.newEntry.date),
      painLevel: this.newEntry.painLevel,
      swelling: this.newEntry.swelling,
      flexion: this.newEntry.flexion,
      extension: this.newEntry.extension,
      notes: this.newEntry.notes
    };
    
    // Add to history
    this.progressHistory.push(entry);
    
    // Sort entries by date (newest first)
    this.progressHistory.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    // Reset form for the next entry
    this.newEntry = {
      date: new Date(),
      painLevel: 3,
      swelling: 'mild',
      flexion: 70,
      extension: -5,
      notes: ''
    };
    
    // Update chart data
    this.processChartData();
    
    // Check if any goals were achieved
    this.checkGoalAchievement();
  }
  
  // Check if any goals were achieved with the latest entry
  checkGoalAchievement(): void {
    const latestEntry = this.progressHistory[0]; // Already sorted, newest first
    
    this.goals.forEach(goal => {
      if (goal.achieved) return; // Skip already achieved goals
      
      let achieved = false;
      
      switch (goal.name) {
        case 'Full Extension':
          achieved = latestEntry.extension >= 0;
          break;
        case '90° Flexion':
          achieved = latestEntry.flexion >= 90;
          break;
        case 'Minimal Swelling':
          achieved = latestEntry.swelling === 'none';
          break;
        case 'Pain Level < 3':
          achieved = latestEntry.painLevel < 3;
          break;
        // Other goals would be checked manually
      }
      
      if (achieved) {
        goal.achieved = true;
        goal.achievedDate = new Date();
      }
    });
  }
  
  // Mark a goal as achieved manually
  markGoalAchieved(goalId: number): void {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.achieved = true;
      goal.achievedDate = new Date();
    }
  }
  
  // Helper function to format dates consistently for charts
  formatDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
  
  // Switch between tabs
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  // Get the latest progress values
  get latestProgress(): ProgressEntry | null {
    if (this.progressHistory.length === 0) return null;
    return this.progressHistory[0]; // Already sorted, newest first
  }
  
  // Calculate progress percentage based on goals achieved
  get progressPercentage(): number {
    const achievedGoals = this.getAchievedGoalsCount();
    return Math.round((achievedGoals / this.goals.length) * 100);
  }
  
  // Get count of achieved goals for template use without arrow functions
  getAchievedGoalsCount(): number {
    return this.goals.filter(g => g.achieved).length;
  }
  
  // Get upcoming goals
  get upcomingGoals(): Goal[] {
    return this.getUpcomingGoals();
  }
  
  // Method to get upcoming goals without arrow functions in template
  getUpcomingGoals(): Goal[] {
    return this.goals
      .filter(g => !g.achieved)
      .sort((a, b) => a.target.getTime() - b.target.getTime())
      .slice(0, 3); // Get the next 3 upcoming goals
  }
  
  // Get recently achieved goals
  get recentlyAchievedGoals(): Goal[] {
    return this.goals
      .filter(g => g.achieved && g.achievedDate)
      .sort((a, b) => (b.achievedDate as Date).getTime() - (a.achievedDate as Date).getTime())
      .slice(0, 3); // Get the 3 most recently achieved goals
  }
  
  // Methods to filter goals by category for template use
  getGoalsByCategory(category: 'mobility' | 'strength' | 'activity' | 'pain'): Goal[] {
    return this.goals.filter(g => g.category === category);
  }
}
