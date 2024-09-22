import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
const EditProfileModal = () => {
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState({
    fullName: "",
    username: "",
    email: "",
    link: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
  });

  const { mutate: updatedData, isLoading } = useMutation({
    mutationFn: async ({
      fullName,
      username,
      email,
      link,
      bio,
      currentPassword,
      newPassword,
    }) => {
      try {
        const res = await fetch(`/api/user/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            username,
            email,
            link,
            bio,
            currentPassword,
            newPassword,
          }),
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
      queryClient.invalidateQueries(["userProfile"]);
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-[#2F3336] shadow-md">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              updatedData(formValues);
              document.getElementById("edit_profile_modal").close();
            }}
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                name="fullName"
                onChange={handleChange}
                value={formValues.fullName}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                name="username"
                onChange={handleChange}
                value={formValues.username}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                name="email"
                onChange={handleChange}
                value={formValues.email}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                name="bio"
                onChange={handleChange}
                value={formValues.bio}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                name="currentPassword"
                onChange={handleChange}
                value={formValues.currentPassword}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                name="newPassword"
                onChange={handleChange}
                value={formValues.newPassword}
              />
            </div>
            <input
              type="text"
              placeholder="Link"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              name="link"
              onChange={handleChange}
              value={formValues.link}
            />
            <button className="btn btn-blue rounded-full btn-sm text-white">
              {isLoading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
