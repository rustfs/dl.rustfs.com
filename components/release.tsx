import { cdnUrl, formatBytes } from "@/lib/utils";
import { type Release, ReleaseAsset } from "@/types";
import { PaperclipIcon } from 'lucide-react';


import { Project } from "@/projects.config";
import Markdown from "./markdown";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export default function ReleaseCard(props: { project: Project, release: Release, isLatest?: boolean }) {
  const { release, project } = props;

  return (
    <div key={release.id} className="border rounded-lg">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-medium">{release.name || release.tag_name}</h3>
          <div className="font-bold flex gap-2">
            {props.isLatest && <span className="text-xs border bg-green-100 border-green-700 text-green-800 px-3 py-1 rounded-full">Latest</span>}
            {release.prerelease && <span className="text-xs border bg-yellow-100 border-yellow-700 text-yellow-800 px-3 py-1 rounded-full">Pre-release</span>}
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Released on {release.published_at ? new Date(release.published_at).toLocaleDateString() : "Unknown"}
        </p>
      </div>

      {release.body && (
        <div className="bg-muted p-4">
          <Markdown>{release.body}</Markdown>
        </div>
      )}

      {release.assets.length > 0 && (
        <div className="border-t">
          <h3 className="text-lg font-medium p-4">Assets</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">File</TableHead>
                <TableHead className="px-4">Size</TableHead>
                <TableHead className="px-4">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {release.assets.map((asset: ReleaseAsset, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono flex items-center gap-2 px-4">
                    <PaperclipIcon className="w-4 h-4 text-muted-foreground" />
                    {asset.name}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground px-4">{formatBytes(asset.size)}</TableCell>
                  <TableCell className="flex gap-2 px-4">
                    <a href={cdnUrl(`${project.repo}/${release.tag_name}/${asset.name}`)} className="text-blue-600 hover:underline">
                      CDN
                    </a>
                    <a href={asset.browser_download_url} className="text-blue-600 hover:underline">
                      GitHub
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
