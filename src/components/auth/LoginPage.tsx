import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../lib/validations';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../ui/DemoBadge';
import {
  Sprout,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export function LoginPage() {
  const { navigate } = useRouter();
  const { setIsAuthenticated, showToast } = useApp();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'd.afonso@agriia.ao',
      password: 'password123',
      rememberMe: true,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setSubmitting(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      showToast('Sessão iniciada', `Bem-vindo de volta, ${data.email.split('@')[0]}!`, 'success');
      navigate('/dashboard');
    }, 500);
  };

  const handleDemoAccess = () => {
    setIsAuthenticated(true);
    showToast('Acesso Demo Ativado', 'Entrando na plataforma com dados simulados de Angola.', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAF5]">
      {/* Left Brand Visual Side */}
      <div className="lg:w-1/2 p-8 lg:p-16 bg-gradient-to-br from-lime-900 via-lime-800 to-[#365314] text-white flex flex-col justify-between relative overflow-hidden">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Sprout className="w-7 h-7 text-lime-300" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                Agri<span className="text-lime-400">ia</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase block text-lime-200">
                Agricultura de Precisão
              </span>
            </div>
          </div>

          <div className="pt-8 max-w-lg space-y-4">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Tomadas de decisão agrícolas orientadas por dados em tempo real.
            </h1>
            <p className="text-sm text-lime-200/90 leading-relaxed">
              Integração de índices multiespectrais Sentinel-2, estações meteorológicas locais e
              recomendações inteligentes para o Planalto Central e Norte de Angola.
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="pt-8 space-y-3 relative z-10 border-t border-white/15">
          <div className="flex items-center gap-2.5 text-xs text-lime-100">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <span>Mapas de vigor vegetativo (NDVI e EVI) calibrados</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-lime-100">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <span>Sensores de humidade de solo em 3 níveis de profundidade</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-lime-100">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <span>Modelos preditivos de balanço hídrico para Huambo, Huíla e Malanje</span>
          </div>
        </div>

        <div className="mt-8 text-[11px] text-lime-300/80">
          © 2026 Agriia Technologies • Versão Demonstrativa Frontend
        </div>
      </div>

      {/* Right Form Side */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Iniciar Sessão</h2>
              <DemoBadge compact />
            </div>
            <p className="text-xs text-gray-500">
              Introduza as suas credenciais ou use o botão de acesso demonstrativo rápido.
            </p>
          </div>

          {/* Quick Demo Access Button */}
          <button
            onClick={handleDemoAccess}
            type="button"
            className="w-full p-3 bg-gradient-to-r from-lime-50 to-emerald-50 border border-lime-300/80 hover:border-[#65A30D] rounded-xl text-xs font-bold text-[#365314] flex items-center justify-center gap-2 transition-all shadow-2xs group"
          >
            <Sparkles className="w-4 h-4 text-[#65A30D]" />
            <span>Entrar com Conta de Demonstração (1 Clique)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#65A30D] group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-[#F8FAF5] px-3 text-[11px] uppercase font-bold text-gray-400 absolute">
              ou formulário
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            {/* Email */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700">E-mail Operacional</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email')}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-700">Palavra-passe</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[11px] font-semibold text-[#65A30D] hover:underline"
                >
                  Esqueceu-se?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('password')}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="rounded text-[#65A30D] focus:ring-[#65A30D]"
                />
                <span>Lembrar este dispositivo</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-[#65A30D] hover:bg-[#558b0a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Entrar no Painel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Ainda não tem conta de exploração?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-bold text-[#65A30D] hover:underline"
            >
              Criar registo gratuito
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
