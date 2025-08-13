import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyManageComponent } from './property-manage.component';

describe('PropertyManageComponent', () => {
  let component: PropertyManageComponent;
  let fixture: ComponentFixture<PropertyManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
