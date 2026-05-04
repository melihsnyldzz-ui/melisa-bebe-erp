import { createContext, useContext, useMemo, useState } from "react";
import { ROLE_DEFINITIONS } from "../config/roles.js";

const AuthContext = createContext(null);

const defaultUser = {
  name: "Melisa Bebe Yönetici",
  role: "owner",
};

export function AuthProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(defaultUser.role);

  const value = useMemo(() => {
    const role = ROLE_DEFINITIONS[currentRole] ? currentRole : defaultUser.role;
    const permissions = new Set(ROLE_DEFINITIONS[role].permissions);

    return {
      currentUser: {
        ...defaultUser,
        role,
      },
      currentRole: role,
      setCurrentRole,
      hasPermission: (permission) => permissions.has(permission),
    };
  }, [currentRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
