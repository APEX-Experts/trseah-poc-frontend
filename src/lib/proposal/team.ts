import { ProposalDto } from "../proposal-utils";
import {
  Briefcase,
  Cpu,
  Shield,
  Palette,
  Code,
  Terminal,
  Database,
  Layout,
  Network,
  Server,
  User,
  Users,
  UserCheck,
  UserCog,
  ShieldAlert,
  FileText,
  TrendingUp,
  Settings,
  Key,
  Lock,
  Clock,
  MessageSquare,
  Activity,
  Award,
  BookOpen,
  Zap,
  Layers,
  BarChart3,
  Globe,
  Search,
  Megaphone,
  CheckCircle,
  GitBranch,
  Phone,
  MapPin,
  Wrench,
  HardDrive,
  Heart,
  Scale,
  DollarSign,
  type LucideIcon,
} from "lucide-react";

export interface TeamMemberCard {
  icon: string; // Lucide icon name (e.g. "Briefcase", "Shield", "Cpu", "Palette")
  name: string; // Job Title (e.g. Project Manager)
  role: string; // Project Role/Focus (e.g. Governance & Risk)
  bio: string; // Experience & Certifications
}

export interface TeamDivision {
  department: string;
  responsibility: string;
  count: string;
  location: string;
}

export interface TeamGovernanceData {
  title: string;
  subtitle: string;
  members: TeamMemberCard[];
  divisionsTitle: string;
  divisions: TeamDivision[];
  additionalContent?: string;
}

export const TEAM_ICONS = [
  "Briefcase",
  "Cpu",
  "Shield",
  "Palette",
  "Code",
  "Terminal",
  "Database",
  "Layout",
  "Network",
  "Server",
  "User",
  "Users",
  "UserCheck",
  "UserCog",
  "ShieldAlert",
  "FileText",
  "TrendingUp",
  "Settings",
  "Key",
  "Lock",
  "Clock",
  "MessageSquare",
  "Activity",
  "Award",
  "BookOpen",
  "Zap",
  "Layers",
  "BarChart3",
  "Globe",
  "Search",
  "Megaphone",
  "CheckCircle",
  "GitBranch",
  "Phone",
  "MapPin",
  "Wrench",
  "HardDrive",
  "Heart",
  "Scale",
  "DollarSign",
] as const;

export type TeamIconType = (typeof TEAM_ICONS)[number];

export const TEAM_ICON_MAP: Record<TeamIconType, LucideIcon> = {
  Briefcase,
  Cpu,
  Shield,
  Palette,
  Code,
  Terminal,
  Database,
  Layout,
  Network,
  Server,
  User,
  Users,
  UserCheck,
  UserCog,
  ShieldAlert,
  FileText,
  TrendingUp,
  Settings,
  Key,
  Lock,
  Clock,
  MessageSquare,
  Activity,
  Award,
  BookOpen,
  Zap,
  Layers,
  BarChart3,
  Globe,
  Search,
  Megaphone,
  CheckCircle,
  GitBranch,
  Phone,
  MapPin,
  Wrench,
  HardDrive,
  Heart,
  Scale,
  DollarSign,
};

