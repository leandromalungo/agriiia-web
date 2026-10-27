import { SatelliteObservation } from '../../types';
import { INITIAL_SATELLITE_OBSERVATIONS } from '../../data/mock-data';

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
