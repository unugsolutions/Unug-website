// Service icon registry: maps icon names stored on service records to lucide-react icons.
import {
  Globe,
  Code2,
  Smartphone,
  PencilRuler,
  Cloud,
  Database,
  ShieldCheck,
  Rocket,
  Zap,
  Palette,
  Users,
  Bot,
  Server,
  Cpu,
  Workflow,
  Layers,
  PenTool,
  BookOpen,
  LineChart,
  Headphones,
  Sparkles,
  BriefcaseBusiness,
} from "lucide-react"

export const serviceIcons = {
  Globe,
  Code2,
  Smartphone,
  PencilRuler,
  Cloud,
  Database,
  ShieldCheck,
  Rocket,
  Zap,
  Palette,
  Users,
  Bot,
  Server,
  Cpu,
  Workflow,
  Layers,
  PenTool,
  BookOpen,
  LineChart,
  Headphones,
  Sparkles,
  BriefcaseBusiness,
}

// All registered icon names, used to populate admin icon pickers.
export const serviceIconNames = Object.keys(serviceIcons)

/** Resolves an icon by name, falling back to a generic briefcase icon. */
export function getServiceIcon(name) {
  return serviceIcons[name] ?? BriefcaseBusiness
}
