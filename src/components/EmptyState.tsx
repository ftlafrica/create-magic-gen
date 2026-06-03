import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  children?: ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, actionTo, onAction, children }: EmptyStateProps) => (
  <div className="text-center py-16 px-6">
    <div className="relative inline-flex mb-6">
      <div className="absolute inset-0 bg-secondary/20 rounded-full blur-2xl animate-glow-pulse" />
      <div className="relative w-20 h-20 rounded-2xl glass flex items-center justify-center">
        <Icon className="w-9 h-9 text-secondary" />
      </div>
    </div>
    <h3 className="text-2xl font-bold mb-2 tracking-wide">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">{description}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo}>
        <Button variant="cta" className="rounded-full">{actionLabel}</Button>
      </Link>
    )}
    {actionLabel && onAction && (
      <Button variant="cta" className="rounded-full" onClick={onAction}>{actionLabel}</Button>
    )}
    {children}
  </div>
);

export default EmptyState;
