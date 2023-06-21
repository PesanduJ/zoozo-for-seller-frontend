import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminProducts from './components/admins/adminProducts';
import UpdateProduct from './components/admins/updateProduct';
import AdminDashboard from './components/admins/adminHome';
import AdminSettings from './components/admins/adminSettings';
import AdminSales from './components/admins/adminSales';
import UserDashboard from './components/users/userDashboard';
import LoginPage from './components/loginPage';
import RegistrationForm from './components/registrationPage';
import UpdateUserForm from './components/users/updateUser';
import Logout from './components/logoutPage';
import OrdersBySeller from './components/users/allUserOrders';
import TopSellers from './components/users/topSellers';
import ProductDetails from './components/users/productDetails';
import OrdersTable from './components/admins/temp';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/user-registration" element={<RegistrationForm />} />
      <Route path="/admin-home" element={<AdminDashboard />} />
      <Route path="/sales" element={<AdminSales />} />
      <Route path="/products" element={<AdminProducts />} />
      <Route path="/top-sellers" element={<TopSellers/>} />
      <Route path="/settings" element={<AdminSettings />} />
      <Route path="/product/:productCode" element={<ProductDetails />} />
      <Route path="/update-product/:productCode" element={<UpdateProduct />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/user-orders" element={<OrdersBySeller />} />
      <Route path="/user-settings" element={<UpdateUserForm />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/temp" element={<OrdersTable />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
