import ReleaseCard from '@/components/release';
import { projects } from '@/projects.config';
import { fetchReleases } from '@/scripts/generate-releases';
import { Release } from '@/types';
import fs from 'fs';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import path from 'path';

// 生成静态路径参数
export async function generateStaticParams() {
  await fetchReleases()
  return projects.map(project => ({
    repo: project.repo,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ repo: string }> }) {
  const { repo } = await params;

  // 查找项目信息
  const project = projects.find(p => p.repo === repo);

  if (!project) {
    notFound();
  }

  // 读取存储的 releases 数据
  let releases: Release[] = [];
  try {
    releases = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', repo, 'releases.json'), 'utf8')
    );
  } catch (error) {
    console.error('Failed to load releases data:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-extrabold mb-2">{project.title || repo}</h1>
      {project.description && <p className="text-gray-600 mb-8">{project.description}</p>}

      {project.links.length > 0 ? (
        <div className="space-x-4 mb-8">
          {project.links.map(link => (
            <Link
              key={link.url}
              href={link.url}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}

      {releases.length > 0 ? (
        <div className="space-y-6">
          {releases.map((release, index) => (
            <ReleaseCard key={release.id} project={project} release={release} isLatest={index == 0} />
          ))}
        </div>
      ) : (
        <p>No releases found for this project.</p>
      )}
    </div>
  );
}
