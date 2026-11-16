
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Dashboard } from './dashboard';
import { MovementsService } from '../../../movements/services/movements.service';

vi.mock('chart.js', () => ({
  Chart: class {
    static register = vi.fn();

    data = {
      labels: [],
      datasets: [
        { data: [] },
        { data: [] }
      ]
    };

    update = vi.fn();
    destroy = vi.fn();
  },
  registerables: []
}));

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  const movementsServiceMock = {
    movements: vi.fn(() => []),
    loadMovements: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        {
          provide: MovementsService,
          useValue: movementsServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movements on initialization', () => {
    expect(movementsServiceMock.loadMovements).toHaveBeenCalledOnce();
  });
});
