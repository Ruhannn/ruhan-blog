import { getRecordMap, mapImageUrl } from '@/libs/notion';
import { Post } from '@/types/post';
import { getBlurImage } from '@/utils/get-blur-image';

export async function getAllPostsFromNotion(): Promise<Post[]> {
  try {
    const allPosts: Post[] = [];
    const recordMap = await getRecordMap(process.env.NOTION_DATABASE_ID!);
    const { block, collection } = recordMap;
    const schema = Object.values(collection)[0].value.schema;
    const propertyMap: Record<string, string> = {};

    Object.keys(schema).forEach((key) => {
      propertyMap[schema[key].name] = key;
    });

    Object.keys(block).forEach((pageId) => {
      const pageBlock = block[pageId]?.value;
      if (
        pageBlock?.type === 'page' &&
        // @ts-ignore

        pageBlock?.properties?.[propertyMap['Slug']]
      ) {
        const { properties, last_edited_time } = pageBlock;

        const contents = pageBlock.content || [];
        const dates = contents
          .map((content) => block[content]?.value?.last_edited_time)
          .filter(Boolean);
        dates.push(last_edited_time);
        dates.sort((a, b) => b - a);
        const lastEditedAt = dates[0];

        const id = pageId;
        // @ts-ignore
        const slug = properties?.[propertyMap['Slug']]?.[0]?.[0] || '';
        // @ts-ignore
        const title = properties?.[propertyMap['Page']]?.[0]?.[0] || '';
        const categories = (
          // @ts-ignore
          properties?.[propertyMap['Category']]?.[0]?.[0] || ''
        ).split(',');
        const cover =
        // @ts-ignore

          properties?.[propertyMap['Cover']]?.[0]?.[1]?.[0]?.[1] || '';
        const date =
        // @ts-ignore

          properties?.[propertyMap['Date']]?.[0]?.[1]?.[0]?.[1]?.[
            'start_date'
          ] || '';
        const published =
        // @ts-ignore

          properties?.[propertyMap['Published']]?.[0]?.[0] === 'Yes' || false;

        allPosts.push({
          id,
          title,
          slug,
          categories,
          cover: mapImageUrl(cover, pageBlock) || '',
          date,
          published,
          lastEditedAt,
        });
      }
    });

    const blurImagesPromises = allPosts.map((post) => getBlurImage(post.cover));
    const blurImages = await Promise.all(blurImagesPromises);
    allPosts.forEach((post, i) => (post.blurUrl = blurImages[i]?.base64 ?? ''));

    return allPosts;
  } catch (error) {
    // Handle error appropriately, e.g., logging or throwing
    console.error('Error fetching posts from Notion:', error);
    throw error;
  }
}
