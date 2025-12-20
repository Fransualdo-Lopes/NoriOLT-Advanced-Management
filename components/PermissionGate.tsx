
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Permission } from '../roles';

interface PermissionGateProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * PermissionGate
 * Wraps UI elements that require specific permissions.
 */
const PermissionGate: React.FC<PermissionGateProps> = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionGate;
