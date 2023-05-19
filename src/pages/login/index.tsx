"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to home page
        window.location.href = "/dashboard";
      }
    } catch (error) {
      const errorMessage = error as string;
      if (errorMessage) {
        const { email, password } = JSON.parse(errorMessage);
        if (email) {
          setError(email);
        } else if (password) {
          setError(password);
        } else {
          setError("Something went wrong. Please try again later.");
        }
      }
    }
  };
  const shadowStyle = {
    boxShadow:
      "inset 3px 4px 5px rgba(255, 255, 255, 0.1), inset 1px 1px 0 rgba(255, 255, 255, .2), 4px 4px 5px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div className="h-screen flex  px-6 bg-gradient-to-b from-blue-400 to-teal-500">
      <div className="w-full max-w-md m-auto">
        <form
          onSubmit={handleSubmit}
          className="w-96 px-6 pt-6 pb-8 flex flex-col gap-2 bg-Neutral-100/10 rounded-lg"
          style={shadowStyle}
        >
          <div className="mb-4">
            <h2 className="text-center text-3xl font-bold text-Neutral-100">
              Login
            </h2>
            <label
              className="block text-sm font-bold mb-2 text-Neutral-100"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              className="block text-Neutral-100 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="text-red-500 text-xs italic">{error}</p>
          <a
            className="inline-block align-baseline text-sm text-right text-Neutral-100 hover:text-blue-800"
            href="#"
          >
            Forgot Password?
          </a>
          <button
            className="bg-Primary-40 hover:bg-Primary-60 text-Neutral-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
