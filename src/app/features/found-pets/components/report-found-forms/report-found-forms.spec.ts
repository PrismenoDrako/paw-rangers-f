import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFoundForms } from './report-found-forms';

describe('ReportFoundForms', () => {
  let component: ReportFoundForms;
  let fixture: ComponentFixture<ReportFoundForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFoundForms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportFoundForms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
