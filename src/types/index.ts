export type ProvinceName = 'Huambo' | 'Huíla' | 'Malanje' | 'Benguela' | 'Uíge' | 'Bié' | 'Cuanza Sul';

export type FarmStatus = 'Ativa' | 'Atenção' | 'Em Repouso';

export interface Plot {
  id: string;
  farmId: string;
  farmName: string;
  name: string;
  areaHectares: number;
  crop: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  status: 'Excelente' | 'Bom' | 'Alerta' | 'Crítico';
  ndviScore: number;
  soilMoisture: number; // percentage e.g. 45
  soilTemp: number; // Celsius
  soilType: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  boundary?: [number, number][]; // Polygon coordinates
}

export interface Farm {
  id: string;
  name: string;
  province: ProvinceName;
  municipality: string;
  location: string;
  areaHectares: number;
  cropTypes: string[];
  soilType: string;
  irrigationSystem: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  createdAt: string;
  plotsCount: number;
  healthScore: number; // 0 - 100
  status: FarmStatus;
  managerName: string;
  contactEmail: string;
  contactPhone: string;
  plots: Plot[];
}

export interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  humidity: number;
  precipitationChance: number;
  precipitationMm: number;
  windSpeed: number; // km/h
  windDirection: string;
  uvIndex: number;
  condition: string;
  conditionCode: 'sunny' | 'cloudy' | 'rainy' | 'storm' | 'partly-cloudy';
  pressureHpa: number;
  evapotranspirationMm: number;
}

export interface WeatherForecastDay {
  date: string;
  dayOfWeek: string;
  tempMax: number;
  tempMin: number;
  precipitationMm: number;
  precipitationChance: number;
  humidity: number;
  condition: string;
  conditionCode: 'sunny' | 'cloudy' | 'rainy' | 'storm' | 'partly-cloudy';
  suitabilityScore: number; // 0-100 agricultural suitability
}

export interface WeatherData {
  farmId: string;
  farmName: string;
  current: WeatherCurrent;
  forecast: WeatherForecastDay[];
  history: {
    month: string;
    avgTemp: number;
    precipitationMm: number;
    historicalAverageMm: number;
  }[];
  hourly: {
    time: string;
    temp: number;
    precipitationMm: number;
    humidity: number;
  }[];
  recommendations: string[];
}

export interface SatelliteObservation {
  id: string;
  farmId: string;
  farmName: string;
  plotId: string;
  plotName: string;
  acquisitionDate: string;
  satelliteName: 'Sentinel-2' | 'Landsat 9';
  ndviAverage: number; // 0.0 - 1.0
  ndviMin: number;
  ndviMax: number;
  cloudCoveragePercent: number;
  vegetationHealthStatus: 'Excelente' | 'Bom' | 'Moderado' | 'Stress Hídrico' | 'Crítico';
  resolutionMeters: number;
  eviAverage: number;
  chlorophyllIndex: number;
  previewColor: string;
}

export type ActivityCategory =
  | 'Plantação'
  | 'Irrigação'
  | 'Fertilização'
  | 'Tratamento'
  | 'Colheita'
  | 'Outro';

export type ActivityStatus = 'Pendente' | 'Em Progresso' | 'Concluída' | 'Atrasada';
export type ActivityPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';

export interface AgriculturalActivity {
  id: string;
  farmId: string;
  farmName: string;
  plotId?: string;
  plotName?: string;
  title: string;
  category: ActivityCategory;
  status: ActivityStatus;
  priority: ActivityPriority;
  dueDate: string;
  description: string;
  assignedTo: string;
  completedAt?: string;
  costEstimatedAoa?: number;
}

export type AlertSeverity = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type AlertCategory = 'Praga' | 'Clima' | 'Irrigação' | 'Nutrição' | 'Solo';

export interface AgriculturalAlert {
  id: string;
  farmId: string;
  farmName: string;
  plotId?: string;
  plotName?: string;
  title: string;
  severity: AlertSeverity;
  category: AlertCategory;
  date: string;
  message: string;
  status: 'Ativo' | 'Resolvido';
  recommendedAction: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Alerta Agrícola' | 'Condição Climática' | 'Atividade Pendente' | 'Observação Satélite';
  timestamp: string;
  read: boolean;
  link?: string;
  severity: 'info' | 'warning' | 'alert' | 'success';
}

export interface ReportConfig {
  id: string;
  title: string;
  type: 'Explorações' | 'Clima' | 'Monitorização' | 'Atividades';
  dateRange: '7d' | '30d' | '90d' | 'safra';
  farmId: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
  company: string;
  avatarUrl?: string;
  language: 'pt' | 'en';
  areaUnit: 'ha' | 'm2';
  tempUnit: 'celsius' | 'fahrenheit';
  currency: 'AOA' | 'USD' | 'EUR';
  notificationsEmail: boolean;
  notificationsPush: boolean;
  notificationsSms: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedQuestions?: string[];
  referenceData?: {
    type: 'crop' | 'weather' | 'plot';
    label: string;
  };
}
