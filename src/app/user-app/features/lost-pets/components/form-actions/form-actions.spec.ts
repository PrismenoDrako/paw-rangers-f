import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormActions } from './form-actions';

describe('FormActions', () => {
  let component: FormActions;
  let fixture: ComponentFixture<FormActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onSubmitForm when onSubmit is called and form is valid', () => {
    spyOn(component.onSubmitForm, 'emit');
    component.isFormValid = true;
    
    component.onSubmit();
    
    expect(component.onSubmitForm.emit).toHaveBeenCalled();
  });

  it('should not emit onSubmitForm when onSubmit is called and form is invalid', () => {
    spyOn(component.onSubmitForm, 'emit');
    component.isFormValid = false;
    
    component.onSubmit();
    
    expect(component.onSubmitForm.emit).not.toHaveBeenCalled();
  });

  it('should emit onCancelForm when onCancel is called', () => {
    spyOn(component.onCancelForm, 'emit');
    
    component.onCancel();
    
    expect(component.onCancelForm.emit).toHaveBeenCalled();
  });
});