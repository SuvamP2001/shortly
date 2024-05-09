import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostSectionComponent } from './boost-section.component';

describe('BoostSectionComponent', () => {
  let component: BoostSectionComponent;
  let fixture: ComponentFixture<BoostSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoostSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoostSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