// Helper to map job title to an icon
function getIconForJobTitle(title: string): string {
  const clean = title.toLowerCase();
  if (
    clean.includes("مدير") ||
    clean.includes("manager") ||
    clean.includes("leader") ||
    clean.includes("قائد")
  ) {
    if (clean.includes("أمن") || clean.includes("security")) return "Shield";
    if (
      clean.includes("تجربة") ||
      clean.includes("ux") ||
      clean.includes("ui") ||
      clean.includes("تصميم") ||
      clean.includes("design")
    )
      return "Palette";
    return "Briefcase";
  }
  if (clean.includes("مهندس") || clean.includes("engineer")) {
    if (clean.includes("أمن") || clean.includes("security")) return "Shield";
    if (clean.includes("شبكات") || clean.includes("network")) return "Network";
    if (clean.includes("سيرفر") || clean.includes("server") || clean.includes("devops"))
      return "Server";
    return "Cpu";
  }
  if (
    clean.includes("مطور") ||
    clean.includes("developer") ||
    clean.includes("مبرمج") ||
    clean.includes("programmer")
  ) {
    if (clean.includes("واجهات") || clean.includes("frontend") || clean.includes("web"))
      return "Layout";
    return "Code";
  }
  if (
    clean.includes("بيانات") ||
    clean.includes("data") ||
    clean.includes("قاعدة") ||
    clean.includes("database")
  )
    return "Database";
  if (clean.includes("أمن") || clean.includes("security") || clean.includes("سيبراني"))
    return "Shield";
  if (
    clean.includes("تجربة") ||
    clean.includes("ux") ||
    clean.includes("ui") ||
    clean.includes("تصميم") ||
    clean.includes("design")
  )
    return "Palette";

  return "User";
}

