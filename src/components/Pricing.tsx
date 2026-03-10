import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      "Recipient portfolio"
    ],
    cta: "Start Free",
    variant: "outline" as const,
    popular: false
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
      "Custom branding"
    ],
    cta: "Choose Premium",
    variant: "hero" as const,
    popular: true
  },
  {
    name: "Business",
    price: "99",
    description: "For growing organizations",
    features: [
      "1000 certificates per month",
      "Team collaboration (5 users)",
      "Advanced analytics",
      "API access",
      "White-label options",
      "Dedicated support"
    ],
    cta: "Choose Business",
    variant: "accent" as const,
    popular: false
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large institutions",
    features: [
      "Unlimited certificates",
      "Unlimited team members",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated account manager",
      "Custom features"
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-bold">
            Simple, Transparent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cta to-accent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan for your needs. All plans include our core features.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Most Popular
                </div>
              )}
              <Card className={`p-8 h-full flex flex-col glow-card ${plan.popular ? 'border-secondary/50 shadow-[0_0_30px_hsl(var(--secondary)/0.2)]' : 'bg-card/50 backdrop-blur-sm'}`}>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{plan.price === "Custom" ? "" : "$"}{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                  </div>
                </div>

                <div className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant={plan.variant} className="w-full" size="lg">
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            All plans include 14-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
