import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCustomMessageComponent } from './send-custom-message.component';

describe('SendCustomMessageComponent', () => {
  let component: SendCustomMessageComponent;
  let fixture: ComponentFixture<SendCustomMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendCustomMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCustomMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
