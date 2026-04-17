import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Home } from './pages/Home';
import { LocationsPage } from './pages/LocationsPage';
import { MenuPage } from './pages/MenuPage';
import { ReservationPage } from './pages/ReservationPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { ContactPage } from './pages/ContactPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard';
import { VendorPage } from './pages/VendorPage.tsx';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductPage } from './pages/ProductPage';
import { VendorDashboard } from './pages/VendorDashboard.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { AdminLocationEditor } from './pages/AdminLocationEditor.tsx';
import { CartSidebar } from './components/CartSidebar';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <CartSidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reserve/:locationId" element={<ReservationPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/vendor/:vendorId" element={<VendorPage />} />
        <Route path="/admin/location/:id" element={<AdminLocationEditor />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/vendor/:vendorId" element={<VendorPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </>
  );
}

export default App;
