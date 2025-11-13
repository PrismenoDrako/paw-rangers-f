import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DescriptionForm } from './description-form';

describe('DescriptionForm', () => {
  let component: DescriptionForm;
  let fixture: ComponentFixture<DescriptionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionForm, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form data', () => {
    expect(component.formData.description).toBe('');
    expect(component.formData.contactName).toBe('');
    expect(component.formData.contactPhone).toBe('');
    expect(component.formData.contactEmail).toBe('');
    expect(component.formData.hasReward).toBe(false);
  });

  it('should emit onFormDataChange when onFormChange is called', () => {
    spyOn(component.onFormDataChange, 'emit');
    
    component.onFormChange();
    
    expect(component.onFormDataChange.emit).toHaveBeenCalledWith(component.formData);
  });
});