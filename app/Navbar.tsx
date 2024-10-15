'use client'
import React, {useEffect} from 'react'
import Link from "next/link"
import {useSession, signOut} from 'next-auth/react'

const Navbar = () => {
    const {data: session,status} = useSession(); //세션 정보를 가져옴

    return (
        <div className="fixed top-0 left-0 w-full bg-emerald-800 flex justify-between items-center z-50">
            <Link href="/" className="py-3 text-white font-sans font-bold text-3xl ml-3">나만의 레시피</Link>
            <div className="flex text-lg items-center font-sans text-white mr-3">
                {session ? ( // 세션 정보가 있으면 signOut() 호출
                    <div>
                        <button className="mr-3" onClick={() => signOut()}>
                            Sign out
                        </button>
                        {session.user!.email!.split('@')[0]}
                    </div>
                ) : ( // 세션 정보가 없으면 signIn() 호출
                    <Link href="/signin">Sign in</Link>
                )}
            </div>
        </div>
    )
}

export default Navbar;