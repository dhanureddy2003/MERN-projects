import { FaArrowLeft } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import EditProfileModal from "../../components/EditProfile";
import Posts from "../../components/Posts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import formatDate from "../../utils/date/formatDate";
import UseFollowUser from "../../components/useFollowHook";
import toast from "react-hot-toast";

const Profile = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [feedType, setFeedType] = useState("Posts");
  const { username } = useParams();

  const queryClient = useQueryClient();

  // Fetch user info from server
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
  });

  // Mutation to update profile or cover image
  const { mutate: updateImg, isLoading: isUpdatingImg } = useMutation({
    mutationFn: async ({ profileImg, coverImg }) => {
      const res = await fetch(`/api/user/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImg, coverImg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    // Optimistic updates
    onSuccess: (data) => {
      // Optimistically update user profile data
      queryClient.setQueryData(["userProfile", username], (oldData) => ({
        ...oldData,
        profileImg: data.profileImg,
        coverImg: data.coverImg,
      }));

      // Ensure that the data is fresh
      queryClient.invalidateQueries(["userProfile", username]);
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Fetch the user's profile data
  const {
    data: userData,
    isLoading: isUserDataLoading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const res = await fetch(`/api/user/profile/${username}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    enabled: !!username,
  });

  useEffect(() => {
    if (username) refetch();
  }, [username, refetch]);

  const updateProfileImg = () => {
    updateImg({ profileImg, coverImg });
  };

  const fileInputRef = {
    profileImg: useRef(null),
    coverImg: useRef(null),
  };

  const handleClick = (state) => {
    fileInputRef[state].current.click();
  };

  const handleChange = (e, state) => {
    const file = e.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      // 10MB size limit
      alert("File size exceeds 10MB");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        state === "profileImg"
          ? setProfileImg(reader.result)
          : setCoverImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { follow } = UseFollowUser();
  const isMyProfile = user?._id === userData?._id;

  return (
    <div className="h-screen w-full sm:w-[60%]">
      {!isUserLoading && !isUserDataLoading && userData && (
        <>
          {/* Header */}
          <div className="w-full h-[8vh] flex gap-3 items-center">
            <Link to="/">
              <FaArrowLeft className="w-4 h-4 hidden lg:block" />
            </Link>
            <div>
              <Link to={`/profile/${userData.username}`}>
                <p className="font-bold text-[14px]">{user?.fullName}</p>
              </Link>
              <span className="text-[10px] text-slate-500">
                {user.posts.length} posts
              </span>
            </div>
          </div>

          {/* Cover Image & Profile Image */}
          <div className="w-full h-[25vh] border-b-[1.5px] border-[#2F3336] relative">
            {userData.coverImg && (
              <img
                src={userData.coverImg}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            {isMyProfile && (
              <MdEdit
                className="w-4 h-4 absolute top-1 right-1 cursor-pointer"
                onClick={() => handleClick("coverImg")}
              />
            )}
            <div className="h-28 w-28 rounded-full border-[1.5px] border-[#2F3336] absolute -bottom-14 left-4 overflow-hidden group">
              <img
                src={userData.profileImg || "/avatar-placeholder.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {isMyProfile && (
                <div className="w-5 h-5 rounded-full bg-blue-400 absolute top-3 right-2 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <MdEdit
                    className="w-3 h-3"
                    onClick={() => handleClick("profileImg")}
                  />
                </div>
              )}
            </div>
          </div>

          <input
            type="file"
            hidden
            ref={fileInputRef.coverImg}
            onChange={(e) => handleChange(e, "coverImg")}
          />
          <input
            type="file"
            hidden
            ref={fileInputRef.profileImg}
            onChange={(e) => handleChange(e, "profileImg")}
          />

          {/* Profile Details */}
          <div className="w-full px-4">
            <div className="w-full h-[8vh] p-2 flex gap-2 justify-end">
              {isMyProfile ? (
                <EditProfileModal />
              ) : (
                <button
                  onClick={() => follow(userData?._id)}
                  className="px-4 h-10 bg-[#1D9BF0] rounded-3xl"
                >
                  {user?.following?.includes(userData?._id)
                    ? "unfollow"
                    : "follow"}
                </button>
              )}
              {(profileImg || coverImg) && isMyProfile && (
                <button
                  onClick={updateProfileImg}
                  className="px-4 bg-[#1D9BF0] rounded-3xl"
                >
                  {isUpdatingImg ? "updating..." : "update"}
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="w-full py-2">
              <p className="font-bold text-[14px]">{userData?.fullName}</p>
              <p className="text-[10px] text-slate-500">
                @{userData?.username}
              </p>
              <p className="text-[10px] text-slate-500">{userData?.bio}</p>
              <a
                href={userData?.link}
                className="text-[10px] text-slate-500 flex gap-1 items-center"
                target="_blank"
                rel="noreferrer"
              >
                <FaLink /> {userData?.link}
              </a>
              <p className="text-[10px] text-slate-500 flex gap-1 items-center">
                <IoCalendarOutline /> Joined {formatDate(userData.createdAt)}
              </p>
              <p className="text-[10px] text-slate-500 flex gap-1 items-center">
                <span>{userData?.following.length} following</span>
                <span>{userData?.followers.length} followers</span>
              </p>
            </div>
          </div>

          {/* Feed Type Toggle */}
          <div className="w-[100%] h-[8vh] flex border-b-[1.5px] border-[#2F3336]">
            <div
              className={`flex justify-center items-center w-[50%] relative hover:bg-[#181818] cursor-pointer`}
              onClick={() => setFeedType("Posts")}
            >
              Posts
              {feedType === "Posts" && (
                <div className="bg-[#1D9BF0] bottom-0 w-10 h-1 rounded-lg absolute"></div>
              )}
            </div>
            <div
              className={`flex justify-center items-center w-[50%] relative hover:bg-[#181818] cursor-pointer`}
              onClick={() => setFeedType("Likes")}
            >
              Likes
              {feedType === "Likes" && (
                <div className="bg-[#1D9BF0] bottom-0 w-10 h-1 rounded-lg absolute"></div>
              )}
            </div>
          </div>
          <Posts feedType={feedType} />
        </>
      )}
    </div>
  );
};

export default Profile;
