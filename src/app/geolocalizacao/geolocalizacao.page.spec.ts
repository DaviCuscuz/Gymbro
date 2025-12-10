import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeolocalizacaoPage } from './geolocalizacao.page';

describe('GeolocalizacaoPage', () => {
  let component: GeolocalizacaoPage;
  let fixture: ComponentFixture<GeolocalizacaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GeolocalizacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
