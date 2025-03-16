export type Release = {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string | null;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string | null;
  assets: ReleaseAsset[];
  tarball_url: string | null;
  zipball_url: string | null;
  body: string | null;
  author: User;
  mentions_count?: number;
  reactions?: Reactions;
  discussion_url?: string;
}

export type ReleaseAsset = {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string | null;
  uploader: User | null;
  content_type: string;
  state: 'uploaded' | 'open';
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
}

export type User = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export type Reactions = {
  url: string;
  total_count: number;
  '+1': number;
  '-1': number;
  laugh: number;
  confused: number;
  heart: number;
  hooray: number;
  rocket: number;
  eyes: number;
}
