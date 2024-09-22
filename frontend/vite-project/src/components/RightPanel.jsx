import { useQuery } from "@tanstack/react-query";
import RightPanelSkeleton from "./skeletons/RightPanelSkeleton";
import UseFollowUser from "./useFollowHook";
import { Link } from "react-router-dom";

const RightPanel = () => {
  const {
    data: suggestions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user/suggestions", {
          method: "GET",
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
  });

  const { follow } = UseFollowUser();
  if (isError) return <div>{error.message}</div>;
  if (isLoading) return <RightPanelSkeleton />;
  return (
    <>
      <div className=" w-[30vw] border-l-[1.5px] border-[#2F3336] sticky top-0 hidden sm:block">
        <div className="h-[8vh] w-[100%] lg:w-[100%] flex justify-center items-center">
          who to follow?
        </div>
        <div className="right-panel w-[100%] lg:w-[70%] mx-auto my-5 flex flex-col items-start gap-3 ">
          {isLoading
            ? suggestions &&
              suggestions.map((user) => {
                return <RightPanelSkeleton key={user._id} />;
              })
            : suggestions &&
              suggestions.map((user) => {
                return (
                  <div
                    key={user._id}
                    className="flex justify-between items-center h-10 object-cover w-full"
                  >
                    <div className="flex justify-between items-center gap-4 w-full">
                      <div className="flex justify-between items-center gap-2 ">
                        <div className="w-8 h-8 rounded-full border-[1.5px] border-[#2F3336]">
                          <img src={`${user.profileImg}`} alt="" className="w-full h-full object-cover rounded-full"/>
                        </div>
                        <div>
                          <Link to={`/profile/${user.username}`}>
                            <p className="text-[12px]">{user.fullName}</p>
                            <p className="text-[12px]">@{user.username}</p>
                          </Link>
                        </div>
                      </div>
                      <div
                        className="text-sm text-black px-3 py-[1.5px] rounded-xl bg-white hover:cursor-pointer"
                        onClick={() => follow(user._id)}
                      >
                        {/* {user.isFollowing ? "Unfollow" : "Follow"} */}
                        follow
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
};

export default RightPanel;
