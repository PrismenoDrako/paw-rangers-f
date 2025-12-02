import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUbication } from './edit-ubication';

describe('EditUbication', () => {
  let component: EditUbication;
  let fixture: ComponentFixture<EditUbication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUbication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUbication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
