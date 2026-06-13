export type PermissionLevel = 'read' | 'create' | 'update' | 'delete';

const riskyActions = ['delete', 'external_send', 'permission_change'];

export function checkPermission(action: string) {
  if (riskyActions.includes(action)) {
    return {
      allowed: false,
      approvalRequired: true,
    };
  }

  return {
    allowed: true,
    approvalRequired: false,
  };
}
