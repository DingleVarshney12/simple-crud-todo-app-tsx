"use client"
import { UserCircle } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
    const { data: session } = useSession();
    const [dropDown, setDropDown] = useState(false);

    return (
        <header className=' bg-blue-500 w-full h-16 flex items-center justify-between px-4 py-2'>
            <div className='text-2xl font-bold text-white'>Todo App</div>
            <nav className='flex items-center gap-4'>
                {session ? (
                    <div className="user relative px-2 py-2 bg-black rounded-md cursor-pointer" onClick={() => setDropDown(!dropDown)}>
                        <UserCircle />
                        {dropDown && (
                            <div className="absolute px-2 py-2 rounded-lg bg-black border border-slate-600 top-[101%] right-1/2 transform  w-[156px] z-10">
                                <p className="text-sm text-center">{session?.user?.name}</p>
                                <div className="h-px w-full bg-linear-to-r from-black via-gray-300 to-black my-2" />
                                <button
                                    onClick={() => signOut()}
                                    className="w-full text-red-500 cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link href="/login" className="text-white underline">Login</Link>
                        <Link href="/register" className="text-white underline">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
