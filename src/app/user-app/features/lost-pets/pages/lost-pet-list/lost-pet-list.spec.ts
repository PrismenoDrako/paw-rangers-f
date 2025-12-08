import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LostPetList } from './lost-pet-list';

describe('LostPetList', () => {
  let component: LostPetList;
  let fixture: ComponentFixture<LostPetList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LostPetList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LostPetList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
