/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Source {
  id: string;
  name: string;
  type: 'rss' | 'social';
  url: string;
  language: string;
  credibilityTier: 'A' | 'B' | 'C';
  pollInterval: number; // in minutes
  active: boolean;
  lastFetchedAt?: string;
  errorCount: number;
}

export interface RawItem {
  id: string;
  sourceId: string;
  sourceName: string;
  rawTitle: string;
  rawBody: string;
  rawUrl: string;
  rawImageUrl?: string;
  fetchedAt: string;
}

export interface Citation {
  sourceName: string;
  url: string;
  credibilityTier: 'A' | 'B' | 'C';
}

export interface Story {
  id: string;
  canonicalTitle: string;
  aiBody: string;
  category: 'জাতীয়' | 'আন্তর্জাতিক' | 'ব্যবসা-বাণিজ্য' | 'খেলাধুলা' | 'বিনোদন' | 'বিজ্ঞান-প্রযুক্তি';
  tags: string[];
  entities: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  confidenceScore: number; // 0 to 100
  sources: Citation[];
  createdAt: string;
  imageUrl?: string;
  imagePrompt?: string;
  photocardTitle?: string;
  photocardTemplate?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface PublishLog {
  id: string;
  storyId: string;
  storyTitle: string;
  channel: 'Portal' | 'Facebook' | 'Telegram' | 'X';
  status: 'queued' | 'published' | 'failed';
  publishedAt?: string;
  platformPostId?: string;
  errorLog?: string;
  likes: number;
  shares: number;
  clicks: number;
}

export interface ChannelSettings {
  id: string;
  platform: 'Portal' | 'Facebook' | 'Telegram' | 'X';
  accountRef: string;
  connected: boolean;
  categoryMap: string[]; // enabled categories
  maxPostsPerHour: number;
}

export interface PipelineStats {
  status: 'idle' | 'scraping' | 'processing';
  lastRunAt?: string;
  processedCount: number;
  failedCount: number;
  totalTokensUsed: number;
  approximateCost: number; // USD
}
