'use client'
import Image from "next/image";
import {signIn} from "next-auth/react";
import React, {useState} from 'react'
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";

export default function SignInPage() {

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,  // input name에 따라 상태 업데이트
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            redirect: true,  // 리디렉션 여부 (필요 시 변경 가능)
            email: credentials.email,
            password: credentials.password,
            callbackUrl: "/",  // 로그인 성공 시 리디렉션할 URL
        });

        if (result?.error) {
            console.log("Error:", result.error);
        } else {
            console.log("Logged in successfully");
        }
    };

    return (
        <section className='full h-screen'>
            <div className='container h-full'>
                <div className='flex justify-center items-center flex-wrap text-gray-800 h-full'>
                    <div className='margin'>
                        <div className='block bg-white shadow-lg rounded-lg'>
                            <div className='lg:flex lg:flex-wrap g-0'>
                                <div className='bg-emerald-300 rounded-lg'>
                                    <div className='md:pt-4 flex justify-center mb-2'>
                                        <Image src="/image/login.png" alt="dog image" width={100} height={30}/>
                                    </div>
                                    <div className='md:px-6 md:mx-2 pb-4'>
                                        <form onSubmit={handleSubmit}>
                                            <div className='mb-4'>
                                                <div className="text-white font-bold font-sans">Email</div>
                                                <input
                                                    id='email'
                                                    type='email'
                                                    name='email'
                                                    className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                                                    value={credentials.email}
                                                    onChange={handleChange}
                                                    placeholder='your-email@example.com'
                                                    required
                                                />
                                            </div>
                                            <div className='mb-4'>
                                                <div className="text-white font-bold font-sans">Password</div>
                                                <input
                                                    id='password'
                                                    name='password'
                                                    type='password'
                                                    value={credentials.password}
                                                    onChange={handleChange}
                                                    className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                                                    placeholder='Password'
                                                    required
                                                />
                                            </div>
                                            <div className='text-center pt-1 mb-2 pb-1 px-5'>
                                                <button
                                                    className='bg-emerald-800 inline-block px-6 py-2.5 text-white font-medium text-xs font-sans leading-tight uppercase rounded shadow-md hover:bg-red-800 hover:text-white hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full'
                                                    type="submit"
                                                >
                                                    Login
                                                </button>
                                            </div>
                                        </form>
                                        <button
                                            className="my-2 flex items-center justify-center w-full bg-white text-gray-700 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out"
                                            onClick={() => signIn('google', {callbackUrl: "/"})}
                                        >
                                            <FcGoogle className="mr-3" size={24}/>
                                            <span className="text-lg">Sign in with Google</span>
                                        </button>
                                        <button
                                            className="flex items-center justify-center w-full bg-white text-gray-700 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out"
                                            onClick={() => signIn('github', {callbackUrl: "/"})}
                                        >
                                            <FaGithub className="mr-3" size={24}/>
                                            <span className="text-lg">Sign in with Github</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}