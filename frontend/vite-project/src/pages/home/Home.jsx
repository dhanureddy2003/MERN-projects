import { useState } from "react";
import CreatePost from "./CreatePost";
import Posts from "../../components/Posts";

const Home = () => {
  const [feedType, setFeedType] = useState("For you");
  
  return (
    <>
      <div className="h-screen w-full sm:w-[60%] border-r-[1.5px] border-[#2F3336] ">
        <div className="w-full h-[8vh] flex border-b-[1.5px] border-[#2F3336]">
          <div
            className={`flex justify-center items-center w-[50%] relative hover:bg-[#181818] `}
            onClick={() => setFeedType("For you")}
          >
            For you
            {feedType === "For you" && (
              <div className="bg-[#1D9BF0] bottom-0 w-10 h-1 rounded-lg absolute"></div>
            )}
          </div>
          <div
            className={`flex justify-center items-center w-[50%] relative hover:bg-[#181818]`}
            onClick={() => setFeedType("following")}
          >
            following
            {feedType === "following" && (
              <div className="bg-[#1D98F0] bottom-0 w-10 h-1 rounded-lg absolute"></div>
            )}
          </div>
        </div>
        <CreatePost />
        <Posts feedType={feedType} />
      </div>
    </>
  );
};

export default Home;

