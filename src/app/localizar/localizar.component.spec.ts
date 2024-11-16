import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizarComponent } from './localizar.component';

describe('LocalizarComponent', () => {
  let component: LocalizarComponent;
  let fixture: ComponentFixture<LocalizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
