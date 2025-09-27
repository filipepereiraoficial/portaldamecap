import { useAuth } from './useAuth';
import { Usuario } from '../types';

type Permissions = {
  // Permissões Globais
  isAdministrador: boolean;
  isGeralUser: boolean; // Secretário Geral, Tesoureiro Geral

  // Permissões de Módulo
  canViewDashboard: boolean;
  canManageMembers: boolean;
  canManageCongregations: boolean;
  canManageRequests: boolean;
  canManageFinances: boolean;
  canManageMinistries: boolean;
  canManageRedes: boolean;
  canManageCantina: boolean;
  canAccessCantina: boolean;
  canViewDevelopment: boolean;
  canViewSettings: boolean;
  canDoInitialSetup: boolean;

  // Permissões de Ação
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  canApprove: boolean;
  canForwardRequests: boolean;
  canSuspendMembers: boolean;
};

export const usePermissions = (): Permissions => {
  const { usuario } = useAuth();

  if (!usuario) {
    // Retorna todas as permissões como falsas se não houver usuário
    return {
      isAdministrador: false,
      isGeralUser: false,
      canViewDashboard: false,
      canManageMembers: false,
      canManageCongregations: false,
      canManageRequests: false,
      canManageFinances: false,
      canManageMinistries: false,
      canManageRedes: false,
      canManageCantina: false,
      canAccessCantina: false,
      canViewDevelopment: false,
      canViewSettings: false,
      canDoInitialSetup: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canExport: false,
      canApprove: false,
      canForwardRequests: false,
      canSuspendMembers: false,
    };
  }

  const { perfil } = usuario;

  const isAdministrador = perfil === 'ADMINISTRADOR';
  const isSecretarioGeral = perfil === 'SECRETARIO_GERAL';
  const isTesoureiroGeral = perfil === 'TESOUREIRO_GERAL';
  const isSecretarioLocal = perfil === 'SECRETARIO_LOCAL';
  const isTesoureiroLocal = perfil === 'TESOUREIRO_LOCAL';
  const isLiderMinisterio = perfil === 'LIDER_MINISTERIO';
  const isLiderRede = perfil === 'LIDER_REDE';
  const isGerenteCantina = perfil === 'GERENTE_CANTINA';

  const isGeralUser = isSecretarioGeral || isTesoureiroGeral;

  // Define as permissões com base no perfil
  const permissions: Permissions = {
    isAdministrador,
    isGeralUser,

    canViewDashboard: true, // Todos podem ver o dashboard
    canManageMembers: isAdministrador || isSecretarioGeral || isSecretarioLocal,
    canManageCongregations: isAdministrador || isSecretarioGeral,
    canManageRequests: isAdministrador || isSecretarioGeral || isSecretarioLocal,
    canManageFinances: isAdministrador || isTesoureiroGeral || isTesoureiroLocal,
    canManageMinistries: isAdministrador || isSecretarioGeral || isSecretarioLocal || isLiderMinisterio,
    canManageRedes: isAdministrador || isSecretarioGeral || isSecretarioLocal || isLiderRede,
    canManageCantina: isAdministrador || isTesoureiroGeral || isTesoureiroLocal,
    canAccessCantina: isAdministrador || isTesoureiroGeral || isTesoureiroLocal || isGerenteCantina,
    canViewDevelopment: isAdministrador || isSecretarioGeral || isLiderMinisterio || isLiderRede,
    canViewSettings: isAdministrador,
    canDoInitialSetup: isAdministrador,

    // Permissões de ação mais granulares
    canCreate: isAdministrador || isSecretarioGeral || isSecretarioLocal || isTesoureiroGeral || isTesoureiroLocal,
    canEdit: isAdministrador || isSecretarioGeral || isSecretarioLocal || isTesoureiroGeral || isTesoureiroLocal,
    canDelete: isAdministrador || isSecretarioGeral, // Apenas perfis gerais e admin podem deletar
    canExport: isAdministrador || isSecretarioGeral || isSecretarioLocal,
    canApprove: isAdministrador || isSecretarioGeral || isSecretarioLocal || isTesoureiroGeral || isTesoureiroLocal,
    canForwardRequests: isSecretarioLocal,
    canSuspendMembers: isAdministrador || isSecretarioGeral || isSecretarioLocal || isLiderMinisterio || isLiderRede,
  };

  return permissions;
};
