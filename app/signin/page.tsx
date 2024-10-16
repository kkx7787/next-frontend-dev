'use client';
import Image from "next/image";
import { signIn } from "next-auth/react";
import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

// 로그인 폼 컴포넌트
const SignInForm = ({ credentials, handleChange, handleSubmit }: any) => (
    <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
            id="email"
            type="email"
            label="Email"
            value={credentials.email}
            placeholder="your-email@example.com"
            onChange={handleChange}
        />
        <InputField
            id="password"
            type="password"
            label="Password"
            value={credentials.password}
            placeholder="Password"
            onChange={handleChange}
        />
        <SubmitButton label="Login" />
    </form>
);

// 입력 필드 컴포넌트
const InputField = ({ id, type, label, value, placeholder, onChange }: any) => (
    <div>
        <label htmlFor={id} className="block text-left text-sm font-semibold text-gray-600">
            {label}
        </label>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder={placeholder}
            required
        />
    </div>
);

// 제출 버튼 컴포넌트
const SubmitButton = ({ label }: { label: string }) => (
    <button
        type="submit"
        className="w-full bg-emerald-700 text-white py-2 rounded-lg font-semibold hover:bg-emerald-800 transition duration-200"
    >
        {label}
    </button>
);

// 소셜 로그인 버튼 컴포넌트
const SocialSignInButton = ({ provider, icon, label }: any) => (
    <button
        className="flex items-center justify-center w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
        onClick={() => signIn(provider, { callbackUrl: "/" })}
    >
        {icon}
        <span className="text-lg">{label}</span>
    </button>
);

export default function SignInPage() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value, // input name에 따라 상태 업데이트
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            redirect: true,
            email: credentials.email,
            password: credentials.password,
            callbackUrl: "/",
        });

        if (result?.error) {
            console.log("Error:", result.error);
        } else {
            console.log("Logged in successfully");
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-300 to-emerald-400">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-center mb-6">
                    <Image src="/image/login.png" alt="Login Image" width={100} height={30} />
                </div>

                <SignInForm credentials={credentials} handleChange={handleChange} handleSubmit={handleSubmit} />

                <div className="mt-8 space-y-4">
                    <SocialSignInButton
                        provider="google"
                        icon={<FcGoogle className="mr-3" size={24} />}
                        label="Sign in with Google"
                    />
                    <SocialSignInButton
                        provider="github"
                        icon={<FaGithub className="mr-3" size={24} />}
                        label="Sign in with Github"
                    />
                </div>
            </div>
        </section>
    );
}
