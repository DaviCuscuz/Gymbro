import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcelerometroPage } from './acelerometro.page';

describe('AcelerometroPage', () => {
  let component: AcelerometroPage;
  let fixture: ComponentFixture<AcelerometroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AcelerometroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
