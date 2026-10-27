import { Farm, AgriculturalActivity, SatelliteObservation } from '../../types';
import { FarmService } from './farmService';
import { ActivityService } from './activityService';
import { SatelliteService } from './satelliteService';
import { WeatherService } from './weatherService';
import { downloadCsv } from '../utils';

export class ExportService {
  static exportFarmsToCsv(): void {
    const farms = FarmService.getAll();
    const headers = [
      'ID',
      'Nome da Exploração',
      'Província',
      'Município',
      'Área (ha)',
      'Culturas',
      'Tipo de Solo',
      'Sistema de Irrigação',
      'Índice de Saúde (%)',
      'Estado',
      'Responsável',
      'Contacto',
    ];

    const rows = farms.map((f) => [
      f.id,
      `"${f.name}"`,
      `"${f.province}"`,
      `"${f.municipality}"`,
      f.areaHectares,
      `"${f.cropTypes.join(', ')}"`,
      `"${f.soilType}"`,
      `"${f.irrigationSystem}"`,
      f.healthScore,
      f.status,
      `"${f.managerName}"`,
      `"${f.contactEmail}"`,
    ]);

    const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    downloadCsv(`agriia_relatorio_exploracoes_${Date.now()}.csv`, csvContent);
  }

  static exportActivitiesToCsv(): void {
    const activities = ActivityService.getAll();
    const headers = [
      'ID',
      'Título da Atividade',
      'Exploração',
      'Parcela',
      'Categoria',
      'Prioridade',
      'Estado',
      'Data Limite',
      'Responsável',
      'Custo Estimado (AOA)',
    ];

    const rows = activities.map((a) => [
      a.id,
      `"${a.title}"`,
      `"${a.farmName}"`,
      `"${a.plotName || 'Geral'}"`,
      a.category,
      a.priority,
      a.status,
      a.dueDate,
      `"${a.assignedTo}"`,
      a.costEstimatedAoa || 0,
    ]);

    const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    downloadCsv(`agriia_relatorio_atividades_${Date.now()}.csv`, csvContent);
  }

  static exportMonitoringToCsv(): void {
    const obs = SatelliteService.getAll();
    const headers = [
      'ID',
      'Exploração',
      'Parcela',
      'Data de Aquisição',
      'Satélite',
      'NDVI Médio',
      'NDVI Mínimo',
      'NDVI Máximo',
      'Índice EVI',
      'Índice Clorofila',
      'Cobertura Nuvens (%)',
      'Estado Vegetativo',
    ];

    const rows = obs.map((o) => [
      o.id,
      `"${o.farmName}"`,
      `"${o.plotName}"`,
      o.acquisitionDate,
      o.satelliteName,
      o.ndviAverage.toFixed(2),
      o.ndviMin.toFixed(2),
      o.ndviMax.toFixed(2),
      o.eviAverage.toFixed(2),
      o.chlorophyllIndex.toFixed(1),
      o.cloudCoveragePercent,
      o.vegetationHealthStatus,
    ]);

    const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    downloadCsv(`agriia_relatorio_monitorizacao_ndvi_${Date.now()}.csv`, csvContent);
  }

  static exportWeatherToCsv(farmId?: string): void {
    const weatherDataMap = WeatherService.getAll();
    const list = farmId ? [weatherDataMap[farmId] || weatherDataMap['farm-1']] : Object.values(weatherDataMap);

    const headers = [
      'Exploração',
      'Data Previsão',
      'Dia',
      'Temp Máx (°C)',
      'Temp Mín (°C)',
      'Precipitação (mm)',
      'Probabilidade Chuva (%)',
      'Humidade Relativa (%)',
      'Condição',
      'Aptidão Agrícola (0-100)',
    ];

    const rows: string[] = [];
    list.forEach((wd) => {
      wd.forecast.forEach((day) => {
        rows.push(
          [
            `"${wd.farmName}"`,
            day.date,
            day.dayOfWeek,
            day.tempMax,
            day.tempMin,
            day.precipitationMm,
            day.precipitationChance,
            day.humidity,
            `"${day.condition}"`,
            day.suitabilityScore,
          ].join(';')
        );
      });
    });

    const csvContent = [headers.join(';'), ...rows].join('\n');
    downloadCsv(`agriia_relatorio_climatico_${Date.now()}.csv`, csvContent);
  }
}
