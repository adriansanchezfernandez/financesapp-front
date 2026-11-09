import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Movements } from './movements';
import { provideRouter } from '@angular/router';

describe('Movements', () => {
  let component: Movements;
  let fixture: ComponentFixture<Movements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Movements],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Movements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
