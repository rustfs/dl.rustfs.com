import { GithubIcon, LucideIcon, PaperclipIcon } from "lucide-react";

export interface Project {
  repo: string;
  title: string;
  description: string;
  links: { label: string, url: string, icon?: LucideIcon }[]
}

export const projects: Project[] = [
  {
    repo: "rustfs",
    title: "Server",
    description: "RustFS server and GUI, a file system compatible with the S3 protocol.",
    links: [
      { label: "Source", url: "https://github.com/rustfs/s3-rustfs", icon: GithubIcon },
      // { label: "Latest Version", url: "https://dl.rustfs.com/s3-rustfs/latest.zip", icon: PaperclipIcon },
    ]
  },
  {
    repo: "console",
    title: "Console",
    description: "RustFS Console, use it to conveniently manage your file system, account permissions, and system status.",
    links: [
      { label: "Source", url: "https://github.com/rustfs/console", icon: GithubIcon },
      { label: "Latest Version", url: "https://dl.rustfs.com/artifacts/console/rustfs-console-latest.zip", icon: PaperclipIcon },
    ]
  },
  {
    repo: "cli",
    title: "CLI",
    description: "RustFS CLI, use it to conveniently manage your file system, account permissions, and system status.",
    links: [
      { label: "Source", url: "https://github.com/rustfs/cli", icon: GithubIcon },
      { label: "Latest Version", url: "https://dl.rustfs.com/artifacts/rustfs-cli/rustfs-cli-latest.zip", icon: PaperclipIcon },
    ]
  }
]
