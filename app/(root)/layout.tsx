"use client";
import React from "react";
import Navbar from "@/components/navbar";
import { useSession } from "next-auth/react";
import Link from "next/link";
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  if (status == "unauthenticated") {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
          <h2 className="text-4xl">Login to Create Todo's</h2>
          <Link href={"/login"}>
            <button className="px-6 py-4 cursor-pointer text-md text-white bg-blue-500 rounded-full">
              Go to Login Page
            </button>
          </Link>
        </div>
      </>
    );
  }
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
