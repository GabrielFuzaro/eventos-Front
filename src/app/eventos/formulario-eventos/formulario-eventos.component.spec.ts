import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEventosComponent } from './formulario-eventos.component';

describe('FormularioEventosComponent', () => {
  let component: FormularioEventosComponent;
  let fixture: ComponentFixture<FormularioEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioEventosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
