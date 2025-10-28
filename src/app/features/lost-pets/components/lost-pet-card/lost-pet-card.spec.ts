import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LostPetCard } from './lost-pet-card';

describe('LostPetCard', () => {
  let component: LostPetCard;
  let fixture: ComponentFixture<LostPetCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LostPetCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LostPetCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
