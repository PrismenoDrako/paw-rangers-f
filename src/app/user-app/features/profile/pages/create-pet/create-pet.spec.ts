import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePet } from './create-pet';

describe('CreatePet', () => {
  let component: CreatePet;
  let fixture: ComponentFixture<CreatePet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
