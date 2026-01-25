import ProjectHero from "@/components/projects/project-hero";
import ReleasesSection from "@/components/projects/releases-section";
import PageBackground from "@/components/page-background";
import { projects } from "@/projects.config";
import { fetchReleases } from "@/scripts/generate-releases";
import { Release } from "@/types";
import fs from "fs";
import { notFound } from "next/navigation";
import path from "path";

// 生成静态路径参数
export async function generateStaticParams() {
  await fetchReleases();
  return projects.map((project) => ({
    repo: project.repo,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ repo: string }>;
}) {
  const { repo } = await params;

  // 查找项目信息
  const project = projects.find((p) => p.repo === repo);

  if (!project) {
    notFound();
  }

  // 读取存储的 releases 数据
  let releases: Release[] = [];
  try {
    releases = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "data", repo, "releases.json"),
        "utf8"
      )
    );
  } catch (error) {
    console.error("Failed to load releases data:", error);
  }

  return (
    <PageBackground className="relative">
      <div className="mx-auto flex max-w-5xl flex-col px-6 pb-16 pt-10">
        <div className="grid grid-cols-12 gap-px border border-border/60 bg-border/60">
          <ProjectHero project={project} releasesCount={releases.length} />
          <ReleasesSection project={project} releases={releases} />
        </div>
      </div>
    </PageBackground>
  );
}
