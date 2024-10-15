'use client'
import React, { useState } from "react";
import { useSession } from "next-auth/react";

interface Recipe {
    title: string;
    tag: string[];
    ingredients: string[];
    process: string[];
}

export default function AddRecipe() {
    const { data: session, status } = useSession(); // 세션 정보를 가져옴

    const [recipe, setRecipe] = useState({
        title: "",
        tag: [""],
        ingredients: [""],
        process: [""],
    });

    // 제목, 태그, 재료, 과정 값 변경 처리
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index?: number,
        field?: string
    ) => {
        const { name, value } = e.target;

        if (name === "title") {
            setRecipe({ ...recipe, [name]: value }); // 제목 업데이트
        } else if (field && index !== undefined) {
            const updatedArray = [...recipe[field as keyof typeof recipe] as string[]];
            updatedArray[index] = value; // 해당 배열 값 업데이트
            setRecipe({ ...recipe, [field]: updatedArray });
        }
    };

    // 태그, 재료, 과정 추가
    const addField = (field: "tag" | "ingredients" | "process") => {
        setRecipe({ ...recipe, [field]: [...recipe[field], ""] });
    };

    const saveToLocalStorage = () => {
        if (session) {
            const savedRecipes = localStorage.getItem(JSON.stringify(session.user?.email));
            let updatedRecipes: Recipe[] = [];  // 배열로 초기화

            if (savedRecipes) {
                try {
                    const parsedRecipes = JSON.parse(savedRecipes);

                    // 불러온 데이터가 배열인지 확인, 아니면 빈 배열로 설정
                    if (Array.isArray(parsedRecipes)) {
                        updatedRecipes = parsedRecipes;
                    } else {
                        console.error("저장된 레시피 데이터가 배열이 아닙니다. 빈 배열로 초기화합니다.");
                    }
                } catch (error) {
                    console.error("로컬 스토리지에서 레시피를 불러오는 중 오류 발생:", error);
                }
            }

            // 새 레시피를 기존 배열에 추가
            updatedRecipes.push(recipe);

            // 로컬 스토리지에 다시 저장
            localStorage.setItem(JSON.stringify(session.user?.email), JSON.stringify(updatedRecipes));
            alert("레시피가 로컬 스토리지에 저장되었습니다.");
        } else {
            alert('로그인하셔야 합니다.');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex justify-center items-center py-10 px-4">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-8">
                <div className="text-3xl font-bold text-center mb-6 text-gray-800">새 레시피 추가</div>

                {/* 레시피 제목 입력 */}
                <div className="mb-6">
                    <label htmlFor="title" className="block text-xl font-semibold mb-2 text-gray-700">
                        레시피 제목
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={recipe.title}
                        onChange={handleChange}
                        placeholder="레시피 제목을 입력하세요"
                        required
                    />
                </div>

                {/* 태그 입력 폼 */}
                <div className="mb-6">
                    <label className="block text-xl font-semibold mb-2 text-gray-700">태그</label>
                    {recipe.tag.map((tag, index) => (
                        <div key={index} className="flex items-center mb-3">
                            <input
                                type="text"
                                name="tag"
                                className="block flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={tag}
                                onChange={(e) => handleChange(e, index, "tag")}
                                placeholder="태그를 입력하세요"
                                required
                            />
                            <button
                                className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-lg hover:bg-blue-600 transition duration-200"
                                onClick={() => addField("tag")}
                                type="button"
                            >
                                태그 추가
                            </button>
                        </div>
                    ))}
                </div>

                {/* 재료 입력 폼 */}
                <div className="mb-6">
                    <label className="block text-xl font-semibold mb-2 text-gray-700">재료</label>
                    {recipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center mb-3">
                            <input
                                type="text"
                                name="ingredients"
                                className="block flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={ingredient}
                                onChange={(e) => handleChange(e, index, "ingredients")}
                                placeholder="재료를 입력하세요"
                                required
                            />
                            <button
                                className="bg-green-500 text-white px-4 py-2 ml-2 rounded-lg hover:bg-green-600 transition duration-200"
                                onClick={() => addField("ingredients")}
                                type="button"
                            >
                                재료 추가
                            </button>
                        </div>
                    ))}
                </div>

                {/* 과정 입력 폼 */}
                <div className="mb-6">
                    <label className="block text-xl font-semibold mb-2 text-gray-700">과정</label>
                    {recipe.process.map((step, index) => (
                        <div key={index} className="flex items-center mb-3">
                            <input
                                type="text"
                                name="process"
                                className="block flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={step}
                                onChange={(e) => handleChange(e, index, "process")}
                                placeholder="과정을 입력하세요"
                                required
                            />
                            <button
                                className="bg-red-500 text-white px-4 py-2 ml-2 rounded-lg hover:bg-red-600 transition duration-200"
                                onClick={() => addField("process")}
                                type="button"
                            >
                                과정 추가
                            </button>
                        </div>
                    ))}
                </div>

                {/* 로컬 스토리지에 저장하는 버튼 */}
                <button
                    className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
                    onClick={saveToLocalStorage}
                    type="button"
                >
                    레시피 저장
                </button>
            </div>
        </div>
    );
}