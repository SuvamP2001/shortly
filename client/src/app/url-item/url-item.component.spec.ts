import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlItemComponent } from './url-item.component';

describe('UrlItemComponent', () => {
  let component: UrlItemComponent;
  let fixture: ComponentFixture<UrlItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UrlItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
