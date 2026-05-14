import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('published', true);

  const postUrls = (posts || []).map((post) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blogsy.vercel.app'}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blogsy.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
  ];
}
