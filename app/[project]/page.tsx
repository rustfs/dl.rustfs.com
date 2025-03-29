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
    project: project.repo,
  }));
}

interface ProjectPageProps {
  params: {
    project: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { project: repo } = await params;

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline flex items-center gap-1">
          ← Back to all projects
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">{project.title || project.repo}</h1>
      {project.description && <p className="text-gray-600 mb-8">{project.description}</p>}

      {releases.length > 0 ? (
        <div className="space-y-6">
          {releases.map(release => (
            <ReleaseCard key={release.id} project={project} release={release} />
          ))}
        </div>
      ) : (
        <p>No releases found for this project.</p>
      )}
    </div>
  );
}
