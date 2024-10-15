'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Recipe {
    title: string;
    tag: string[];
    ingredients: string[];
    process: string[];
}

export default function Home() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);  // 기본값을 빈 배열로 설정
    const { data: session, status } = useSession(); // 세션 정보를 가져옴

    // 로컬 스토리지에서 레시피 불러오기
    useEffect(() => {
        if (session) {
            const savedRecipes = localStorage.getItem(JSON.stringify(session.user!.email!));
            if (savedRecipes) {
                try {
                    const parsedRecipes = JSON.parse(savedRecipes);
                    // 가져온 데이터가 배열이 아닐 경우 배열로 처리
                    if (Array.isArray(parsedRecipes)) {
                        setRecipes(parsedRecipes);
                    } else if (parsedRecipes) {
                        setRecipes([parsedRecipes]);  // 하나의 레시피인 경우 배열로 변환
                    }
                } catch (error) {
                    console.error('JSON 파싱 에러:', error);
                }
            }
        }
    }, [session]);

    return (
        <div>
            <div className="">
                <Link href="/additem">Add item</Link>
            </div>
            <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">저장된 레시피 목록</h1>

                <div className="w-full max-w-4xl">
                    {recipes.length === 0 ? (
                        <p className="text-lg text-gray-600">저장된 레시피가 없습니다.</p>
                    ) : (
                        recipes.map((recipe, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200"
                            >
                                <h2 className="text-2xl font-bold mb-4 text-gray-900">{recipe.title}</h2>

                                {/* 태그 표시 */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-700">태그:</h3>
                                    <ul className="list-disc ml-6">
                                        {recipe.tag.map((tag, tagIndex) => (
                                            <li key={tagIndex} className="text-gray-600">{tag}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* 자세히 보기 버튼 */}
                                <Link
                                    href={{
                                        pathname: `/recipe/${index}`,  // 동적 라우팅 경로로 이동
                                        query: { recipe: JSON.stringify(recipe) },  // 레시피 데이터를 쿼리로 전달
                                    }}
                                >
                                    자세히 보기
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}