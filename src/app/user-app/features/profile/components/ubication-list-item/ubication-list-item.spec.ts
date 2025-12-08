import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicationListItemComponent } from './ubication-list-item';

describe('UbicationListItem', () => {
  let component: UbicationListItemComponent;
  let fixture: ComponentFixture<UbicationListItemComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbicationListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbicationListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
