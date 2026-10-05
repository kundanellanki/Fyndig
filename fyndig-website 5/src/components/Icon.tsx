/**
 * Icon — a small, explicit Lucide registry.
 *
 * Icons are referenced by name from the data files (src/data/*.ts) so content
 * editors never touch component code. Add a new icon by importing it here and
 * adding it to `registry`; then use its key in the data files.
 */
import type { CSSProperties } from 'react';
import {
  Activity,
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  CloudCog,
  Code2,
  Cog,
  Compass,
  Cpu,
  Database,
  ExternalLink,
  GitBranch,
  Layers,
  Lightbulb,
  Mail,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Network,
  PenTool,
  Phone,
  Plug,
  Radar,
  Radio,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Waypoints,
  Wifi,
  Workflow,
  X,
  type LucideIcon,
} from 'lucide-react';

const registry: Record<string, LucideIcon> = {
  Activity,
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  CloudCog,
  Code2,
  Cog,
  Compass,
  Cpu,
  Database,
  ExternalLink,
  GitBranch,
  Layers,
  Lightbulb,
  Mail,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Network,
  PenTool,
  Phone,
  Plug,
  Radar,
  Radio,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Waypoints,
  Wifi,
  Workflow,
  X,
};

export default function Icon({
  name,
  className,
  style,
  strokeWidth = 1.5,
}: {
  name: string;
  className?: string;
  /** For icons coloured from data rather than from a theme class. */
  style?: CSSProperties;
  strokeWidth?: number;
}) {
  const Cmp = registry[name] ?? Sparkles;
  return (
    <Cmp
      className={className}
      style={style}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      focusable="false"
    />
  );
}
