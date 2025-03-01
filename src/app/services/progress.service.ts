import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgressEntry, ProgressResponse, ProgressListResponse } from '../models/progress.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = `${environment.apiUrl}/progress`;

  constructor(private http: HttpClient) {}

  // Create a new progress entry
  createProgressEntry(entryData: ProgressEntry): Observable<ProgressResponse> {
    return this.http.post<ProgressResponse>(this.apiUrl, entryData);
  }

  // Get all progress entries for the current user
  getProgressEntries(): Observable<ProgressListResponse> {
    return this.http.get<ProgressListResponse>(this.apiUrl);
  }

  // Get a single progress entry by ID
  getProgressEntry(id: string): Observable<ProgressResponse> {
    return this.http.get<ProgressResponse>(`${this.apiUrl}/${id}`);
  }

  // Update a progress entry
  updateProgressEntry(id: string, entryData: ProgressEntry): Observable<ProgressResponse> {
    return this.http.put<ProgressResponse>(`${this.apiUrl}/${id}`, entryData);
  }

  // Delete a progress entry
  deleteProgressEntry(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}