import {
  BellRing,
  Brain,
  ChartLine,
  Cloud,
  Code,
  Database,
  Download,
  Eye,
  FileText,
  Gauge,
  Languages,
  LayoutDashboard,
  Layers,
  Lightbulb,
  MessageSquareWarning,
  Plug,
  Scale,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Iconos permitidos (SPEC 4.4). Los datos de `/data` guardan el NOMBRE (serializable) y no el
 * componente: así pueden viajar a componentes de cliente. Para agregar uno, sumarlo aquí.
 */
const ICONS = {
  BellRing,
  Brain,
  ChartLine,
  Clock,
  Cloud,
  Code,
  Database,
  Download,
  Eye,
  FileText,
  Gauge,
  Languages,
  LayoutDashboard,
  Layers,
  Lightbulb,
  MessageSquareWarning,
  Plug,
  Scale,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/** Icono de lucide con el trazo de la marca (1,75) y 20 px por defecto. */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = ICONS[name];
  return <Component className={cn("size-5", className)} strokeWidth={1.75} aria-hidden="true" />;
}

/** Icono dentro de un cuadrado redondeado `mist` (SPEC 4.4): 24 px en un círculo de 44 px. */
export function IconChip({ name, className }: { name: IconName; className?: string }) {
  return (
    <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl bg-mist text-navy", className)}>
      <Icon name={name} className="size-6" />
    </span>
  );
}
