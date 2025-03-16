import { projects } from '@/projects.config';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">RustFS Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link
            href={`/${project.repo}`}
            key={project.repo}
            className="border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">{project.title || project.repo}</h2>
            {project.description && <p className="text-gray-600">{project.description}</p>}
            <p className="mt-4 text-blue-600">View releases →</p>
          </Link>
        ))}
      </div>
      {projects.length === 0 && <p>No projects available.</p>}
    </div>
  );
}
