import { ComponentFixture, TestBed } from '@angular/core/testing';

import { automatTempComponent } from './automat-temp';

describe('ProductComponent', () => {
  let component:automatTempComponent;
  let fixture: ComponentFixture<automatTempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ automatTempComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(automatTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
