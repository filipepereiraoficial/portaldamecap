import React from 'react';

interface ProtectedComponentProps {
  permission: boolean;
  children: React.ReactNode;
}

/**
 * Um componente wrapper que renderiza seus filhos
 * apenas se a condição de permissão for verdadeira.
 */
export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ permission, children }) => {
  if (!permission) {
    return null;
  }

  return <>{children}</>;
};
