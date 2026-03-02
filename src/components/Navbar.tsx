import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AfriCertifyLogo from "@/components/AfriCertifyLogo";

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
          >
            <Link to="/">
              <AfriCertifyLogo size="sm" showTagline />
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-secondary transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-secondary transition-colors">
              Pricing
            </a>
            <Link to="/verify" className="text-muted-foreground hover:text-secondary transition-colors">
              Verify
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/signin">
              <Button variant="ghost" className="hidden md:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="cta">
                Start for Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
