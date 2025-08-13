import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesDetilComponent } from './properties-detil.component';

describe('PropertiesDetilComponent', () => {
  let component: PropertiesDetilComponent;
  let fixture: ComponentFixture<PropertiesDetilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesDetilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertiesDetilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
