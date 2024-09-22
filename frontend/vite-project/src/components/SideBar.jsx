// /* eslint-disable no-unused-vars */
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import XSvg from "./X";
// import { MdHomeFilled } from "react-icons/md";
// import { IoNotifications } from "react-icons/io5";
// import { FaUser } from "react-icons/fa";
// import { FiSearch } from "react-icons/fi";
// import { BiLogOut } from "react-icons/bi";
// import { FiMenu } from "react-icons/fi"; // Import Hamburger Icon
// import { useState } from "react"; // State to manage menu visibility
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";

// const SideBar = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [isOpen, setIsOpen] = useState(false); // State to handle hamburger toggle

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen); // Toggle the sidebar visibility
//   };

//   const { mutate, isPending, isError, error } = useMutation({
//     mutationFn: async () => {
//       try {
//         const res = await fetch("/api/auth/logout", {
//           method: "POST",
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error);
//         if (data.error) throw new Error(data.error);
//       } catch (error) {
//         console.log(error);
//         throw error;
//       }
//     },
//     onSuccess: () => {
//       toast.success("Logged out successfully");
//       queryClient.invalidateQueries({ queryKey: ["user"] });
//       navigate("/login");
//     },
//     onError: (error) => {
//       toast.error(error.message);
//     },
//   });

//   const { data: user } = useQuery({ queryKey: ["user"] });

//   return (
//     <>
//       {/* Hamburger Icon (visible on smaller screens) */}
//       <div className="lg:hidden p-4">
//         <FiMenu
//           className="text-2xl text-white cursor-pointer absolute top-4 left-4"
//           onClick={toggleSidebar}
//         />
//       </div>

//       {/* Sidebar (hidden by default on smaller screens) */}
//       <div
//         className={`${
//           isOpen ? "block" : "hidden"
//         } lg:block w-[15vw] min-h-screen border-r-[1.5px] border-[#2F3336] sticky top-0 overflow-y-hidden bg-black lg:bg-transparent`}
//       >
//         <div className="ml-3 flex flex-col justify-between h-screen">
//           <div className="flex flex-col gap-4 justify-center items-end">
//             <div className="w-12 h-12 ">
//               <Link to="/" className="">
//                 <XSvg className="px-2 rounded-full fill-white hover:bg-stone-900" />
//               </Link>
//             </div>
//             <ul className="flex flex-col gap-4 w-full items-end ">
//               <NavLink to="/">
//                 <li className="flex gap-2">
//                   <span className="mx-2">
//                     <MdHomeFilled className="h-7 w-7" />
//                   </span>
//                 </li>
//               </NavLink>
//               <NavLink to="/search">
//                 <li className="flex gap-2">
//                   <span className="mx-2">
//                     <FiSearch className="h-7 w-7" />
//                   </span>
//                 </li>
//               </NavLink>
//               <NavLink to="/notifications">
//                 <li className="flex gap-1">
//                   <span className="mx-2">
//                     <IoNotifications className="h-7 w-7" />
//                   </span>
//                 </li>
//               </NavLink>
//               <NavLink to={`/profile/${user?.username}`}>
//                 <li className="flex gap-1">
//                   <span className="mx-2">
//                     <FaUser className="h-7 w-7" />
//                   </span>
//                 </li>
//               </NavLink>
//             </ul>
//           </div>
//           <div className="flex justify-end lg:justify-center items-center h-10 gap-2 object-cover">
//             <div className="flex justify-center items-center gap-2 ">
//               <div className="w-8 h-8 rounded-full hidden lg:block">
//                 <img
//                   src={user?.profileImg || "/avatar-placeholder.png"}
//                   alt="profile"
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               </div>
//               <Link to={`/profile/${user?.username}`}>
//                 <div className="cursor-pointer hidden lg:block">
//                   <p className="text-[12px]">{user?.fullName}</p>
//                   <p className="text-[12px]">@{user?.username}</p>
//                 </div>
//               </Link>
//               <div>
//                 <BiLogOut
//                   className="w-6 h-6 fill-white transition-all duration-2s cursor-pointer"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     mutate();
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SideBar;

/* eslint-disable no-unused-vars */
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa6";
import XSvg from "./X";
import { GoHome } from "react-icons/go";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { FiSearch, FiMenu } from "react-icons/fi"; // Import Hamburger Icon
import { BiLogOut } from "react-icons/bi";
import { useState } from "react"; // State to manage menu visibility
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SideBar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false); // State to handle sidebar visibility

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar visibility
  };

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.error) throw new Error(data.error);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: user } = useQuery({ queryKey: ["user"] });

  return (
    <>
      {/* Hamburger Icon (visible on screens smaller than md) */}
      <div className="lg:hidden p-4">
        <FiMenu
          className="text-2xl text-white cursor-pointer fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        />
      </div>

      {/* Sidebar (absolute and covers the screen when open on screens smaller than md) */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block lg:sticky fixed top-0 left-0 w-[40vw] min-h-screen bg-black lg:border-r-[1.5px] border-[#2F3336] z-50 overflow-hidden md:w-[25vw] lg:w-[15vw]`}
      >
        {/* Close Icon (only visible when sidebar is open on smaller screens) */}
        {isOpen && (
          <div className="lg:hidden absolute top-2 left-4">
            <IoCloseSharp
              className="text-white text-3xl cursor-pointer"
              onClick={toggleSidebar}
            />
          </div>
        )}

        <div className="ml-3 flex flex-col justify-between h-screen">
          <div className="flex flex-col gap-4 justify-center items-end">
            <div className="w-12 h-12">
              <Link to="/">
                <XSvg className="px-2 rounded-full fill-white hover:bg-stone-900" />
              </Link>
            </div>
            <ul className="flex flex-col gap-4 w-full items-end">
              <NavLink to="/">
                <li className="flex gap-2">
                  <span className="mx-2">
                    <GoHome className="h-7 w-7" />
                  </span>
                </li>
              </NavLink>
              <NavLink to="/search">
                <li className="flex gap-2">
                  <span className="mx-2">
                    <FiSearch className="h-7 w-7" />
                  </span>
                </li>
              </NavLink>
              <NavLink to="/notifications">
                <li className="flex gap-1">
                  <span className="mx-2">
                    <IoMdNotificationsOutline className="h-7 w-7" />
                  </span>
                </li>
              </NavLink>
              <NavLink to={`/profile/${user?.username}`}>
                <li className="flex gap-1">
                  <span className="mx-2">
                    <FaRegUser className="h-7 w-7" />
                  </span>
                </li>
              </NavLink>
            </ul>
          </div>

          {/* Logout section */}
          <div className="flex justify-end lg:justify-center items-center h-10 gap-2 object-cover">
            <div className="flex justify-center items-center gap-2">
              <div className="w-8 h-8 rounded-full">
                <img
                  src={user?.profileImg || "/avatar-placeholder.png"}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <Link to={`/profile/${user?.username}`}>
                <div className="cursor-pointer ">
                  <p className="text-[12px]">{user?.fullName}</p>
                  <p className="text-[12px]">@{user?.username}</p>
                </div>
              </Link>
              <div>
                <BiLogOut
                  className="w-6 h-6 fill-white transition-all duration-2s cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    mutate();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open (visible only on screens smaller than md) */}
      {isOpen && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default SideBar;
