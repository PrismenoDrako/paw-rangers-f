import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyUbications } from './my-ubications';

describe('MyUbications', () => {
  let component: MyUbications;
  let fixture: ComponentFixture<MyUbications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyUbications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyUbications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
