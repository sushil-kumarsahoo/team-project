import Link from "next/link";
import React from "react";

const Home = async () => {
  const user = false;
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        Team access control demo
      </h1>
      <p className="mb-8 text-slate-300">
        Welcome to the team access control demo!
      </p>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 p-6 border border-slate-700 rounded-lg ">
          <h3 className="text-lg font-semibold text-white mb-3">
            Feature Demonstrated
          </h3>
          <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
            <li>Role Based access control (RBAC)</li>
            <li>Route Protection in middleware</li>
            <li>Server side permission checks</li>
            <li>Client side permission hooks</li>
            <li>Dynamic route access</li>
          </ul>
        </div>
        <div className="bg-slate-800 p-6 border border-slate-700 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">user roles</h3>
          <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
            <li>
              <strong className="text-green-400">Super Admin: </strong>Full system access
            </li>
            <li>
              <strong className="text-purple-400">Admin: </strong>Manage users and settings
            </li>
            <li>
              <strong className="text-pink-400">Manager: </strong>team specific management
            </li>
            <li>
              <strong className="text-blue-400">User: </strong>Basic dashboard
            </li>
          </ul>
        </div>
      </div>
      {user ? (
        <div className="bg-green-900/30 border-green-600 rounded-lg p-4 ">
          <p className="text-green-300">
            Welcome back, <strong>Sushil</strong>! You are logged in as{""}
            <strong className="text-green-400">USER</strong>
          </p>
          <Link
            href="/dashboard"
            className="text-green-400 hover:text-green-300"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className=" bg-blue-900/30 border-blue-600 rounded-lg p-4 ">
          <p className=" text-slate-300 pb-2">You are not logged in.</p>
           <div className="space-x-3"></div>
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-blue-300 hover:bg-blue-700 hover:text-blue-200 rounded-md inline-block"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-600 text-blue-300 hover:bg-blue-700 hover:text-blue-200 rounded-md ml-4 inline-block"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
