'use client';

import { useState } from 'react';

import PostCard from '@/components/posts/post-card';
import { Post } from '@/types/post';

const INITIAL_NUM_POSTS = 6;
const ADDITIONAL_NUM_POSTS = 6;

export default function RelatedPosts({ posts }: { posts: Post[] }) {
  const [numPosts, setNumPosts] = useState(INITIAL_NUM_POSTS);

  const handleLoadMore = () => {
    setNumPosts((prevNumPosts) => prevNumPosts + ADDITIONAL_NUM_POSTS);
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col mt-10">
      <h1 className="text-3xl font-bold">Related Posts</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {posts.slice(0, numPosts).map((post) => (
          <div
            key={post.slug}
            className="scale-[0.8] transition-all duration-300 hover:scale-[0.85]"
          >
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          </div>
        ))}
      </ul>
      {numPosts < posts.length && (
        <button
          onClick={handleLoadMore}
          className="self-center px-8 py-2 mt-10 text-white transition-all duration-300 rounded-3xl bg-ok opacity-70 dark:opacity-100 dark:hover:opacity-90 hover:scale-110 hover:opacity-100"
        >
          Load More
        </button>
      )}
    </section>
  );
}