export function parseTeamGovernanceData(
  serialized: string | undefined,
  isRtl: boolean,
  proposalData?: ProposalDto | null,
): TeamGovernanceData {
  const tDefault = {
    title: isRtl ? "الفريق والحوكمة" : "Team & Governance",
    subtitle: isRtl
      ? "هيكل قيادي رباعي الطبقات يضمن الشفافية والمساءلة الكاملة"
      : "A four-tier leadership structure ensuring complete transparency and accountability",
    divisionsTitle: isRtl
      ? "توزيع الموارد البشرية وتخصيص الأدوار"
      : "Resource Allocation & Role Assignment",
  };

  // Default Leadership Members with Icons
  const defaultMembers: TeamMemberCard[] = isRtl
    ? [
        {
          icon: "Briefcase",
          name: "مدير المشروع",
          role: "إدارة المشروع والحوكمة",
          bio: "18 سنة خبرة ، PMP ، ITIL v4",
        },
        {
          icon: "Cpu",
          name: "كبير المهندسين",
          role: "هندسة البرمجيات والتطوير",
          bio: "14 سنة خبرة ، GCP Pro ، AWS SA",
        },
        {
          icon: "Shield",
          name: "قائد الأمن السيبراني",
          role: "أمن البنية التحتية والبيانات",
          bio: "12 سنة خبرة ، CISM ، CISSP",
        },
        {
          icon: "Palette",
          name: "مدير تجربة المستخدم",
          role: "تصميم الواجهات وتجربة المستخدم",
          bio: "10 سنوات خبرة ، Nielsen ، CXA",
        },
      ]
    : [
        {
          icon: "Briefcase",
          name: "Project Manager",
          role: "Project Management & Governance",
          bio: "18 years exp, PMP, ITIL v4",
        },
        {
          icon: "Cpu",
          name: "Chief Engineer",
          role: "Software Engineering & Dev",
          bio: "14 years exp, GCP Pro, AWS SA",
        },
        {
          icon: "Shield",
          name: "Cybersecurity Lead",
          role: "Infrastructure & Data Security",
          bio: "12 years exp, CISM, CISSP",
        },
        {
          icon: "Palette",
          name: "UX Manager",
          role: "UX/UI Design & Usability",
          bio: "10 years exp, Nielsen, CXA",
        },
      ];

  // Map real team members from organization based on roles instead of names
  const mappedMembers: TeamMemberCard[] = [];
  if (proposalData?.teamMembers && proposalData.teamMembers.length > 0) {
    proposalData.teamMembers.forEach((m) => {
      const jobTitle = isRtl ? m.roleAr || "عضو الفريق" : m.roleEn || m.roleAr || "Team Member";

      const projectRole = isRtl ? "مسؤول التنفيذ" : "Implementation Officer";

      const experience = m.yearsOfExperience
        ? isRtl
          ? `${m.yearsOfExperience} سنوات خبرة`
          : `${m.yearsOfExperience} years exp`
        : "";

      const icon = getIconForJobTitle(jobTitle);

      mappedMembers.push({
        icon,
        name: jobTitle,
        role: projectRole,
        bio: experience,
      });
    });
  }

  const finalMembers = mappedMembers.length > 0 ? mappedMembers.slice(0, 4) : defaultMembers;

  const defaultDivisions: TeamDivision[] = isRtl
    ? [
        {
          department: "الإدارة والحوكمة",
          responsibility: "إدارة المشروع، إعداد التقارير، إدارة المخاطر",
          count: "4",
          location: "الرياض (ميداني)",
        },
        {
          department: "هندسة البرمجيات",
          responsibility: "تطوير Backend و Frontend و APIs",
          count: "14",
          location: "الرياض + عن بعد",
        },
        {
          department: "الأمن السيبراني",
          responsibility: "تأمين البنية التحتية والاختبارات الأمنية",
          count: "5",
          location: "الرياض (ميداني)",
        },
        {
          department: "تكامل الأنظمة",
          responsibility: "ربط الأنظمة الحكومية و API Gateways",
          count: "6",
          location: "الرياض + المدينة",
        },
        {
          department: "تجربة المستخدم",
          responsibility: "تصميم UX/UI واختبار قابلية الاستخدام",
          count: "4",
          location: "الرياض",
        },
        {
          department: "بيانات وذكاء اصطناعي",
          responsibility: "نماذج ML، لوحات المؤشرات، التحليلات",
          count: "5",
          location: "الرياض",
        },
        {
          department: "التدريب والتغيير",
          responsibility: "تدريب المستخدمين وإدارة التغيير المؤسسي",
          count: "3",
          location: "متنقل",
        },
      ]
    : [
        {
          department: "Management & Governance",
          responsibility: "Project management, reporting, risk management",
          count: "4",
          location: "Riyadh (Onsite)",
        },
        {
          department: "Software Engineering",
          responsibility: "Backend, Frontend, and API development",
          count: "14",
          location: "Riyadh + Remote",
        },
        {
          department: "Cybersecurity",
          responsibility: "Infrastructure security and pentesting",
          count: "5",
          location: "Riyadh (Onsite)",
        },
        {
          department: "System Integration",
          responsibility: "Connecting gov systems & API Gateways",
          count: "6",
          location: "Riyadh + Madinah",
        },
        {
          department: "UX/UI Design",
          responsibility: "UX/UI design and usability testing",
          count: "4",
          location: "Riyadh",
        },
        {
          department: "Data & AI",
          responsibility: "ML models, dashboarding, analytics",
          count: "5",
          location: "Riyadh",
        },
        {
          department: "Training & Change Management",
          responsibility: "User training & organizational change management",
          count: "3",
          location: "Mobile",
        },
      ];

  if (!serialized) {
    return {
      ...tDefault,
      members: finalMembers,
      divisions: defaultDivisions,
      additionalContent: "",
    };
  }

  try {
    const parsed = JSON.parse(serialized);

    // Support migration if initials was saved previously
    const parsedMembers = (parsed.members || []).map(
      (m: { icon: string; name: string; role: string; bio: string }) => ({
        icon: m.icon || getIconForJobTitle(m.name || ""),
        name: m.name || "",
        role: m.role || "",
        bio: m.bio || "",
      }),
    );

    return {
      title: parsed.title || tDefault.title,
      subtitle: parsed.subtitle || tDefault.subtitle,
      members: parsedMembers.length > 0 ? parsedMembers : finalMembers,
      divisionsTitle: parsed.divisionsTitle || tDefault.divisionsTitle,
      divisions: parsed.divisions || defaultDivisions,
      additionalContent: parsed.additionalContent || "",
    };
  } catch (_e) {
    return {
      ...tDefault,
      members: finalMembers,
      divisions: defaultDivisions,
      additionalContent: serialized,
    };
  }
}
