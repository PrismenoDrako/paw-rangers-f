import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetSelector } from './pet-selector';

describe('PetSelector', () => {
  let component: PetSelector;
  let fixture: ComponentFixture<PetSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onPetSelected when selectPet is called', () => {
    spyOn(component.onPetSelected, 'emit');
    const mockPet = { id: 1, name: 'Test Pet' };
    
    component.selectPet(mockPet);
    
    expect(component.onPetSelected.emit).toHaveBeenCalledWith(mockPet);
    expect(component.selectedPetId).toBe(1);
  });

  it('should emit onReportOtherPet when onReportOther is called', () => {
    spyOn(component.onReportOtherPet, 'emit');
    
    component.onReportOther();
    
    expect(component.onReportOtherPet.emit).toHaveBeenCalled();
  });
});