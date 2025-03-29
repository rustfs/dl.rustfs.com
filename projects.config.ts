import { GithubIcon, LucideIcon, PaperclipIcon } from "lucide-react";

export interface Project {
  repo: string;
  title: string;
  description: string;
  links: { label: string, url: string, icon?: LucideIcon }[]
}

export const projects: Project[] = [
  {
    repo: "s3-rustfs",
    title: "控制台",
    description: "RustFS 服务器和 GUI，支持 S3 协议的文件系统。",
    links: [
      { label: "Source", url: "https://github.com/rustfs/s3-rustfs", icon: GithubIcon },
      // { label: "Latest Version", url: "https://dl.rustfs.com/s3-rustfs/latest.zip", icon: PaperclipIcon },
    ]
  },
  {
    repo: "console",
    title: "控制台",
    description: "RustFS 控制台, 您可以使用此控制台便捷的管理您的文件系统，以及账号权限和系统运行状态。",
    links: [
      { label: "Source", url: "https://github.com/rustfs/console", icon: GithubIcon },
      { label: "Latest Version", url: "https://dl.rustfs.com/console/latest.zip", icon: PaperclipIcon },
    ]
  }
]
