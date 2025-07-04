import { Outlet, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authStateAtom } from "../state/state";

export default function ProtectedRouter() {
  const isAuthenticated = useRecoilValue(authStateAtom);
  if (isAuthenticated === null) {
    return (
      <div className="text-white text-center text-4xl font-inter h-screen flex justify-center items-center"></div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
