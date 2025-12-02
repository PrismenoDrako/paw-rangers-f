import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoundPetCard } from './found-pet-card';

describe('FoundPetCard', () => {
  let component: FoundPetCard;
  let fixture: ComponentFixture<FoundPetCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoundPetCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoundPetCard);
    component = fixture.componentInstance;
    
    // Mock required input
    component.foundPet = {
      id: 1,
      type: 'Perro',
      description: 'Test description',
      location: 'Test location',
      foundDate: new Date(),
      image: 'test.jpg',
      hasCollar: true,
      contactInfo: {
        name: 'Test User',
        phone: '123456789'
      }
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onContactClick when onContact is called', () => {
    spyOn(component.onContactClick, 'emit');
    
    component.onContact();
    
    expect(component.onContactClick.emit).toHaveBeenCalledWith(component.foundPet);
  });

  it('should toggle favorite status', () => {
    spyOn(component.onFavoriteToggle, 'emit');
    component.isFavorite = false;
    
    component.toggleFavorite();
    
    expect(component.isFavorite).toBe(true);
    expect(component.onFavoriteToggle.emit).toHaveBeenCalledWith({
      pet: component.foundPet,
      isFavorite: true
    });
  });
});