import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LocationMap } from './location-map';

describe('LocationMap', () => {
  let component: LocationMap;
  let fixture: ComponentFixture<LocationMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationMap, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onLocationUpdate when onLocationChange is called', () => {
    spyOn(component.onLocationUpdate, 'emit');
    component.locationData.address = 'Test Address';
    
    component.onLocationChange();
    
    expect(component.onLocationUpdate.emit).toHaveBeenCalledWith(component.locationData);
  });

  it('should log message when onMapClick is called', () => {
    spyOn(console, 'log');
    
    component.onMapClick();
    
    expect(console.log).toHaveBeenCalledWith('Mapa clickeado - implementar selector de ubicación');
  });
});