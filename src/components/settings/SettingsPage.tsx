import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../ui/DemoBadge';
import {
  Settings,
  User,
  Sliders,
  Globe,
  Ruler,
  Bell,
  Palette,
  Save,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export function SettingsPage() {
  const { userProfile, updateUserProfile, showToast } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [role, setRole] = useState(userProfile.role);
  const [company, setCompany] = useState(userProfile.company);
  const [phone, setPhone] = useState(userProfile.phone);

  const [language, setLanguage] = useState(userProfile.language);
  const [areaUnit, setAreaUnit] = useState(userProfile.areaUnit);
  const [tempUnit, setTempUnit] = useState(userProfile.tempUnit);
  const [currency, setCurrency] = useState(userProfile.currency);

  const [notifEmail, setNotifEmail] = useState(userProfile.notificationsEmail);
  const [notifPush, setNotifPush] = useState(userProfile.notificationsPush);
  const [notifSms, setNotifSms] = useState(userProfile.notificationsSms);

  const [theme, setTheme] = useState(userProfile.theme);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      role,
      company,
      phone,
      language,
      areaUnit,
      tempUnit,
      currency,
      notificationsEmail: notifEmail,
      notificationsPush: notifPush,
      notificationsSms: notifSms,
      theme,
    });
    showToast('Definições guardadas', 'As suas preferências foram armazenadas localmente.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#65A30D]" />
            Definições & Preferências da Conta
          </h2>
          <p className="text-xs text-gray-500">
            Configuração de perfil, unidades de medida agrárias e notificações
          </p>
        </div>
        <DemoBadge />
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <User className="w-4 h-4 text-[#65A30D]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Perfil do Utilizador
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-lime-600/30"
            />
            <div>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                {name} <ShieldCheck className="w-4 h-4 text-[#65A30D]" />
              </p>
              <p className="text-xs text-gray-500">{role}</p>
              <span className="inline-block mt-1 text-[10px] font-semibold text-lime-900 bg-lime-100 px-2 py-0.5 rounded">
                Ambiente Demonstrativo Local
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Endereço de E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Cargo / Função Agronómica</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Empresa / Cooperativa</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
              />
            </div>
          </div>
        </div>

        {/* Units & Localization */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Ruler className="w-4 h-4 text-[#65A30D]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Idioma & Unidades de Medida
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Idioma da Plataforma</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
              >
                <option value="pt">Português (Angola)</option>
                <option value="en">English (US)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Unidade de Área</label>
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
              >
                <option value="ha">Hectares (ha)</option>
                <option value="m2">Metros Quadrados (m²)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Unidade de Temperatura</label>
              <select
                value={tempUnit}
                onChange={(e) => setTempUnit(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
              >
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Moeda Operacional</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
              >
                <option value="AOA">Kwanza Angolano (AOA / Kz)</option>
                <option value="USD">Dólar Americano (USD / $)</option>
                <option value="EUR">Euro (EUR / €)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Appearance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Bell className="w-4 h-4 text-[#65A30D]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Canais de Notificação
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                <div>
                  <span className="font-bold text-gray-900 block">Alertas por E-mail</span>
                  <span className="text-gray-500 text-[11px]">Relatórios semanais e avisos críticos</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                  className="rounded text-[#65A30D] focus:ring-[#65A30D]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                <div>
                  <span className="font-bold text-gray-900 block">Notificações Push no Navegador</span>
                  <span className="text-gray-500 text-[11px]">Atualizações de NDVI e satélite</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPush}
                  onChange={(e) => setNotifPush(e.target.checked)}
                  className="rounded text-[#65A30D] focus:ring-[#65A30D]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                <div>
                  <span className="font-bold text-gray-900 block">Alertas Meteorológicos Críticos (SMS)</span>
                  <span className="text-gray-500 text-[11px]">Tempestades e geadas iminentes</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifSms}
                  onChange={(e) => setNotifSms(e.target.checked)}
                  className="rounded text-[#65A30D] focus:ring-[#65A30D]"
                />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Palette className="w-4 h-4 text-[#65A30D]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Aparência da Interface
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  theme === 'light'
                    ? 'border-[#65A30D] bg-lime-50/70 font-bold text-[#365314]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span>Tema Claro Agro (Recomendado para visualização em campo)</span>
                {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />}
              </div>

              <div
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  theme === 'dark'
                    ? 'border-[#65A30D] bg-lime-50/70 font-bold text-[#365314]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span>Tema Escuro Noturno</span>
                {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#65A30D] hover:bg-[#558b0a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Todas as Alterações</span>
          </button>
        </div>
      </form>
    </div>
  );
}
