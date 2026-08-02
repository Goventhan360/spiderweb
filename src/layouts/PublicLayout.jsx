import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark text-text font-body relative overflow-x-hidden selection:bg-primary/30 selection:text-text">
      <div className="fixed inset-0 z-0 pointer-events-none gradient-mesh opacity-40"></div>
      
      <Navbar />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex flex-col min-h-screen pt-20"
        >
          <div className="flex-grow">
            <Outlet />
          </div>
        </motion.main>
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}
