// frontend/src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    // Nếu đang tải trạng thái authentication, hiển thị loading (hoặc placeholder)
    if (auth.loading) return <div>Loading...</div>;

    // Nếu người dùng chưa đăng nhập, chuyển hướng về trang login
    if (!auth.isAuthenticated) return <Navigate to="/" replace />;
    return children;
};

export default PrivateRoute;
