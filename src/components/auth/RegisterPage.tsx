import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../../lib/validations';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../ui/DemoBadge';
import { Sprout, Lock, Mail, Building, User, ArrowRight, AlertCircle } from 'lucide-react';

export function RegisterPage() {
  const { navigate } = useRouter();
  const { setIsAuthenticated, updateUserProfile, showToast } = useApp();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setSubmitting(true);
    setTimeout(() => {
      updateUserProfile({
        name: data.name,
        email: data.email,
        company: data.company,
      });
      setIsAuthenticated(true);
      showToast('Conta criada com sucesso!', 'Bem-vindo à plataforma Agriia.', 'success');
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAF5]">
      {/* Left Brand Side */}
      <div className="lg:w-1/2 p-8 lg:p-16 bg-gradient-to-br from-lime-900 via-lime-800 to-[#365314] text-white flex flex-col justify-between">
        <div className="space-y-6">
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
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              Registe a sua exploração e conecte-se aos satélites Sentinel-2.
            </h1>
            <p className="text-sm text-lime-200/90 leading-relaxed">
              Junte-se a mais de 450 produtores e cooperativas agrícolas em Angola a monitorizar
              culturas, solos e balanço hídrico com apoio de inteligência artificial.
            </p>
          </div>
        </div>

        <div className="mt-8 text-[11px] text-lime-300/80">
          © 2026 Agriia Technologies • Demonstração Frontend
        </div>
      </div>

      {/* Right Form Side */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Criar Conta</h2>
              <DemoBadge compact />
            </div>
            <p className="text-xs text-gray-500">
              Registo gratuito para acesso ao painel de demonstração.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            {/* Nome */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Nome Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Ex: Eng. Manuel Kwanza"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700">E-mail Operacional</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="m.kwanza@fazenda.ao"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Empresa */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Empresa / Exploração / Cooperativa</label>
              <div className="relative">
                <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...register('company')}
                  placeholder="Sociedade Agrícola do Huambo Lda"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                />
              </div>
              {errors.company && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.company.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Palavra-passe</label>
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

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Confirmar Palavra-passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-[#65A30D] hover:bg-[#558b0a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <span>Concluir Registo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Já tem uma conta registada?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-bold text-[#65A30D] hover:underline"
            >
              Iniciar sessão
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
