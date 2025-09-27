import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Church } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('admin@igreja.com');
  const [senha, setSenha] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, senha);
      if (!success) {
        setError('Email ou senha inválidos');
      }
    } catch (err) {
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4"
          >
            <Church className="h-8 w-8 text-indigo-600" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900">SGCI</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestão e Comunicação para Igrejas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <p>Use um dos emails abaixo para testar os perfis:</p>
          <ul className="list-disc list-inside text-left bg-gray-50 p-3 rounded-lg text-xs">
              <li><code className="font-mono bg-gray-200 px-1 rounded">admin@igreja.com</code> (Global)</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">secretario.geral@igreja.com</code> (Global)</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">tesoureiro.geral@igreja.com</code> (Global)</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">gerente.cantina@igreja.com</code> (Sede)</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">secretario.local@igreja.com</code> (Local - Filial Sul)</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">tesoureiro.local@igreja.com</code> (Local - Filial Norte)</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">lider.ministerio@igreja.com</code> (Líder Ministério - Filial Norte)</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">lider.rede@igreja.com</code> (Líder Rede - Filial Sul)</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">membro@igreja.com</code> (Membro - Filial Norte)</li>
          </ul>
          <p>A senha é <code className="font-mono bg-gray-200 px-1 rounded">123</code> para todos.</p>
        </div>
      </motion.div>
    </div>
  );
};
