import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleButtom } from './title-buttom';

describe('TitleButtom', () => {
  let component: TitleButtom;
  let fixture: ComponentFixture<TitleButtom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleButtom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleButtom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
