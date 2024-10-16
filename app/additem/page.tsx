'use client';
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Recipe from "../../types/index";

const FieldList = ({ label, field, values, onChange, addField, removeField }: any) => (
    <div className="mb-6">
        <label className="block text-xl font-semibold mb-2 text-gray-700">{label}</label>
        {values.map((value: string, index: number) => (
            <div key={index} className="flex items-center mb-3">
                <input
                    type="text"
                    value={value}
                    className="block flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => onChange(e, index, field)}
                    placeholder={`${label} 입력`}
                    required
                />
                {values.length > 1 && (
                    <button
                        className="bg-red-500 text-white px-2 py-1 ml-2 rounded-lg hover:bg-red-600 transition duration-200"
                        onClick={() => removeField(field, index)}
                        type="button"
                    >
                        삭제
                    </button>
                )}
            </div>
        ))}
        <button
            className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={() => addField(field)}
            type="button"
        >
            추가
        </button>
    </div>
);

export default function AddRecipe() {
    const { data: session } = useSession(); // 세션 정보를 가져옴
    const router = useRouter();

    // 레시피 상태 관리
    const [recipe, setRecipe] = useState({
        title: "",
        tag: [""],
        ingredients: [""],
        process: [""],
        version: 1,
        timestamp: ""
    });

    // 제목, 태그, 재료, 과정 값 변경 처리
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number, field?: string) => {
        const { name, value } = e.target;
        if (name === "title") {
            setRecipe({ ...recipe, [name]: value }); // 제목 업데이트
        } else if (field && index !== undefined) {
            const updatedArray = [...recipe[field as keyof typeof recipe] as string[]];
            updatedArray[index] = value; // 해당 배열 값 업데이트
            setRecipe({ ...recipe, [field]: updatedArray });
        }
    };

    // 필드 추가
    const addField = (field: "tag" | "ingredients" | "process") => {
        setRecipe({ ...recipe, [field]: [...recipe[field], ""] });
    };

    // 필드 삭제
    const removeField = (field: "tag" | "ingredients" | "process", index: number) => {
        if (recipe[field].length > 1) {
            const updatedArray = [...recipe[field]];
            updatedArray.splice(index, 1); // 해당 인덱스의 항목을 제거
            setRecipe({ ...recipe, [field]: updatedArray });
        }
    };

    // 필드가 빈 값인지 확인하는 함수
    const isFieldEmpty = (fields: string[]) => fields.some(field => field.trim() === "");

    // 레시피 저장 함수
    const saveToLocalStorage = () => {
        const currentTimestamp = new Date().toLocaleString(); // 시간 형식: "YYYY-MM-DD HH:mm:ss"

        // 입력 값이 비어 있는지 확인
        if (!recipe.title.trim()) {
            alert("레시피 제목을 입력하세요.");
            return;
        }
        if (isFieldEmpty(recipe.tag)) {
            alert("모든 태그를 입력하세요.");
            return;
        }
        if (isFieldEmpty(recipe.ingredients)) {
            alert("모든 재료를 입력하세요.");
            return;
        }
        if (isFieldEmpty(recipe.process)) {
            alert("모든 과정을 입력하세요.");
            return;
        }

        if (session) {
            const savedRecipes = localStorage.getItem(JSON.stringify(session.user?.email));
            let updatedRecipes: Recipe[] = [];

            if (savedRecipes) {
                try {
                    const parsedRecipes = JSON.parse(savedRecipes);
                    updatedRecipes = Array.isArray(parsedRecipes) ? parsedRecipes : [];
                } catch (error) {
                    console.error("로컬 스토리지에서 레시피를 불러오는 중 오류 발생:", error);
                }
            }

            const existingRecipes = updatedRecipes.filter(r => r.title === recipe.title);
            const newVersion = existingRecipes.length > 0
                ? Math.max(...existingRecipes.map(r => r.version)) + 1
                : 1;

            updatedRecipes.push({ ...recipe, version: newVersion, timestamp: currentTimestamp });

            localStorage.setItem(JSON.stringify(session.user?.email), JSON.stringify(updatedRecipes));
            alert("레시피가 로컬 스토리지에 저장되었습니다.");
            router.push('/');
        } else {
            alert('로그인이 필요합니다.');
            router.push('/signin');
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

                <FieldList
                    label="태그"
                    field="tag"
                    values={recipe.tag}
                    onChange={handleChange}
                    addField={addField}
                    removeField={removeField}
                />
                <FieldList
                    label="재료"
                    field="ingredients"
                    values={recipe.ingredients}
                    onChange={handleChange}
                    addField={addField}
                    removeField={removeField}
                />
                <FieldList
                    label="과정"
                    field="process"
                    values={recipe.process}
                    onChange={handleChange}
                    addField={addField}
                    removeField={removeField}
                />

                <button
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
                    onClick={saveToLocalStorage}
                    type="button"
                >
                    레시피 저장
                </button>
            </div>
        </div>
    );
}
