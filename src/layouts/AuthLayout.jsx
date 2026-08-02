import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function AuthLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 relative overflow-hidden font-body">
      <div className="absolute inset-0 gradient-mesh opacity-50 pointer-events-none"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none animate-pulse-glow"></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
