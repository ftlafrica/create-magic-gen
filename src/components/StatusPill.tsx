import { cn } from "@/lib/utils";

type Status = "issued" | "revoked" | "pending" | "draft" | string;

const tones: Record<string, string> = {
  issued: "bg-secondary/15 text-secondary ring-secondary/40 shadow-[0_0_12px_-2px_hsl(var(--secondary)/0.5)]",
  active: "bg-secondary/15 text-secondary ring-secondary/40",
  revoked: "bg-destructive/15 text-destructive ring-destructive/40",
  pending: "bg-cta/15 text-cta ring-cta/40",
  draft: "bg-muted text-muted-foreground ring-border",
};

const StatusPill = ({ status, className }: { status: Status; className?: string }) => {
  const key = status?.toLowerCase?.() ?? "draft";
  const tone = tones[key] ?? tones.draft;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ring-1",
        tone,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-glow-pulse" />
      {status}
    </span>
  );
};

export default StatusPill;
