import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Goal, GoalResponse, GoalListResponse } from '../models/goal.model';
import { MongoDBService } from './mongodb.service';
import { AuthService } from './auth.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private DATABASE_NAME = 'acl_recovery';
  private GOALS_COLLECTION = 'goals';

  constructor(
    private mongoDBService: MongoDBService,
    private authService: AuthService
  ) {}

  // Create a new goal
  createGoal(goalData: Goal): Observable<GoalResponse> {
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('No user is logged in'));
    }

    const newGoal: Goal = {
      ...goalData,
      id: uuidv4(),
      user: currentUser.id,
      achieved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return from(this.getGoalsCollection().insertOne(newGoal)).pipe(
      map(() => ({
        success: true,
        data: newGoal
      })),
      catchError(error => {
        console.error('Error creating goal:', error);
        return throwError(() => new Error(error.message || 'Failed to create goal'));
      })
    );
  }

  // Get all goals for the current user
  getGoals(): Observable<GoalListResponse> {
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('No user is logged in'));
    }

    return from(this.getGoalsCollection().find({ user: currentUser.id }).toArray()).pipe(
      map(goals => ({
        success: true,
        count: goals.length,
        data: goals as unknown as Goal[]
      })),
      catchError(error => {
        console.error('Error fetching goals:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch goals'));
      })
    );
  }

  // Get a single goal by ID
  getGoal(id: string): Observable<GoalResponse> {
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('No user is logged in'));
    }

    return from(this.getGoalsCollection().findOne({ id, user: currentUser.id })).pipe(
      map(goal => {
        if (!goal) {
          throw new Error('Goal not found');
        }
        return {
          success: true,
          data: goal as unknown as Goal
        };
      }),
      catchError(error => {
        console.error('Error fetching goal:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch goal'));
      })
    );
  }

  // Update a goal
  updateGoal(id: string, goalData: Partial<Goal>): Observable<GoalResponse> {
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('No user is logged in'));
    }

    const updateData = {
      ...goalData,
      updatedAt: new Date()
    };

    return from(this.getGoalsCollection().findOneAndUpdate(
      { id, user: currentUser.id },
      { $set: updateData },
      { returnDocument: 'after' }
    )).pipe(
      map(result => {
        if (!result) {
          throw new Error('Goal not found');
        }
        return {
          success: true,
          data: result as unknown as Goal
        };
      }),
      catchError(error => {
        console.error('Error updating goal:', error);
        return throwError(() => new Error(error.message || 'Failed to update goal'));
      })
    );
  }

  // Mark a goal as achieved
  markGoalAchieved(id: string): Observable<GoalResponse> {
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('No user is logged in'));
    }

    const updateData = {
      achieved: true,
      achievedDate: new Date(),
      updatedAt: new Date()
    };

    return from(this.getGoalsCollection().findOneAndUpdate(
      { id, user: currentUser.id },
      { $set: updateData },
      { returnDocument: 'after' }
    )).pipe(
      map(result => {
        if (!result) {
          throw new Error('Goal not found');
        }
        return {
          success: true,
          data: result as unknown as Goal
        };
      }),
      catchError(error => {
        console.error('Error marking goal as achieved:', error);
        return throwError(() => new Error(error.message || 'Failed to mark goal as achieved'));
      })
    );
  }

  // Delete a goal
  deleteGoal(id: string): Observable<any> {
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('No user is logged in'));
    }

    return from(this.getGoalsCollection().deleteOne({ id, user: currentUser.id })).pipe(
      map(result => {
        if (result.deletedCount === 0) {
          throw new Error('Goal not found');
        }
        return {
          success: true
        };
      }),
      catchError(error => {
        console.error('Error deleting goal:', error);
        return throwError(() => new Error(error.message || 'Failed to delete goal'));
      })
    );
  }

  private getGoalsCollection() {
    return this.mongoDBService.getCollection(this.DATABASE_NAME, this.GOALS_COLLECTION);
  }
}