import { WeatherData, SatelliteObservation } from '../../types';
import { INITIAL_WEATHER, INITIAL_SATELLITE_OBSERVATIONS } from '../../data/mock-data';

export class WeatherService {
  static getByFarmId(farmId: string): WeatherData {
    return INITIAL_WEATHER[farmId] || INITIAL_WEATHER['farm-1'];
  }

  static getAll(): Record<string, WeatherData> {
    return INITIAL_WEATHER;
  }
}

export class SatelliteService {
  static getAll(): SatelliteObservation[] {
    return INITIAL_SATELLITE_OBSERVATIONS;
  }

  static getByFarmId(farmId: string): SatelliteObservation[] {
    return INITIAL_SATELLITE_OBSERVATIONS.filter((o) => o.farmId === farmId);
  }

  static getByPlotId(plotId: string): SatelliteObservation[] {
    return INITIAL_SATELLITE_OBSERVATIONS.filter((o) => o.plotId === plotId);
  }
}
