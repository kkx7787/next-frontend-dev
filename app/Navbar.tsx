'use client'
import React, {useEffect} from 'react'
import Link from "next/link"
import {useSession, signOut} from 'next-auth/react'

const Navbar = () => {
    const {data: session,status} = useSession(); //세션 정보를 가져옴

    useEffect(() => {
        if (status === "authenticated" && session!.user?.email) {
            // 로컬 스토리지에 이메일 저장
            localStorage.setItem("userEmail", session!.user.email);
        }
    }, [session, status]);

    return (
        <div className="fixed w-full bg-emerald-800 flex justify-between">
            <div className="py-3 text-white font-sans font-bold text-3xl">나만의 레시피</div>
            <div className="flex text-lg items-center font-sans text-white mr-3">
                <Link className="mr-5" href="/">
                    Home
                </Link>
                {session ? ( //세션 정보가 있으면 signOut()호출
                    <div>
                        <button className="mr-3" onClick={() => signOut()}> Sign out</button>
                        {session.user!.email!.split('@')[0]}
                    </div>
                ) : ( //세션 정보가 없으면 signIn()호출
                    <Link href="/signin">Sign in</Link>
                )}
            </div>
        </div>
    )
}

export default Navbar;