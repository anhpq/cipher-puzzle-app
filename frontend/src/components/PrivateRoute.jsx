import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { auth, refreshAuth } = useContext(AuthContext);

  useEffect(() => {
    refreshAuth(); // Refresh trạng thái xác thực mỗi khi PrivateRoute được mount
  }, []);

  if (auth.loading) return <div>Loading...</div>;
  if (!auth.isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

export default PrivateRoute;
