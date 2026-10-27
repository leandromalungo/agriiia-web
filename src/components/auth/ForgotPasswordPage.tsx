import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../lib/validations';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../ui/DemoBadge';
import { Sprout, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
  const { navigate } = useRouter();
  const { showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setSubmitted(true);
    showToast(
      'Email enviado',
      `As instruções de redefinição foram simuladas para ${data.email}.`,
      'info'
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAF5]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#65A30D] to-[#365314] text-white flex items-center justify-center">
              <Sprout className="w-6 h-6 text-[#ECFCCB]" />
            </div>
            <span className="text-xl font-black text-gray-900">Agriia</span>
          </div>
          <DemoBadge compact />
        </div>

        {submitted ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Verifique a sua caixa de entrada</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              No ambiente demonstrativo, a recuperação é apenas simulada. Pode voltar à página de
              início de sessão e usar a conta predefinida.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-6 py-2.5 bg-[#65A30D] hover:bg-[#558b0a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Voltar ao Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recuperar Palavra-passe</h2>
              <p className="text-xs text-gray-500 mt-1">
                Introduza o endereço de e-mail associado à sua conta operacional.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">E-mail Cadastrado</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="ex: d.afonso@agriia.ao"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#F8FAF5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#65A30D]"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-600">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#65A30D] hover:bg-[#558b0a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Enviar Link de Recuperação</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao ecrã de início de sessão</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
