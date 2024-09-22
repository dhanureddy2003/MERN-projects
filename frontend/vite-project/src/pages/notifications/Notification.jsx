/* eslint-disable no-unused-vars */
import { IoSettingsOutline } from "react-icons/io5";
import { FaTrash, FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import formatDate from "../../utils/date/formatDate.js";

const Notification = () => {
  const queryClient = useQueryClient();
  const {
    data: allNotifications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/notifications/getNotifications`, {
          method: "GET",
        });
        const data = await res.json();
        // console.log(data);
        if (!res.ok) throw new Error(data.error);
        if (data.Error) throw new Error(data.Error);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (notificationId) => {
      try {
        const res = await fetch(
          `/api/notifications/deleteOneNotification/${notificationId}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();
        console.log(deleteNotification[0]?._id);
        if (!res.ok) throw new Error(data.error);
        if (data.Error) throw new Error(data.Error);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
        refetch: true,
      });
    },
  });
  const { mutate: deleteAllNotification } = useMutation({
    mutationFn: async (notificationId) => {
      try {
        const res = await fetch(`/api/notifications/deleteNotification`, {
          method: "get",
        });
        const data = await res.json();
        console.log(deleteNotification[0]?._id);
        if (!res.ok) throw new Error(data.error);
        if (data.Error) throw new Error(data.Error);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Notification deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
        refetch: true,
      });
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p>Error: {isError.message}</p>;
  return (
    <>
      <div className="min-h-[100vh] w-full sm:w-[60%] border-r-[1.5px] border-[#2F3336] overflow-y-hidden">
        <div className="w-full h-[8vh] flex justify-between items-center border-b-[1.5px] border-[#2F3336] px-4">
          <div>
            <h1>Notifications</h1>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a onClick={() => deleteAllNotification()}>
                  Delete all notifications
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* notifications */}

        {allNotifications.length === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <p>No notifications</p>
          </div>
        )}

        {allNotifications.map((notification) => {
          return (
            <div
              key={notification._id}
              className="w-full border-b-[1.5px] border-[#2F3336] "
            >
              <div className="w-full p-2 flex gap-2">
                <div className="h-7 w-7 rounded-full">
                  <Link to={`/profile/${notification.from.username}`}>
                    <img
                      src={`${
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      }`}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  </Link>
                </div>
                <div className=" w-full">
                  <div className=" mb-3 flex justify-between">
                    <div className="flex items-center gap-2">
                      <Link to={`/profile/${notification.from.username}`}>
                        <p className="text-[12px] cursor-pointer">
                          @{notification.from.username}
                        </p>
                      </Link>
                      <p className="text-[12px] ">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    <div>
                      <FaTrash
                        className="fill-red-500 cursor-pointer h-3 w-3"
                        onClick={() => deleteNotification(notification._id)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-[50%]">
                    {notification.type === "like" ? (
                      <FaHeart className="fill-red-500" />
                    ) : (
                      <FaUser className="fill-blue-500" />
                    )}
                    <p className="text-[12px] ">
                      {notification.type === "follow"
                        ? "followed you "
                        : "Liked your post"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Notification;
