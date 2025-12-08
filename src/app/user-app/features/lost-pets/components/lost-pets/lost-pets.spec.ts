import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LostPets } from './lost-pets';

describe('LostPets', () => {
  let component: LostPets;
  let fixture: ComponentFixture<LostPets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LostPets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LostPets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
