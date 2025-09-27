import React, { createContext, useContext, useState, ReactNode } from 'react';
import { faker } from '@faker-js/faker';
import { Notificacao } from '../types';

interface NotificationContextType {
  notificacoes: Notificacao[];
  addNotification: (notificationData: Omit<Notificacao, 'id' | 'createdAt' | 'lida'>) => void;
  handleNotificationAction: (notificationId: string, accepted: boolean) => void;
  markAsRead: (notificationId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const initialNotifications: Notificacao[] = [
    {
        id: faker.string.uuid(),
        tipo: 'AVISO_GERAL',
        titulo: 'Atualização do Sistema',
        mensagem: 'O sistema será atualizado no próximo sábado às 22:00.',
        lida: true,
        createdAt: faker.date.recent({ days: 3 }),
    }
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(initialNotifications);

  const addNotification = (notificationData: Omit<Notificacao, 'id' | 'createdAt' | 'lida'>) => {
    const newNotification: Notificacao = {
      ...notificationData,
      id: faker.string.uuid(),
      createdAt: new Date(),
      lida: false,
    };
    setNotificacoes(prev => [newNotification, ...prev]);
  };

  const handleNotificationAction = (notificationId: string, accepted: boolean) => {
    const notification = notificacoes.find(n => n.id === notificationId);
    if (!notification) return;

    let logMessage = `Ação do usuário: ${accepted ? 'ACEITO' : 'RECUSADO'}\n`;
    
    if (notification.tipo.startsWith('CONVITE')) {
      logMessage += `Grupo: ${notification.dados?.grupoNome} (ID: ${notification.dados?.grupoId})\n`;
      logMessage += `Em um aplicativo real, uma chamada de API seria feita aqui para atualizar o status do membro no grupo.`;
    } else if (notification.tipo === 'CONFIRMACAO_FIADO') {
      logMessage += `Confirmação de compra fiado no valor de R$ ${notification.dados?.valorFiado?.toFixed(2)}.\n`;
      if (accepted) {
        logMessage += `A dívida foi registrada para o membro.`;
      } else {
        logMessage += `A compra foi recusada pelo membro.`;
      }
    }
    
    console.log(logMessage);
    alert(logMessage); // Para feedback visual na simulação

    // Remove a notificação após a ação para simular que foi tratada
    setNotificacoes(prev => prev.filter(n => n.id !== notificationId));
  };

  const markAsRead = (notificationId: string) => {
    const notification = notificacoes.find(n => n.id === notificationId);
    setNotificacoes(prev => 
        prev.map(n => n.id === notificationId ? { ...n, lida: true } : n)
    );
     if (notification?.tipo === 'SUSPENSAO_MEMBRO') {
        alert("Em um app real, você seria redirecionado para a página de detalhes da suspensão para ver o motivo e recorrer.");
    }
  };


  return (
    <NotificationContext.Provider value={{ notificacoes, addNotification, handleNotificationAction, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
