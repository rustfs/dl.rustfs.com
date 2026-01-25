import ReleaseCard from "@/components/release";
import { Button } from "@/components/ui/button";
import { projects } from "@/projects.config";
import { fetchReleases } from "@/scripts/generate-releases";
import { Release } from "@/types";
import { DownloadCloud } from "lucide-react";
import fs from "fs";
import Link from "next/link";
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
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100">
      <div className="mx-auto flex max-w-5xl flex-col px-6 pb-16 pt-10">
        <div className="grid grid-cols-12 gap-px border border-border/60 bg-border/60">
          <section className="col-span-12 bg-background/80 p-8 backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {project.title || repo}
                </h1>
                {project.description ? (
                  <p className="text-base text-muted-foreground">
                    {project.description}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <DownloadCloud className="h-3.5 w-3.5" />
                {releases.length} releases
              </div>
            </div>
            <div className="pt-4">
              {project.links.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {project.links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Button
                        key={link.url}
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Link
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {Icon ? <Icon className="h-4 w-4" /> : null}
                          {link.label}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No links added.</p>
              )}
            </div>
          </section>

          {releases.length > 0 ? (
            <section className="col-span-12 bg-border/60">
              <div className="grid grid-cols-12 gap-px">
                {releases.map((release, index) => (
                  <div
                    key={release.id}
                    className="col-span-12 bg-background/80 backdrop-blur"
                  >
                    <ReleaseCard
                      project={project}
                      release={release}
                      isLatest={index === 0}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="col-span-12 bg-background/80 p-8 text-sm text-muted-foreground backdrop-blur">
              No releases found for this project.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
