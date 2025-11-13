import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportFoundPet } from './report-found-pet';

describe('ReportFoundPet', () => {
  let component: ReportFoundPet;
  let fixture: ComponentFixture<ReportFoundPet>;
  let locationSpy: jasmine.SpyObj<Location>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const locationSpyObj = jasmine.createSpyObj('Location', ['back']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReportFoundPet, FormsModule],
      providers: [
        { provide: Location, useValue: locationSpyObj },
        { provide: Router, useValue: routerSpyObj }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportFoundPet);
    component = fixture.componentInstance;
    locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form correctly', () => {
    expect(component.isFormValid()).toBe(false);
    
    component.formData = {
      animalType: 'Perro',
      breed: 'Labrador',
      photo: null,
      hasCollar: true,
      location: 'Test location',
      description: 'Test description',
      contactPhone: '123456789'
    };
    
    expect(component.isFormValid()).toBe(true);
  });

  it('should go back when goBack is called', () => {
    component.goBack();
    
    expect(locationSpy.back).toHaveBeenCalled();
  });
});