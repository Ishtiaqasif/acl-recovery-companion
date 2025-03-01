import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, PostResponse, PostListResponse, PostFilters } from '../models/post.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  // Create a new post
  createPost(postData: Post): Observable<PostResponse> {
    return this.http.post<PostResponse>(this.apiUrl, postData);
  }

  // Get all posts with optional filters
  getPosts(filters: PostFilters = {}): Observable<PostListResponse> {
    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.category) params = params.set('category', filters.category);
    if (filters.recoveryPhase) params = params.set('recoveryPhase', filters.recoveryPhase);
    if (filters.tag) params = params.set('tag', filters.tag);
    if (filters.search) params = params.set('search', filters.search);
    
    return this.http.get<PostListResponse>(this.apiUrl, { params });
  }

  // Get a single post by ID
  getPost(id: string): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.apiUrl}/${id}`);
  }

  // Update a post
  updatePost(id: string, postData: Post): Observable<PostResponse> {
    return this.http.put<PostResponse>(`${this.apiUrl}/${id}`, postData);
  }

  // Delete a post
  deletePost(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Add a comment to a post
  addComment(postId: string, content: string): Observable<PostResponse> {
    return this.http.post<PostResponse>(`${this.apiUrl}/${postId}/comments`, { content });
  }

  // Delete a comment
  deleteComment(postId: string, commentId: string): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${this.apiUrl}/${postId}/comments/${commentId}`);
  }

  // Like or unlike a post
  toggleLike(postId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${postId}/like`, {});
  }
}