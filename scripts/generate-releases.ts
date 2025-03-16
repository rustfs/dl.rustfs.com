import { getReleases } from '@/lib/github';
import { projects } from '@/projects.config';
import fs from 'fs/promises';
import path from 'path';

export async function fetchReleases() {
  const org = 'rustfs';

  console.log(`Fetching releases for ${projects.length} projects from ${org}...`);

  try {

    // 确保 data/repo 目录存在
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });

    for (const project of projects) {
      console.log(`Fetching ${org}/${project.repo}...`);

      // 确保 data/repo 目录存在
      await fs.mkdir(path.join(process.cwd(), 'data', project.repo), { recursive: true });

      // 如果文件更新时间小于 1 小时，则跳过
      const releasesPath = path.join(process.cwd(), 'data', project.repo, 'releases.json');

      try {
        const stats = await fs.stat(releasesPath);
        if (Date.now() - stats.mtime.getTime() < 60 * 60 * 1000) {
          console.log(`⏭ Skipping ${project.repo} as the data was updated less than an hour ago`);
          continue;
        }
      } catch (error) {
        console.error(`❌ Error checking file stats for ${project.repo}:`, error);
      }

      try {
        const releases = await getReleases(project.repo);
        await fs.writeFile(
          path.join(process.cwd(), 'data', project.repo, 'releases.json'),
          JSON.stringify(releases, null, 2),
          'utf8'
        );
        console.log(`✅ Successfully saved releases data for ${project.repo}`);
      } catch (error) {
        console.error(`❌ Error fetching releases for ${project.repo}:`, error);
      }
    }

    console.log(`✅ Successfully saved releases data for ${projects.length} projects`);
  } catch (error) {
    console.error('❌ Error fetching releases:', error);
    process.exit(1);
  }
}

fetchReleases();
