import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, School, BookOpen } from 'lucide-react';

export const Desenvolvimento: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <TrendingUp className="h-8 w-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">Desenvolvimento</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
      >
        <School className="h-16 w-16 text-indigo-500 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Módulo em Construção</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Esta área será dedicada ao desenvolvimento e capacitação de líderes e membros. Em breve, você encontrará aqui trilhas de aprendizado, cursos, materiais de estudo e ferramentas para acompanhar o crescimento ministerial de cada indivíduo.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg text-left">
                <div className="flex items-center space-x-3 mb-3">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Cursos e Trilhas</h3>
                </div>
                <p className="text-gray-600 text-sm">
                    Crie e gerencie cursos online, defina trilhas de desenvolvimento para diferentes funções (líderes de rede, professores, etc.) e acompanhe o progresso.
                </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-left">
                <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Avaliações e Feedback</h3>
                </div>
                <p className="text-gray-600 text-sm">
                    Implemente avaliações de desempenho, colete feedbacks e crie planos de desenvolvimento individuais para sua liderança.
                </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
