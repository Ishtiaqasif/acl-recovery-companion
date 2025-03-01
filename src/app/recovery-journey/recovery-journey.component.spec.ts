import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryJourneyComponent } from './recovery-journey.component';

describe('RecoveryJourneyComponent', () => {
  let component: RecoveryJourneyComponent;
  let fixture: ComponentFixture<RecoveryJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryJourneyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
