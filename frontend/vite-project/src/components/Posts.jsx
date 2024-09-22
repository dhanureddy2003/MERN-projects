import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import PostSkeleton from "./skeletons/PostSkeleton";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Posts = ({ feedType }) => {
  const { username } = useParams();
  // Determine which endpoint to hit based on feedType
  const getPostEndpoint = () => {
    if (feedType === "For you") {
      return "/api/post/getPosts";
    } else if (feedType === "following") {
      return "/api/post/follwingPosts";
    } else if (feedType === "Posts") {
      return `/api/post/userPosts/${username} `;
    } else if (feedType === "Likes") {
      return `/api/post/likedPosts`;
    }
  };

  const postEndpoint = getPostEndpoint();

  // Fetch posts data using react-query
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["Posts"],
    queryFn: async () => {
      const res = await fetch(postEndpoint);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch posts");
      return data;
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);
  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && data?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}

      {!isLoading && data.length > 0 && (
        <div>
          {data.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
