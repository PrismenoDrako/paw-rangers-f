import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LostPetReportD } from './lost-pet-report-d';

describe('LostPetReportD', () => {
  let component: LostPetReportD;
  let fixture: ComponentFixture<LostPetReportD>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LostPetReportD]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LostPetReportD);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
