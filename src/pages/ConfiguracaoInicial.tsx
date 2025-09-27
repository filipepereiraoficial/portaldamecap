import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Church, Building2, User, CheckCircle } from 'lucide-react';

interface FormData {
  igreja: {
    nome: string;
    endereco: string;
  };
  administrador: {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
  };
}

export const ConfiguracaoInicial: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    igreja: {
      nome: '',
      endereco: ''
    },
    administrador: {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: ''
    }
  });

  const handleIgrejaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.igreja.nome && formData.igreja.endereco) {
      setStep(2);
    }
  };

  const handleAdministradorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.administrador.senha !== formData.administrador.confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    setStep(3);
  };

  const updateIgrejaData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      igreja: {
        ...prev.igreja,
        [field]: value
      }
    }));
  };

  const updateAdministradorData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      administrador: {
        ...prev.administrador,
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6">
          <h1 className="text-2xl font-bold">Configuração Inicial do Sistema</h1>
          <p className="text-indigo-100 mt-2">Configure sua igreja e crie o usuário administrador</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center p-6 bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}>
                <Church className="h-4 w-4" />
              </div>
              <span className="font-medium">Igreja</span>
            </div>
            <div className={`w-8 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}>
                <User className="h-4 w-4" />
              </div>
              <span className="font-medium">Administrador</span>
            </div>
            <div className={`w-8 h-1 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}>
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="font-medium">Concluído</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="text-center mb-6">
                <Building2 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Dados da Igreja</h2>
                <p className="text-gray-600">Informe os dados básicos da sua igreja</p>
              </div>

              <form onSubmit={handleIgrejaSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Igreja
                  </label>
                  <input
                    type="text"
                    value={formData.igreja.nome}
                    onChange={(e) => updateIgrejaData('nome', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ex: Igreja Batista Central"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <textarea
                    value={formData.igreja.endereco}
                    onChange={(e) => updateIgrejaData('endereco', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    placeholder="Endereço completo da igreja"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Continuar
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="text-center mb-6">
                <User className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Administrador do Sistema</h2>
                <p className="text-gray-600">Crie o usuário administrador principal</p>
              </div>

              <form onSubmit={handleAdministradorSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.administrador.nome}
                    onChange={(e) => updateAdministradorData('nome', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Nome do administrador"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.administrador.email}
                    onChange={(e) => updateAdministradorData('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={formData.administrador.senha}
                    onChange={(e) => updateAdministradorData('senha', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Senha segura"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    value={formData.administrador.confirmarSenha}
                    onChange={(e) => updateAdministradorData('confirmarSenha', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Confirme a senha"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Finalizar
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Configuração Concluída!
              </h2>
              <p className="text-gray-600 mb-8">
                O sistema foi configurado com sucesso. A congregação sede foi criada automaticamente.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Resumo da Configuração:</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Igreja:</span>
                    <span className="font-medium">{formData.igreja.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Administrador:</span>
                    <span className="font-medium">{formData.administrador.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.administrador.email}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Ir para o Dashboard
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
