import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationFooter } from './notification-footer';

describe('NotificationFooter', () => {
  let component: NotificationFooter;
  let fixture: ComponentFixture<NotificationFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
