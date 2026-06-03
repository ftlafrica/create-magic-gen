import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AfriCertifyLogo from "@/components/AfriCertifyLogo";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "/#features", anchor: true },
  { label: "Pricing", href: "/#pricing", anchor: true },
  { label: "Verify", href: "/verify", anchor: false },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "py-1.5 backdrop-blur-xl bg-background/70 border-b border-secondary/15 shadow-[0_8px_30px_-12px_hsl(210_100%_4%/0.6)]"
          : "py-3 bg-transparent border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0">
            <AfriCertifyLogo size="sm" showTagline />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                {l.label}
                <span className="absolute left-4 right-4 -bottom-0.5 h-px scale-x-0 origin-left bg-gradient-to-r from-secondary to-accent transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/signin" className="hidden md:inline-flex">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup" className="hidden sm:inline-flex">
              <Button variant="cta" size="sm" className="rounded-full px-5">
                Start Free
              </Button>
            </Link>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg glass text-foreground"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 mx-3 rounded-2xl glass-strong p-4 flex flex-col gap-1"
          >
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="px-3 py-3 rounded-lg text-foreground/90 hover:bg-secondary/10 hover:text-secondary transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <Link to="/signin" className="px-3 py-3 rounded-lg hover:bg-secondary/10 transition-colors">
              Sign In
            </Link>
            <Link to="/signup">
              <Button variant="cta" className="w-full mt-1 rounded-full">Start Free</Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
