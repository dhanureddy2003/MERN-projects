import { useState } from "react";
import { Link } from "react-router-dom";
import {ToastContainer , toast} from 'react-toastify'
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleForm = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
        })
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong');
      }
      console.log(responseData)
      toast.success('User logIn successfully!'); // Handle response data
       // Store user data in state if needed
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box bg-slate-100 w-[22rem]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Login</h3>
          <form onSubmit={handleForm} method="post" className="flex flex-col align-middle">
            <div className="py-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </div>
          </form>
          <p className="py-4 ">
            Dont have an account? <Link to="/signup" onClick={() => document.getElementById('my_modal_3').close()} className="text-blue-600 hover:underline">Sign up</Link>
          </p>
        </div>
      <ToastContainer/>
      </dialog>
    </div>
  );
};

export default Login;
