import { Github, FileText, Globe, User, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ProjectLink {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

export const projectLinks: ProjectLink[] = [
  {
    icon: Tag,
    label: "Version",
    value: "version",
    href: "https://github.com/odest/JotPad/releases/latest",
  },
  {
    icon: FileText,
    label: "License",
    value: "GPLv3",
    href: "https://github.com/odest/JotPad/tree/master?tab=GPL-3.0-1-ov-file",
  },
  {
    icon: User,
    label: "Developer",
    value: "odest",
    href: "https://github.com/odest",
  },
  {
    icon: Github,
    label: "Source Code",
    value: "GitHub",
    href: "https://github.com/odest/JotPad",
  },
  {
    icon: Globe,
    label: "Project Website",
    value: "jotpad.odest.tech",
    href: "https://jotpad.odest.tech/",
  },
];

export const GITHUB_REPO_API_LATEST_RELEASE = "https://api.github.com/repos/odest/JotPad/releases/latest"; 