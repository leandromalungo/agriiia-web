import { Farm, Plot } from '../../types';
import { INITIAL_FARMS } from '../../data/mock-data';

const STORAGE_KEY = 'agriia_farms_v1';

export class FarmService {
  private static loadFarms(): Farm[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    // Initialize default
    this.saveFarms(INITIAL_FARMS);
    return INITIAL_FARMS;
  }

  private static saveFarms(farms: Farm[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(farms));
    } catch (e) {
      console.error('Failed to save farms to localStorage', e);
    }
  }

  static getAll(): Farm[] {
    return this.loadFarms();
  }

  static getById(id: string): Farm | undefined {
    const farms = this.loadFarms();
    return farms.find((f) => f.id === id);
  }

  static create(farmData: Omit<Farm, 'id' | 'createdAt' | 'plots' | 'plotsCount' | 'healthScore'> & { plots?: Plot[] }): Farm {
    const farms = this.loadFarms();
    const newId = `farm-${Date.now()}`;
    const newFarm: Farm = {
      ...farmData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      plotsCount: farmData.plots ? farmData.plots.length : 1,
      healthScore: 85,
      plots: farmData.plots || [
        {
          id: `plot-${newId}-1`,
          farmId: newId,
          farmName: farmData.name,
          name: 'Parcela Principal 1',
          areaHectares: farmData.areaHectares,
          crop: farmData.cropTypes[0] || 'Cultura Geral',
          variety: 'Variedade Selecionada',
          plantingDate: new Date().toISOString().split('T')[0],
          expectedHarvestDate: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
          status: 'Bom',
          ndviScore: 0.75,
          soilMoisture: 45,
          soilTemp: 23,
          soilType: farmData.soilType,
          coordinates: farmData.coordinates,
        },
      ],
    };

    farms.unshift(newFarm);
    this.saveFarms(farms);
    return newFarm;
  }

  static update(id: string, updates: Partial<Farm>): Farm | null {
    const farms = this.loadFarms();
    const index = farms.findIndex((f) => f.id === id);
    if (index === -1) return null;

    farms[index] = { ...farms[index], ...updates };
    this.saveFarms(farms);
    return farms[index];
  }

  static delete(id: string): boolean {
    const farms = this.loadFarms();
    const filtered = farms.filter((f) => f.id !== id);
    if (filtered.length === farms.length) return false;
    this.saveFarms(filtered);
    return true;
  }

  static resetToDefault(): Farm[] {
    this.saveFarms(INITIAL_FARMS);
    return INITIAL_FARMS;
  }
}
