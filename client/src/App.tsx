import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import CustomToast from './components/CustomToast/CustomToast';
import { SellerDashboard } from './components/seller/SellerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { getUser } from './utils/auth';

const App = () => {
  const user = getUser();

  return (
    <>
      <CustomToast />

      <Routes>
        {/* Public Home Page */}
        {/* <Route path="/" element={<Home />} /> */}

        {/* If user is not logged in, show Login page */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        {/* If user is logged in, redirect to appropriate dashboard */}
        <Route
          path="/"
          element={user ? (
            user.role === 'admin' ? (
              <AdminDashboard /> // Show Admin Dashboard if the user is an admin
            ) : user.role === 'seller' ? (
              <SellerDashboard />
            ) : (
              <CustomerDashboard />
            )
          ) : (
            <Navigate to="/login" />
          )}
        />


        {/* Register page route */}
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
};

export default App;