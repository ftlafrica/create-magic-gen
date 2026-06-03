import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import AfriCertifyLogo from "@/components/AfriCertifyLogo";
import { Link } from "react-router-dom";

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-secondary/15 bg-surface-1/40">
      {/* Top neon divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
      {/* Ambient glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 pt-16 pb-8 relative">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4 md:col-span-1">
            <AfriCertifyLogo size="sm" showTagline />
            <p className="text-sm text-muted-foreground leading-relaxed">
              The future of verifiable credentials. Crafted in Africa, trusted everywhere.
            </p>
            <div className="flex gap-3 pt-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-lg glass text-muted-foreground hover:text-secondary hover:border-secondary/40 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-foreground tracking-wider">PRODUCT</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/#features" className="text-muted-foreground hover:text-secondary transition-colors">Features</a></li>
              <li><a href="/#pricing" className="text-muted-foreground hover:text-secondary transition-colors">Pricing</a></li>
              <li><Link to="/template-gallery" className="text-muted-foreground hover:text-secondary transition-colors">Templates</Link></li>
              <li><Link to="/verify" className="text-muted-foreground hover:text-secondary transition-colors">Verify</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-foreground tracking-wider">COMPANY</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-foreground tracking-wider">LEGAL</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 AfriCertify. All rights reserved.</p>
          <p className="tracking-wider">AI · AUTHENTICATED · IMMUTABLE</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
