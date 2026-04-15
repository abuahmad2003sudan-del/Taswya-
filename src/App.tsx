import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import RegisterDispute from "./pages/RegisterDispute";
import PaymentGateway from "./pages/PaymentGateway";
import RegisterMediator from "./pages/RegisterMediator";
import TrackDispute from "./pages/TrackDispute";
import AdminDashboard from "./pages/AdminDashboard";
import MediatorDashboard from "./pages/MediatorDashboard";
import ReferralPage from "./pages/ReferralPage";
import Leaderboard from "./pages/Leaderboard";
import BecomeMediator from "./pages/BecomeMediator";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import LegalLibrary from "./pages/LegalLibrary";
import SuccessStories from "./pages/SuccessStories";
import Pricing from "./pages/Pricing";
import News from "./pages/News";
import Careers from "./pages/Careers";
import Partners from "./pages/Partners";
import Security from "./pages/Security";
import { Toaster } from "sonner";
import { CookieConsent } from "./components/CookieConsent";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<RegisterDispute />} />
        <Route path="/payment-gateway" element={<PaymentGateway />} />
        <Route path="/register-mediator" element={<RegisterMediator />} />
        <Route path="/track" element={<TrackDispute />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/mediator" element={<MediatorDashboard />} />
        <Route path="/referrals" element={<ReferralPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/become-mediator" element={<BecomeMediator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/legal-library" element={<LegalLibrary />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/news" element={<News />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/security" element={<Security />} />
      </Routes>
      <Toaster position="top-center" />
    </Router>
  );
}
