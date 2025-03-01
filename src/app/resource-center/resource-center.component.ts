import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ResourceService } from '../services/resource.service';
import { Resource, ResourceFilters, ResourceListResponse } from '../models/resource.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-resource-center',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './resource-center.component.html',
  styleUrl: './resource-center.component.scss'
})
export class ResourceCenterComponent implements OnInit {
  resources: Resource[] = [];
  featuredResources: Resource[] = [];
  phaseResources: { [phase: string]: Resource[] } = {};
  isLoading = true;
  error: string | null = null;
  isAdmin = false;
  
  hasPhaseResources(): boolean {
    return Object.keys(this.phaseResources).length > 0;
  }
  
  filters: ResourceFilters = {
    page: 1,
    limit: 10
  };
  
  contentTypes = [
    { value: 'article', label: 'Articles' },
    { value: 'video', label: 'Videos' },
    { value: 'pdf', label: 'PDFs' },
    { value: 'exercise', label: 'Exercises' },
    { value: 'link', label: 'External Links' }
  ];
  
  recoveryPhases = [
    { value: 'all', label: 'All Phases' },
    { value: 'pre-op', label: 'Pre-Operation' },
    { value: 'early-recovery', label: 'Early Recovery (0-6 weeks)' },
    { value: 'strength-building', label: 'Strength Building (7-12 weeks)' },
    { value: 'advanced-training', label: 'Advanced Training (3-6 months)' },
    { value: 'return-to-sport', label: 'Return to Sport (6+ months)' }
  ];
  
  searchQuery = '';
  totalResources = 0;
  totalPages = 1;

  constructor(
    private resourceService: ResourceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.isAdmin = user?.role === 'admin';
    });
    
    this.loadFeaturedResources();
    this.loadPhaseResources();
    this.loadResources();
  }

  loadFeaturedResources(): void {
    this.resourceService.getFeaturedResources().subscribe({
      next: (response: ResourceListResponse) => {
        this.featuredResources = response.data;
      },
      error: (error: Error) => {
        console.error('Error loading featured resources', error);
      }
    });
  }

  loadPhaseResources(): void {
    // Get resources for each recovery phase except 'all'
    this.recoveryPhases.filter(phase => phase.value !== 'all').forEach(phase => {
      this.resourceService.getResourcesByPhase(phase.value, 3).subscribe({
        next: (response: ResourceListResponse) => {
          this.phaseResources[phase.value] = response.data;
        },
        error: (error: Error) => {
          console.error(`Error loading ${phase.label} resources`, error);
        }
      });
    });
  }

  loadResources(): void {
    this.isLoading = true;
    this.resourceService.getResources(this.filters).subscribe({
      next: (response: ResourceListResponse) => {
        this.resources = response.data;
        this.totalResources = response.total;
        this.totalPages = response.pagination.totalPages;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.error = error.message || 'Failed to load resources';
        this.isLoading = false;
        console.error('Error loading resources', error);
      }
    });
  }

  applyFilters(): void {
    this.filters.page = 1; // Reset to first page when filters change
    if (this.searchQuery.trim()) {
      this.filters.search = this.searchQuery.trim();
    } else {
      delete this.filters.search;
    }
    this.loadResources();
  }

  clearFilters(): void {
    this.filters = {
      page: 1,
      limit: 10
    };
    this.searchQuery = '';
    this.loadResources();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.filters.page) {
      return;
    }
    this.filters.page = page;
    this.loadResources();
  }

  getContentTypeLabel(contentType: string): string {
    const type = this.contentTypes.find(t => t.value === contentType);
    return type ? type.label : contentType;
  }

  getPhaseLabel(phase: string): string {
    const phaseObj = this.recoveryPhases.find(p => p.value === phase);
    return phaseObj ? phaseObj.label : phase;
  }
}
