import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilhasComponent } from './pilhas.component';

describe('PilhasComponent', () => {
  let component: PilhasComponent;
  let fixture: ComponentFixture<PilhasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PilhasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PilhasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
