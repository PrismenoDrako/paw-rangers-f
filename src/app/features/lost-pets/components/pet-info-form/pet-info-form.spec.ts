import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PetInfoForm } from './pet-info-form';

describe('PetInfoForm', () => {
  let component: PetInfoForm;
  let fixture: ComponentFixture<PetInfoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetInfoForm, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetInfoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize petInfo with selectedPet data when provided', () => {
    const mockPet = { 
      name: 'Rocky', 
      type: 'Perro', 
      breed: 'Bulldog' 
    };
    component.selectedPet = mockPet;
    
    component.ngOnInit();
    
    expect(component.petInfo.name).toBe('Rocky');
    expect(component.petInfo.type).toBe('Perro');
    expect(component.petInfo.breed).toBe('Bulldog');
  });

  it('should emit onInfoChange when onFormChange is called', () => {
    spyOn(component.onInfoChange, 'emit');
    
    component.onFormChange();
    
    expect(component.onInfoChange.emit).toHaveBeenCalledWith(component.petInfo);
  });
});