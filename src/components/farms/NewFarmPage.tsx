import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { farmFormSchema, FarmFormData } from '../../lib/validations';
import { FarmService } from '../../lib/services/farmService';
import { useApp } from '../../context/AppContext';
import { useRouter } from '../../context/RouterContext';
import { DemoBadge } from '../ui/DemoBadge';
import {
  Sprout,
  MapPin,
  Compass,
  FileText,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export function NewFarmPage() {
  const { refreshData, showToast } = useApp();
  const { navigate } = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FarmFormData>({
    resolver: zodResolver(farmFormSchema),
    defaultValues: {
      name: '',
      province: 'Huambo',
      municipality: '',
      location: '',
      areaHectares: 250,
      cropTypes: 'Milho Híbrido, Soja',
      soilType: 'Franco-Argiloso Vermelho',
      irrigationSystem: 'Aspersão (Pivô Central)',
      lat: -12.776,
      lng: 15.733,
      description: '',
      managerName: 'Eng. Manuel Tchissola',
      contactEmail: 'geral@fazenda.ao',
      contactPhone: '+244 923 000 000',
    },
  });

  const selectedProvince = watch('province');

  // Quick preset helper for coordinates in Angola
  const handleApplyPreset = (province: 'Huambo' | 'Huíla' | 'Malanje' | 'Benguela') => {
    const presets = {
      Huambo: { lat: -12.7761, lng: 15.7332, mun: 'Caála', soil: 'Franco-Argiloso Vermelho' },
      Huíla: { lat: -14.9184, lng: 13.4925, mun: 'Chibia', soil: 'Franco-Arenoso Aluvial' },
      Malanje: { lat: -9.5432, lng: 16.3458, mun: 'Cacuso', soil: 'Argiloso Vermelho Ferralítico' },
      Benguela: { lat: -12.5763, lng: 13.4055, mun: 'Cubal', soil: 'Franco-Argiloso' },
    };

    const p = presets[province];
    if (p) {
      setValue('province', province);
      setValue('lat', p.lat);
      setValue('lng', p.lng);
      setValue('municipality', p.mun);
      setValue('soilType', p.soil);
      showToast('Coordenadas aplicadas', `Localização predefinida de ${province} carregada.`, 'info');
    }
  };

  const onSubmit = async (data: FarmFormData) => {
    try {
      const cropList = data.cropTypes.split(',').map((c) => c.trim()).filter(Boolean);

      const created = FarmService.create({
        name: data.name,
        province: data.province,
        municipality: data.municipality,
        location: data.location,
        areaHectares: Number(data.areaHectares),
        cropTypes: cropList.length > 0 ? cropList : ['Milho'],
        soilType: data.soilType,
        irrigationSystem: data.irrigationSystem,
        coordinates: {
          lat: Number(data.lat),
          lng: Number(data.lng),
        },
        description: data.description,
        status: 'Ativa',
        managerName: data.managerName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
      });

      refreshData();
      showToast('Exploração registada!', `A exploração "${created.name}" foi guardada com sucesso.`, 'success');
      navigate(`/farms/${created.id}`);
    } catch (e) {
      showToast('Erro ao guardar', 'Não foi possível registar a exploração. Verifique os campos.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/farms')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à lista de explorações</span>
        </button>
        <DemoBadge />
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="p-6 bg-gradient-to-r from-lime-900 via-lime-800 to-[#365314] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/20 border border-lime-400/30 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-lime-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Ficha de Cadastro de Exploração Agrícola</h2>
              <p className="text-xs text-lime-200/80">
                Introduza os dados agronómicos e coordenadas para ativação da monitorização por satélite.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Informações Gerais */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#65A30D]" />
              1. Identificação da Propriedade
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Nome da Exploração *</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Ex: Fazenda Agro-Industrial Camacupa"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D] focus:ring-1 focus:ring-[#65A30D]"
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Província */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Província (Angola) *</label>
                <select
                  {...register('province')}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D] focus:ring-1 focus:ring-[#65A30D]"
                >
                  <option value="Huambo">Huambo</option>
                  <option value="Huíla">Huíla</option>
                  <option value="Malanje">Malanje</option>
                  <option value="Benguela">Benguela</option>
                  <option value="Uíge">Uíge</option>
                  <option value="Bié">Bié</option>
                  <option value="Cuanza Sul">Cuanza Sul</option>
                </select>
                {errors.province && (
                  <p className="text-[11px] text-rose-600">{errors.province.message}</p>
                )}
              </div>

              {/* Município */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Município *</label>
                <input
                  type="text"
                  {...register('municipality')}
                  placeholder="Ex: Caála, Chibia, Cacuso"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D] focus:ring-1 focus:ring-[#65A30D]"
                />
                {errors.municipality && (
                  <p className="text-[11px] text-rose-600">{errors.municipality.message}</p>
                )}
              </div>

              {/* Localização Detalhada */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Localização / Ponto de Referência *</label>
                <input
                  type="text"
                  {...register('location')}
                  placeholder="Ex: Estrada Nacional 260, Km 18, Sector Agrícola"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D] focus:ring-1 focus:ring-[#65A30D]"
                />
                {errors.location && (
                  <p className="text-[11px] text-rose-600">{errors.location.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Agronomia & Manejo */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#65A30D]" />
              2. Características Agronómicas & Solo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Área em hectares */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Área Total (Hectares) *</label>
                <input
                  type="number"
                  step="any"
                  {...register('areaHectares', { valueAsNumber: true })}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D] focus:ring-1 focus:ring-[#65A30D]"
                />
                {errors.areaHectares && (
                  <p className="text-[11px] text-rose-600">{errors.areaHectares.message}</p>
                )}
              </div>

              {/* Culturas */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Culturas (separadas por vírgula) *</label>
                <input
                  type="text"
                  {...register('cropTypes')}
                  placeholder="Ex: Milho Híbrido, Soja, Feijão"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D] focus:ring-1 focus:ring-[#65A30D]"
                />
                {errors.cropTypes && (
                  <p className="text-[11px] text-rose-600">{errors.cropTypes.message}</p>
                )}
              </div>

              {/* Tipo de Solo */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Tipo de Solo Predominante *</label>
                <input
                  type="text"
                  {...register('soilType')}
                  placeholder="Ex: Franco-Argiloso, Ferralítico, Aluvial"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D] focus:ring-1 focus:ring-[#65A30D]"
                />
                {errors.soilType && (
                  <p className="text-[11px] text-rose-600">{errors.soilType.message}</p>
                )}
              </div>

              {/* Sistema de Irrigação */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Sistema de Irrigação *</label>
                <input
                  type="text"
                  {...register('irrigationSystem')}
                  placeholder="Ex: Pivô Central, Gota-a-gota, Aspersão, Sequeiro"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D] focus:ring-1 focus:ring-[#65A30D]"
                />
                {errors.irrigationSystem && (
                  <p className="text-[11px] text-rose-600">{errors.irrigationSystem.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Coordenadas Geográficas */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#65A30D]" />
                3. Coordenadas Geoespaciais (WGS84)
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-gray-400">Atalhos rápidos:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('Huambo')}
                  className="px-2 py-0.5 rounded bg-lime-50 text-[#365314] hover:bg-lime-100 transition-colors font-semibold"
                >
                  Huambo
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('Huíla')}
                  className="px-2 py-0.5 rounded bg-lime-50 text-[#365314] hover:bg-lime-100 transition-colors font-semibold"
                >
                  Huíla
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('Malanje')}
                  className="px-2 py-0.5 rounded bg-lime-50 text-[#365314] hover:bg-lime-100 transition-colors font-semibold"
                >
                  Malanje
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Latitude Decimal (Sul negativo) *</label>
                <input
                  type="number"
                  step="any"
                  {...register('lat', { valueAsNumber: true })}
                  placeholder="-12.7761"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D] focus:ring-1 focus:ring-[#65A30D]"
                />
                {errors.lat && <p className="text-[11px] text-rose-600">{errors.lat.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Longitude Decimal (Leste positivo) *</label>
                <input
                  type="number"
                  step="any"
                  {...register('lng', { valueAsNumber: true })}
                  placeholder="15.7332"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D] focus:ring-1 focus:ring-[#65A30D]"
                />
                {errors.lng && <p className="text-[11px] text-rose-600">{errors.lng.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 4: Responsável e Descrição */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#65A30D]" />
              4. Contactos & Descrição Operacional
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Nome do Responsável Técnico *</label>
                <input
                  type="text"
                  {...register('managerName')}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                />
                {errors.managerName && (
                  <p className="text-[11px] text-rose-600">{errors.managerName.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">E-mail Operacional *</label>
                <input
                  type="email"
                  {...register('contactEmail')}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                />
                {errors.contactEmail && (
                  <p className="text-[11px] text-rose-600">{errors.contactEmail.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Telefone de Contacto *</label>
                <input
                  type="text"
                  {...register('contactPhone')}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                />
                {errors.contactPhone && (
                  <p className="text-[11px] text-rose-600">{errors.contactPhone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Descrição e Histórico da Propriedade *</label>
              <textarea
                rows={3}
                {...register('description')}
                placeholder="Descreva o histórico de produção, rotação de culturas, acesso a água e principais objetivos da exploração..."
                className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
              ></textarea>
              {errors.description && (
                <p className="text-[11px] text-rose-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/farms')}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#65A30D] hover:bg-[#558b0a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Exploração</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
