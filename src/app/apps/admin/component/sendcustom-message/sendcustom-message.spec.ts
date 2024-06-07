import { ComponentFixture, TestBed } from '@angular/core/testing';

import { sendcustomMessage } from './sendcustom-Message';

describe('ProductComponent', () => {
  let component:sendcustomMessage;
  let fixture: ComponentFixture<sendcustomMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ sendcustomMessage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(sendcustomMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
