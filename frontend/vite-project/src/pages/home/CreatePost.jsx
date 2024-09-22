import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const {data : user} = useQuery({queryKey:['user']})

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const {
    mutate: createPost,
    isError,
    isLoading,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/post/createPost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      setText("");
      toast.success("Post created successfully");

      // Ensure correct query key and force refetch
      queryClient.invalidateQueries({
        queryKey: ["Posts"],
        refetchType: "force",
      });
    },
  });

  const handleCreatePost = () => {
    if (text || img) {
      createPost({ text, img });
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full object-cover">
          { user.profileImg && (
            <img src={user.profileImg} className="w-full" />
          )
          }
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full">
        <textarea
          className="textarea w-full p-0 text-lg bg-transparent resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="relative w-72 mx-auto overflow-x-hidden">
          {img && (
            <>
              <IoCloseSharp
                className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                onClick={() => {
                  setImg(null);
                  fileInputRef.current.value = null;
                }}
              />
              <img
                src={img}
                className="w-full mx-auto h-auto object-contain rounded"
              />
            </>
          )}
        </div>

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              onClick={handleClick}
              className="fill-[#1D9BF0] w-6 h-6 cursor-pointer"
            />
            <BsEmojiSmileFill className="fill-[#1D9BF0] w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={onFileChange}
          />
          <button
            onClick={handleCreatePost}
            className="btn bg-[#1D9BF0] rounded-full btn-sm text-white px-4"
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};

export default CreatePost;
