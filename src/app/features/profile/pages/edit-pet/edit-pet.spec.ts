import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPet } from './edit-pet';

describe('EditPet', () => {
  let component: EditPet;
  let fixture: ComponentFixture<EditPet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
