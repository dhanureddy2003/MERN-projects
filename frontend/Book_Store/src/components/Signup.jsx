import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Something went wrong");
      }
      toast.success("User created successfully!"); // Handle response data
      // Store user data in state if needed
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div
        id="my_modal_4"
        className="w-full h-screen flex justify-center items-center"
      >
        <div className=" bg-slate-100 w-[22rem] p-10 relative rounded-lg backdrop-blur-lg">
          <form method="div bg-black">
            <button
              onClick={() => navigate("/")}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Sign Up</h3>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <form
            onSubmit={handleSubmit}
            action="/signup"
            className="flex flex-col align-middle"
          >
            <div className="py-4 ">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-slate-800 border-[1.5px] border-solid border-gray-400 rounded-md outline-none pl-2 py-1 w-full min-w-[250px]"
                required
              />
            </div>
            <div className="py-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 "
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-slate-800 border-[1.5px] border-solid border-gray-400 rounded-md outline-none pl-2 py-1 w-full min-w-[250px]"
                required
              />
            </div>
            <div className="py-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 "
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white text-slate-800 border-[1.5px] border-solid border-gray-400 rounded-md outline-none pl-2 py-1 w-full min-w-[250px]"
                required
              />
            </div>
            <div className="py-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="py-4 text-center">
            Already have an account?{" "}
            <Link
              onClick={() => document.getElementById("my_modal_3").showModal()}
              to="/"
              className="text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
