import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationHeader } from './notification-header';

describe('NotificationHeader', () => {
  let component: NotificationHeader;
  let fixture: ComponentFixture<NotificationHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
