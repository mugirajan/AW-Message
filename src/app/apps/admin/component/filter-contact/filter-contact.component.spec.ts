import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterContactComponent } from './filter-contact.component';

describe('FilterContactComponent', () => {
  let component: FilterContactComponent;
  let fixture: ComponentFixture<FilterContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
