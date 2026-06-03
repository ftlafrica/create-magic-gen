import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Freemium",
    price: "0",
    description: "Perfect for trying out AfriCertify",
    features: [
      "10 certificates per month",
      "2 pre-built templates",
      "Basic customization",
      "Email support",
      "Recipient portfolio",
    ],
    cta: "Start Free",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Premium",
    price: "29",
    description: "For individual educators and trainers",
    features: [
      "200 certificates per month",
      "All 14 pre-built templates",
      "Upload up to 7 custom templates",
      "3 AI template generation credits",
      "Priority support",
      "Analytics dashboard",
      "Custom branding",
    ],
    cta: "Choose Premium",
    variant: "cta" as const,
    popular: true,
  },
  {
    name: "Business",
    price: "99",
    description: "For growing organizations",
    features: [
      "1000 certificates per month",
      "All 14 pre-built templates",
      "Unlimited custom template uploads",
      "Unlimited AI template generation",
      "Team collaboration (5 users)",
      "Advanced analytics",
      "API access",
      "White-label options",
      "Dedicated support",
    ],
    cta: "Choose Business",
    variant: "accent" as const,
    popular: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large institutions",
    features: [
      "Unlimited certificates",
      "All templates + unlimited uploads",
      "Unlimited AI template generation",
      "Unlimited team members",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated account manager",
      "Custom features",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5 pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 sm:mb-16 space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs tracking-wider uppercase text-cta">
            <span className="w-1.5 h-1.5 rounded-full bg-cta animate-glow-pulse" />
            Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Simple, transparent <span className="text-gradient-gold">pricing</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Choose the perfect plan for your needs. All plans include core features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`relative ${plan.popular ? "lg:-translate-y-3" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-gold text-cta-foreground px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-[0_8px_20px_-6px_hsl(var(--cta)/0.6)]">
                    <Sparkles className="w-3 h-3" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div
                className={`relative h-full rounded-2xl p-6 sm:p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "glass-strong border-beam shadow-[0_20px_60px_-20px_hsl(var(--cta)/0.4)]"
                    : "glass hover:border-secondary/40"
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-1 tracking-wide">{plan.name}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-4 min-h-[36px]">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    {plan.price !== "Custom" && <span className="text-2xl font-bold text-muted-foreground">$</span>}
                    <span className={`text-4xl sm:text-5xl font-bold ${plan.popular ? "text-gradient-gold" : ""}`}>
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground text-sm">/mo</span>}
                  </div>
                </div>

                <div className="space-y-2.5 mb-6 flex-grow">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? "text-cta" : "text-secondary"}`} />
                      <span className="text-xs sm:text-sm text-foreground/90">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant={plan.variant} className="w-full rounded-full" size="lg">
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
