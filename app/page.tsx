'use client';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Recipe {
    title: string;
    tag: string[];
    ingredients: string[];
    process: string[];
    version: number;
}

export default function Home() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const { data: session, status } = useSession();

    // 로컬 스토리지에서 레시피 불러오기
    useEffect(() => {
        if (session) {
            const savedRecipes = localStorage.getItem(JSON.stringify(session.user!.email!));
            if (savedRecipes) {
                try {
                    const parsedRecipes: Recipe[] = JSON.parse(savedRecipes);

                    if (Array.isArray(parsedRecipes)) {
                        // 같은 제목의 레시피 중 가장 최신 버전만 남기기
                        const uniqueRecipes = Object.values(
                            parsedRecipes.reduce((acc, recipe) => {
                                // 제목이 같은 경우 최신 버전으로 덮어씀
                                if (!acc[recipe.title] || acc[recipe.title].version < recipe.version) {
                                    acc[recipe.title] = recipe;
                                }
                                return acc;
                            }, {} as { [title: string]: Recipe })
                        );

                        setRecipes(uniqueRecipes);
                    } else if (parsedRecipes) {
                        setRecipes([parsedRecipes]); // 하나의 레시피인 경우 배열로 변환
                    }
                } catch (error) {
                    console.error('JSON 파싱 에러:', error);
                }
            }
        }
    }, [session]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">로그인 후 레시피 목록을 확인하세요</h1>
                <Link href="/signin">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200">
                        로그인
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="flex justify-between items-center w-full max-w-6xl mx-auto mb-10">
                <h1 className="text-4xl font-bold text-gray-800">저장된 레시피 목록</h1>
                <Link href="/additem">
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 ease-in-out">
                        Add New Recipe
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
                {recipes.length === 0 ? (
                    <p className="text-lg text-gray-600">저장된 레시피가 없습니다.</p>
                ) : (
                    recipes.map((recipe, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex">
                                <h2 className="text-2xl font-bold mb-4 text-gray-900 mr-3">{recipe.title}</h2>
                                <h2 className="text-2xl text-gray-400">#V{recipe.version}</h2>
                            </div>

                            {/* 태그 표시 */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">태그:</h3>
                                <ul className="flex flex-wrap gap-2">
                                    {recipe.tag.map((tag, tagIndex) => (
                                        <li key={tagIndex} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg">
                                            #{tag}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 자세히 보기 버튼 */}
                            <Link
                                href={{
                                    pathname: `/recipe/${index}`,
                                    query: { recipe: JSON.stringify(recipe) },
                                }}
                            >
                                <button
                                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200">
                                    자세히 보기
                                </button>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
