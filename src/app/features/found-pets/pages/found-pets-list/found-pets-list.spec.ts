import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FoundPetsList } from './found-pets-list';

describe('FoundPetsList', () => {
  let component: FoundPetsList;
  let fixture: ComponentFixture<FoundPetsList>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FoundPetsList],
      providers: [
        { provide: Router, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoundPetsList);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to report page when goToReport is called', () => {
    component.goToReport();
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/found-pets/report']);
  });

  it('should open contact modal when handleContact is called', () => {
    const mockPet = {
      id: 1,
      type: 'Perro',
      description: 'Test',
      location: 'Test location',
      foundDate: new Date(),
      image: 'test.jpg',
      hasCollar: true,
      contactInfo: { name: 'Test', phone: '123' }
    };
    
    component.handleContact(mockPet);
    
    expect(component.selectedPet).toBe(mockPet);
    expect(component.showContactModal).toBe(true);
  });
});