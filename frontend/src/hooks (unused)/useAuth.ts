// src/hooks/useAuth.ts
import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  role: string;
  [key: string]: any;
}

const useAuth = () => {
  const auth = useMemo(() => {
    const token = localStorage.getItem("access"); // move inside useMemo
    if (!token) return { isAuthenticated: false, role: null };

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log("Decoded token:", decoded); // ✅ Add it here
      const isExpired = decoded.exp * 1000 < Date.now();

      return {
        isAuthenticated: !isExpired,
        role: decoded.role?.toLowerCase() || null,
      };
    } catch (err) {
      console.error("Invalid token", err);
      return { isAuthenticated: false, role: null };
    }
  }, [localStorage.getItem("access")]); // or just [] if you're not depending on reactivity

  console.log({ isAuthenticated: auth.isAuthenticated, role: auth.role });
  return auth;
};

export default useAuth;
