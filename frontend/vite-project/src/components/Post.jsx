/* eslint-disable no-unused-vars */
import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { IoMdHeartEmpty } from "react-icons/io";
import { CiBookmark } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner.jsx";
import formatDate from "../utils/date/formatDate.js";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const postOwner = post.user || {};

  const queryClient = useQueryClient();

  const { data: user } = useQuery({ queryKey: ["user"] });

  const isMyPost = user?._id === postOwner._id;

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.error) throw new Error(data.error);
      } catch (error) {
        console.log(error);
        throw Error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Posts"] });
    },
  });

  const {
    mutate: commentOnPost,
    isLoading: isCommenting,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text }) => {
      try {
        const res = await fetch(`/api/post/comment/${post._id}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ text }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.error) throw new Error(data.error);
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw Error;
      }
    },
    onSuccess: () => {
      toast.success("comment posted");
      queryClient.invalidateQueries({ queryKey: ["Posts"] });
    },
  });

  const { mutate: likeDislike } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/likeDislike/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.error) throw new Error(data.error);
        return data;
      } catch (error) {
        console.log(error);
        throw Error;
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["Posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId) => {
      try {
        const res = await fetch(
          `/api/post/${post._id}/deleteComment/${commentId}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.error) throw new Error(data.error);
        return data;
      } catch (error) {
        console.log(error);
        throw Error;
      }
    },
    onSuccess: () => {
      toast.success("comment deleted");
      queryClient.invalidateQueries({ queryKey: ["Posts"] });
    },
  });

  const handleComment = (e) => {
    e.preventDefault();
    commentOnPost({ text: comment });
    setComment("");
  };
  const handleDelete = () => {
    deletePost();
  };

  const handleLikeDislike = () => {
    likeDislike();
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId);
  };

  return (
    <>
      <div className="w-full p-2 border-b-[1.5px] border-[#2F3336]">
        {/* Post Content */}
        <div className="w-full flex gap-3">
          <div className="w-7 h-7 rounded-full">
            {postOwner.username && (
              <Link to={`/profile/${postOwner.username}`}>
                <img
                  src={postOwner.profileImg || "/avatars/boy1.png"}
                  alt={postOwner.username}
                  className="w-full h-full object-cover rounded-full"
                />
              </Link>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex items-center justify-between">
              <div className="flex gap-2 items-center">
                {postOwner.username && (
                  <Link to={`/profile/${postOwner.username}`}>
                    <p>{postOwner.username}</p>
                  </Link>
                )}
                {postOwner.fullName && (
                  <Link to={`/profile/${postOwner.username}`}>
                    <p className="text-gray-700 text-[12px]">
                      @{postOwner.fullName}
                    </p>
                  </Link>
                )}
                <p className="text-gray-700 text-[12px]">
                  {formatDate(post.createdAt)}
                </p>
              </div>
              {isMyPost && (
                <div className="hover:cursor-pointer">
                  <FaTrash
                    className="text-gray-700 h-3 w-3"
                    onClick={() => {
                      handleDelete();
                    }}
                  />
                </div>
              )}
            </div>
            {/* postImg */}
            {post.img && (
              <div className="w-full">
                <img
                  src={`${post.img}`}
                  alt={postOwner.username}
                  className="h-60 object-contain rounded-lg"
                />
              </div>
            )}
            {/* postText */}
            <div>{post.text}</div>

            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex gap-1 items-center">
                  <FaRegComment
                    className="h-5 w-5 fill-[#313436] hover:fill-[#1D9BF0]"
                    onClick={() =>
                      document
                        .getElementById(`comments_modal_${post._id}`)
                        .showModal()
                    } // Trigger modal
                  />
                  <p className="text-[#313436]">{post.comments?.length || 0}</p>
                </div>
                <div className="flex gap-1 items-center">
                  <BiRepost className="h-7 w-7 fill-[#313436] hover:fill-[#1D9BF0]" />
                </div>
                <div className="flex gap-1 items-center cursor-pointer">
                  <IoMdHeartEmpty
                    className={`h-5 w-5 fill-[#313436] ${
                      post.likes.includes(user._id) ? "fill-pink-500" : ""
                    } `}
                    onClick={handleLikeDislike}
                  />
                  <p
                    className={`${
                      post.likes.includes(user._id)
                        ? "text-pink-500"
                        : "text-[#313436]"
                    }`}
                  >
                    {post.likes?.length || 0}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <CiBookmark className="h-5 w-5 fill-[#313436] hover:fill-[#1D9BF0]" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Comments */}
        <dialog id={`comments_modal_${post?._id}`} className="modal">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() =>
                document.getElementById(`comments_modal_${post._id}`).close()
              }
            >
              ✕
            </button>

            <h3 className="font-bold text-lg">Comments</h3>
            <div className="py-4">
              {post.comments.length === 0 && <p>No Comments yet..</p>}
              {post.comments.map((comment) => (
                <div key={comment._id} className="flex gap-2 items-start my-3">
                  <div className="flex items-start gap-2">
                    <Link to={`/profile/${comment.user.username}`}>
                      <img
                        src={`${
                          comment.user.profileImg || "/avatars/boy1.png"
                        }`}
                        alt=""
                        className="w-10 h-10 rounded-full object-contain"
                      />
                    </Link>
                  </div>
                  <div className="relative w-full pr-2">
                    <p className="text-[15px] text-[#616466]">
                      {comment.user.username}
                    </p>
                    <p className="text-[13px] text-[#848788] ">
                      {comment.text}
                    </p>
                    {comment.user._id === user._id && (
                      <FaTrash
                        className="text-gray-700 h-3 w-3 absolute right-0 top-[20%] hover:cursor-pointer"
                        onClick={() => {
                          handleDeleteComment(comment._id);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Submission Form */}
            <form
              className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
              onSubmit={handleComment}
            >
              <textarea
                className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
              </button>
            </form>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default Post;
