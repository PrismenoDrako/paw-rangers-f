import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUbicationCard } from './add-ubication-card';

describe('AddUbicationCard', () => {
  let component: AddUbicationCard;
  let fixture: ComponentFixture<AddUbicationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUbicationCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUbicationCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
