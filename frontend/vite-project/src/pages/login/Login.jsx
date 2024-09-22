/* eslint-disable no-unused-vars */

import XSvg from "../../components/X";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(true);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.Error) throw new Error(data.error);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/", { replace: true });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formValues);
  };

  return (
    <>
      <div className="w-full flex items-center justify-center h-screen">
        {/* Large screen: justify the SVG to the end, form to the start */}
        <div className="flex-1 hidden lg:flex items-center justify-end lg:pr-10">
          <XSvg className="lg:w-[50%] fill-white" />
        </div>

        {/* Large screen: align form to the start, on small screens keep centered */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start lg:pl-10">
          <form
            className="flex gap-4 flex-col w-[80%] md:w-[50%] lg:w-[60%]"
            onSubmit={handleSubmit}
          >
            <XSvg className="w-24 lg:hidden fill-white" />
            <h1 className="text-4xl font-extrabold text-white overflow-y-hidden">
              {"Let's"} go.
            </h1>
            <label className="input input-bordered rounded flex items-center gap-2">
              <MdOutlineMail />
              <input
                type="text"
                className="grow"
                placeholder="Username"
                name="username"
                onChange={handleChange}
                value={formValues.username}
              />
            </label>

            <label className="input input-bordered rounded flex items-center gap-2">
              <MdPassword />
              <input
                type={`${showPassword ? "password" : "text"}`}
                className="grow"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={formValues.password}
              />
              <FaEyeSlash
                onClick={() => setShowPassword(!showPassword)}
                className={`cursor-pointer ${
                  showPassword ? "hidden" : "block"
                } `}
              />
              {showPassword && (
                <FaEye
                  onClick={() => setShowPassword(!showPassword)}
                  className={`cursor-pointer ${
                    showPassword ? "block" : "hidden"
                  }`}
                />
              )}
            </label>
            <button
              type="submit" // Ensure the button is of type submit
              className="btn rounded-full bg-blue-500 text-white"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
            {isError && <p className="text-red-500">{error.message}</p>}
          </form>
          <div className="flex flex-col gap-2 mt-4 lg:w-[60%]">
              <p className="text-white text-lg">{"Don't"} have an account?</p>
            <Link to="/signup">
            <button className="btn rounded-full bg-transparent text-white btn-outline w-full">
              Sign up
            </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
