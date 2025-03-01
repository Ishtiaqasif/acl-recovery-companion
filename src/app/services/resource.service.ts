import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Resource, ResourceResponse, ResourceListResponse, ResourceFilters } from '../models/resource.model';
import { MongoDBService } from './mongodb.service';
import { AuthService } from './auth.service';
import { v4 as uuidv4 } from 'uuid';

interface MongoResult {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private DATABASE_NAME = 'acl_recovery';
  private RESOURCES_COLLECTION = 'resources';

  constructor(
    private mongoDBService: MongoDBService,
    private authService: AuthService
  ) {}

  // Create a new resource
  createResource(resourceData: Resource): Observable<ResourceResponse> {
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('No user is logged in'));
    }

    const newResource: Resource = {
      ...resourceData,
      id: uuidv4(),
      approved: currentUser.role === 'admin', // Auto-approve if admin
      viewCount: 0,
      submittedBy: {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return from(this.getCollection().insertOne(newResource)).pipe(
      map(() => ({
        success: true,
        data: newResource
      })),
      catchError(error => {
        console.error('Error creating resource:', error);
        return throwError(() => new Error(error.message || 'Failed to create resource'));
      })
    );
  }

  // Get all resources with optional filters
  getResources(filters: ResourceFilters = {}): Observable<ResourceListResponse> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
    
    // Build query filter
    const query: any = { approved: true }; // Only show approved resources
    
    if (filters.contentType) query.contentType = filters.contentType;
    if (filters.recoveryPhase) query.recoveryPhase = filters.recoveryPhase;
    if (filters.tag) query.tags = { $in: [filters.tag] };
    if (filters.featured) query.featured = filters.featured;
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { content: { $regex: filters.search, $options: 'i' } }
      ];
    }

    return from(this.getCollection().find(query)).pipe(
      map((results: MongoResult[]) => {
        const total = results.length;
        
        // Manual pagination and sorting in memory
        const sorted = [...results].sort((a: MongoResult, b: MongoResult) => 
          new Date(b['createdAt'] || 0).getTime() - new Date(a['createdAt'] || 0).getTime()
        );
        const paginatedResults = sorted.slice(skip, skip + limit);
        
        return {
          success: true,
          count: paginatedResults.length,
          total,
          pagination: {
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          },
          data: paginatedResults as unknown as Resource[]
        };
      }),
      catchError(error => {
        console.error('Error fetching resources:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch resources'));
      })
    );
  }

  // Get a single resource by ID
  getResource(id: string): Observable<ResourceResponse> {
    return from(this.getCollection().findOne({ id })).pipe(
      switchMap(resource => {
        if (!resource) {
          return throwError(() => new Error('Resource not found'));
        }
        
        // Increment view count
        return from(this.getCollection().updateOne(
          { id },
          { $inc: { viewCount: 1 } }
        )).pipe(
          map(() => {
            // Update the viewCount in the returned resource
            const updatedResource = {
              ...resource,
              viewCount: (resource.viewCount || 0) + 1
            };
            
            return {
              success: true,
              data: updatedResource as unknown as Resource
            };
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching resource:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch resource'));
      })
    );
  }

  // Update a resource
  updateResource(id: string, resourceData: Resource): Observable<ResourceResponse> {
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('No user is logged in'));
    }

    const updateData = {
      ...resourceData,
      updatedAt: new Date()
    };
    
    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.submittedBy;
    delete updateData.createdAt;
    delete updateData.viewCount;
    
    // If not admin, resource goes back to pending approval
    if (currentUser.role !== 'admin') {
      updateData.approved = false;
    }

    return from(this.getCollection().findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnNewDocument: true }
    )).pipe(
      map(result => {
        if (!result) {
          throw new Error('Resource not found');
        }
        
        return {
          success: true,
          data: result as unknown as Resource
        };
      }),
      catchError(error => {
        console.error('Error updating resource:', error);
        return throwError(() => new Error(error.message || 'Failed to update resource'));
      })
    );
  }

  // Delete a resource
  deleteResource(id: string): Observable<any> {
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('No user is logged in'));
    }

    // Only allow deletion if admin or the submitter
    const query: any = { id };
    if (currentUser.role !== 'admin') {
      query['submittedBy.id'] = currentUser.id;
    }

    return from(this.getCollection().deleteOne(query)).pipe(
      map(result => {
        if (result.deletedCount === 0) {
          throw new Error('Resource not found or you do not have permission to delete it');
        }
        
        return {
          success: true
        };
      }),
      catchError(error => {
        console.error('Error deleting resource:', error);
        return throwError(() => new Error(error.message || 'Failed to delete resource'));
      })
    );
  }

  // Admin - Get pending resources
  getPendingResources(): Observable<ResourceListResponse> {
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser || currentUser.role !== 'admin') {
      return throwError(() => new Error('Unauthorized access'));
    }

    return from(this.getCollection().find({ approved: false })).pipe(
      map((resources: MongoResult[]) => ({
        success: true,
        count: resources.length,
        total: resources.length,
        pagination: {
          page: 1,
          limit: resources.length,
          totalPages: 1
        },
        data: resources as unknown as Resource[]
      })),
      catchError(error => {
        console.error('Error fetching pending resources:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch pending resources'));
      })
    );
  }

  // Admin - Approve a resource
  approveResource(id: string): Observable<ResourceResponse> {
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser || currentUser.role !== 'admin') {
      return throwError(() => new Error('Unauthorized access'));
    }

    return from(this.getCollection().findOneAndUpdate(
      { id },
      { $set: { approved: true, updatedAt: new Date() } },
      { returnNewDocument: true }
    )).pipe(
      map(result => {
        if (!result) {
          throw new Error('Resource not found');
        }
        
        return {
          success: true,
          data: result as unknown as Resource
        };
      }),
      catchError(error => {
        console.error('Error approving resource:', error);
        return throwError(() => new Error(error.message || 'Failed to approve resource'));
      })
    );
  }
  
  // Get featured resources
  getFeaturedResources(limit: number = 3): Observable<ResourceListResponse> {
    return from(this.getCollection().find({ approved: true, featured: true })).pipe(
      map((resources: MongoResult[]) => {
        // Sort and limit in memory
        const sortedResources = [...resources]
          .sort((a: MongoResult, b: MongoResult) => 
            new Date(b['createdAt'] || 0).getTime() - new Date(a['createdAt'] || 0).getTime()
          )
          .slice(0, limit);
        
        return {
          success: true,
          count: sortedResources.length,
          total: resources.length,
          pagination: {
            page: 1,
            limit,
            totalPages: 1
          },
          data: sortedResources as unknown as Resource[]
        };
      }),
      catchError(error => {
        console.error('Error fetching featured resources:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch featured resources'));
      })
    );
  }

  // Get resources by recovery phase
  getResourcesByPhase(phase: string, limit: number = 5): Observable<ResourceListResponse> {
    return from(this.getCollection().find({ approved: true, recoveryPhase: phase })).pipe(
      map((resources: MongoResult[]) => {
        // Sort and limit in memory
        const sortedResources = [...resources]
          .sort((a: MongoResult, b: MongoResult) => 
            new Date(b['createdAt'] || 0).getTime() - new Date(a['createdAt'] || 0).getTime()
          )
          .slice(0, limit);
        
        return {
          success: true,
          count: sortedResources.length,
          total: resources.length,
          pagination: {
            page: 1,
            limit,
            totalPages: 1
          },
          data: sortedResources as unknown as Resource[]
        };
      }),
      catchError(error => {
        console.error(`Error fetching resources for phase ${phase}:`, error);
        return throwError(() => new Error(error.message || 'Failed to fetch resources by phase'));
      })
    );
  }

  private getCollection() {
    return this.mongoDBService.getCollection(this.DATABASE_NAME, this.RESOURCES_COLLECTION);
  }
}