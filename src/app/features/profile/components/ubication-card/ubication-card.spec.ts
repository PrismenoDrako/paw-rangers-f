import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicationCard } from './ubication-card';

describe('UbicationCard', () => {
  let component: UbicationCard;
  let fixture: ComponentFixture<UbicationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbicationCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbicationCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
