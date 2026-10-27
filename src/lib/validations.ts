import { z } from 'zod';

export const PROVINCES = [
  'Huambo',
  'Huíla',
  'Malanje',
  'Benguela',
  'Uíge',
  'Bié',
  'Cuanza Sul',
] as const;

export const CATEGORIES = [
  'Plantação',
  'Irrigação',
  'Fertilização',
  'Tratamento',
  'Colheita',
  'Outro',
] as const;

export const PRIORITIES = ['Baixa', 'Média', 'Alta', 'Urgente'] as const;

export const farmFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  province: z.enum(['Huambo', 'Huíla', 'Malanje', 'Benguela', 'Uíge', 'Bié', 'Cuanza Sul']),
  municipality: z.string().min(2, 'O município é obrigatório'),
  location: z.string().min(5, 'Indique a localização detalhada'),
  areaHectares: z.number().positive('A área deve ser um número positivo em hectares'),
  cropTypes: z.string().min(2, 'Indique pelo menos um tipo de cultura (separadas por vírgula)'),
  soilType: z.string().min(3, 'Indique a classificação ou tipo de solo predominante'),
  irrigationSystem: z.string().min(3, 'Especifique o sistema de irrigação ou indique Sequeiro'),
  lat: z.number().min(-18.5, 'Latitude fora dos limites de Angola').max(-4.4, 'Latitude fora dos limites de Angola'),
  lng: z.number().min(11.5, 'Longitude fora dos limites de Angola').max(24.1, 'Longitude fora dos limites de Angola'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  managerName: z.string().min(3, 'Nome do responsável é obrigatório'),
  contactEmail: z.string().email('Email de contacto inválido'),
  contactPhone: z.string().min(9, 'Número de telefone deve ter pelo menos 9 dígitos'),
});

export type FarmFormData = z.infer<typeof farmFormSchema>;

export const activityFormSchema = z.object({
  title: z.string().min(3, 'O título da atividade é obrigatório'),
  farmId: z.string().min(1, 'Selecione a exploração agrícola'),
  plotId: z.string().optional(),
  category: z.enum(['Plantação', 'Irrigação', 'Fertilização', 'Tratamento', 'Colheita', 'Outro']),
  priority: z.enum(['Baixa', 'Média', 'Alta', 'Urgente']),
  dueDate: z.string().min(1, 'A data prevista é obrigatória'),
  description: z.string().min(5, 'Indique detalhes técnicos da atividade'),
  assignedTo: z.string().min(2, 'Indique o técnico ou equipa responsável'),
  costEstimatedAoa: z.number().optional(),
});

export type ActivityFormData = z.infer<typeof activityFormSchema>;

export const loginSchema = z.object({
  email: z.string().email('Introduza um endereço de e-mail válido'),
  password: z.string().min(6, 'A palavra-passe deve ter pelo menos 6 caracteres'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(3, 'O nome completo deve ter pelo menos 3 caracteres'),
    email: z.string().email('Introduza um endereço de e-mail válido'),
    company: z.string().min(2, 'O nome da empresa ou cooperativa é obrigatório'),
    password: z.string().min(6, 'A palavra-passe deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme a sua palavra-passe'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As palavras-passe não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Introduza um endereço de e-mail válido'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
