import { useAuthStore } from "~/stores/auth";

/**
 * Check user permissions and roles.
 *
 * @param {string|string[]} permissions - Permissions to check.
 * @param {string|string[]} roles - Roles to check.
 * @param {string|string[]} types - Types to check.
 * @param {boolean} checkSuperAdmin - Whether to check for super-admin role.
 * @returns {boolean} - True if the user has the required permissions or roles, otherwise false.
 */
export default function checkPermissionsAndRoles(
  permissions = [],
  roles = [],
  types = [],
  checkSuperAdmin = true,
) {
  const auth = useAuthStore();

  if (
    checkSuperAdmin &&
    (Array.isArray(auth.roles) ? auth.roles.includes("Admin") : auth.roles === "Admin")
  ) {
    return true;
  }

  if (
    (Array.isArray(permissions) && permissions.some((permission) => auth.permissions.includes(permission))) ||
    (typeof permissions === "string" && auth.permissions.includes(permissions))
  ) {
    return true;
  }

  if (
    (Array.isArray(roles) && roles.some((role) => auth.roles.includes(role))) ||
    (typeof roles === "string" && auth.roles.includes(roles))
  ) {
    return true;
  }

  if (
    (Array.isArray(types) && auth.user && types.includes(auth.user.type)) ||
    (typeof types === "string" && auth.user && auth.user.type === types)
  ) {
    return true;
  }  

  return false;
}
