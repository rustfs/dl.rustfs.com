import type { ReleaseAsset } from "@/types";

function debVersionFromTag(tag: string) {
  return tag.replace("-", "~");
}

function rpmVersionFromTag(tag: string) {
  return tag.replace("-", "_");
}

export function candidateR2PackageUrls(tag: string): { name: string; url: string }[] {
  const debVersion = debVersionFromTag(tag);
  const rpmVersion = rpmVersionFromTag(tag);

  return [
    {
      name: `rustfs_${debVersion}_amd64.deb`,
      url: `https://dl.rustfs.com/artifacts/rustfs/packages/release/rustfs_${debVersion}_amd64.deb`,
    },
    {
      name: `rustfs_${debVersion}_arm64.deb`,
      url: `https://dl.rustfs.com/artifacts/rustfs/packages/release/rustfs_${debVersion}_arm64.deb`,
    },
    {
      name: `rustfs-${rpmVersion}-1.x86_64.rpm`,
      url: `https://dl.rustfs.com/artifacts/rustfs/packages/release/rustfs-${rpmVersion}-1.x86_64.rpm`,
    },
    {
      name: `rustfs-${rpmVersion}-1.aarch64.rpm`,
      url: `https://dl.rustfs.com/artifacts/rustfs/packages/release/rustfs-${rpmVersion}-1.aarch64.rpm`,
    },
  ];
}

export async function fetchExistingR2Packages(tag: string): Promise<ReleaseAsset[]> {
  const assets: ReleaseAsset[] = [];

  for (const { name, url } of candidateR2PackageUrls(tag)) {
    try {
      const response = await fetch(url, { method: "HEAD" });

      if (!response.ok) {
        continue;
      }

      assets.push({
        url,
        id: 0,
        node_id: "",
        name,
        label: null,
        uploader: null,
        content_type: response.headers.get("content-type") ?? "application/octet-stream",
        state: "uploaded",
        size: Number(response.headers.get("content-length") ?? 0),
        download_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        browser_download_url: url,
        cdn_url: url,
      });
    } catch {
      // Package may not exist for this tag yet; skip it.
    }
  }

  return assets;
}
