import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDetail } from './flight-detail';

describe('FlightDetail', () => {
  let component: FlightDetail;
  let fixture: ComponentFixture<FlightDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
