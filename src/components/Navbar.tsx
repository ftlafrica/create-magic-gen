import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-bold tracking-wider">AfriCertify</h1>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#verify" className="text-muted-foreground hover:text-foreground transition-colors">
              Verify
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button variant="cta">
              Start for Free
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
