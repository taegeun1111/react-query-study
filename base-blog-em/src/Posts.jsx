import {useEffect, useState} from "react";

import {PostDetail} from "./PostDetail";
import {useQuery, useQueryClient} from "@tanstack/react-query";

const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["post", nextPage], () => fetchPosts(nextPage))
    }
  }, [currentPage])

  // replace with useQuery
  const {data, isError, isLoading} = useQuery(["posts", currentPage], () => fetchPosts(currentPage), {
    staleTime: 5000,
    keepPreviousData : true
  });
  /*
  5초 동안은 캐시뎅
   */
  if (isLoading) return <h3>Loading</h3>;

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prevState) => prevState - 1)
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prevState) => prevState + 1)
          }}
        >
          Next page
        </button>
      </div>
      <hr/>
      {selectedPost && <PostDetail post={selectedPost}/>}
    </>
  );
}
