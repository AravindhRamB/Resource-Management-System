import React from "react";

interface AuthLoginLayoutProps {
  children: React.ReactNode;
}

const AuthLoginLayout: React.FC<AuthLoginLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout w-full h-screen ">
      <div className="login-wrapper h-full">
        {children}
      </div>
    </div>
  );
};

export default AuthLoginLayout;