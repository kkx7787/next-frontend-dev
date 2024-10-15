'use client';
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

interface RecipeDetailProps {
    title: string;
    tag: string[];
    ingredients: string[];
    process: string[];
}

export default function RecipeDetail() {
    const [recipe, setRecipe] = useState<RecipeDetailProps | null>(null);
    const [isEditing, setIsEditing] = useState(false);  // 수정 모드 상태
    const [editedRecipe, setEditedRecipe] = useState<RecipeDetailProps | null>(null);  // 수정된 레시피 상태
    const router = useRouter();
    const searchParams = useSearchParams(); // 쿼리 스트링 접근
    const {data: session, status} = useSession(); // 세션 정보를 가져옴

    // 페이지 로드 시 쿼리 스트링에서 레시피 정보를 가져옴
    useEffect(() => {
        const recipeQuery = searchParams.get('recipe'); // 쿼리 스트링에서 recipe 파라미터를 가져옴
        if (recipeQuery) {
            try {
                const parsedRecipe = JSON.parse(recipeQuery);
                setRecipe(parsedRecipe);
                setEditedRecipe(parsedRecipe);  // 수정 상태 초기화
            } catch (error) {
                console.error("파싱 중 오류가 발생했습니다:", error);
            }
        }
    }, [searchParams]);

    // 로컬 스토리지에서 레시피 삭제
    const handleDelete = () => {
        if (confirm("정말로 이 레시피를 삭제하시겠습니까?")) {
            if (session) {
                const savedRecipes = localStorage.getItem(JSON.stringify(session.user!.email!));
                if (savedRecipes) {
                    const parsedRecipes = JSON.parse(savedRecipes);
                    const updatedRecipes = parsedRecipes.filter((r: RecipeDetailProps) => r.title !== recipe?.title);
                    localStorage.setItem(JSON.stringify(session.user?.email), JSON.stringify(updatedRecipes));
                    alert("레시피가 삭제되었습니다.");
                    router.push('/');  // 목록으로 돌아감
                }
            }
        }
    };

    // 레시피 수정
    const handleEdit = () => {
        if (session && editedRecipe) {
            const savedRecipes = localStorage.getItem(JSON.stringify(session.user!.email!));
            if (savedRecipes) {
                const parsedRecipes = JSON.parse(savedRecipes);
                const updatedRecipes = parsedRecipes.map((r: RecipeDetailProps) =>
                    r.title === recipe?.title ? editedRecipe : r
                );
                localStorage.setItem(JSON.stringify(session.user?.email), JSON.stringify(updatedRecipes));
                alert("레시피가 수정되었습니다.");
                setIsEditing(false);  // 수정 모드 종료
                router.push('/');  // 목록으로 돌아감
            }
        }
    };

    // 레시피 수정 폼에서 입력 값 변경 처리
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editedRecipe) {
            const {name, value} = e.target;
            setEditedRecipe({...editedRecipe, [name]: value});
        }
    };

// 배열 필드의 항목을 수정할 때 사용하는 핸들러 함수
    const handleArrayChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
        field: "tag" | "ingredients" | "process"
    ) => {
        if (editedRecipe) {
            const {value} = e.target;
            const updatedArray = [...(editedRecipe[field] as string[])]; // 배열을 복사해서 업데이트
            updatedArray[index] = value; // 해당 인덱스의 항목 변경
            setEditedRecipe({...editedRecipe, [field]: updatedArray});
        }
    };

// 배열 필드에 새로운 항목을 추가하는 핸들러 함수
    const handleAddField = (field: "tag" | "ingredients" | "process") => {
        if (editedRecipe) {
            const updatedArray = [...(editedRecipe[field] as string[])];
            updatedArray.push(""); // 빈 문자열로 새로운 항목 추가
            setEditedRecipe({...editedRecipe, [field]: updatedArray});
        }
    };

// 배열 필드에서 항목을 삭제하는 핸들러 함수
    const handleRemoveField = (field: "tag" | "ingredients" | "process", index: number) => {
        if (editedRecipe) {
            const updatedArray = [...(editedRecipe[field] as string[])];
            updatedArray.splice(index, 1); // 해당 인덱스의 항목 삭제
            setEditedRecipe({...editedRecipe, [field]: updatedArray});
        }
    };

    if (!recipe || !editedRecipe) {
        return <div>레시피를 불러오지 못했습니다.</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">{isEditing ? "레시피 수정" : recipe.title}</h1>

            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
                {isEditing ? (
                    <div>
                        {/* 수정 폼 */}
                        <div className="mb-4">
                            <label className="block text-lg font-semibold mb-2">제목</label>
                            <input
                                className="form-control w-full"
                                name="title"
                                value={editedRecipe.title}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 태그 수정 폼 */}
                        <div className="mb-4">
                            <label className="block text-lg font-semibold mb-2">태그</label>
                            {editedRecipe.tag.map((tag, index) => (
                                <div key={index} className="flex mb-2 items-center">
                                    <input
                                        className="form-control pl-2 border"
                                        value={tag}
                                        onChange={(e) => handleArrayChange(e, index, 'tag')}
                                    />
                                    <div className="flex mx-2"> {/* 버튼들이 수평으로 정렬되도록 설정 */}
                                        {/* 태그 수가 2개 이상일 때만 삭제 버튼을 표시 */}
                                        {editedRecipe.tag.length > 1 && (
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                                                onClick={() => handleRemoveField('tag', index)}
                                            >
                                                삭제
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                className="bg-blue-500 text-white px-3 py-1 mr-2 rounded-lg hover:bg-blue-600"
                                onClick={() => handleAddField('tag')}
                            >
                                추가
                            </button>
                        </div>

                        {/* 재료 수정 폼 */}
                        <div className="mb-4">
                            <label className="block text-lg font-semibold mb-2">재료</label>
                            {editedRecipe.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex items-center mb-2">
                                <input
                                        className="form-control pl-2 border"
                                        value={ingredient}
                                        onChange={(e) => handleArrayChange(e, index, 'ingredients')}
                                    />
                                    <div className="flex mx-2"> {/* 버튼들이 수평으로 정렬되도록 설정 */}
                                        {editedRecipe.ingredients.length > 1 && (
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                                                onClick={() => handleRemoveField('ingredients', index)}
                                            >
                                                삭제
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                className="bg-blue-500 text-white px-3 py-1 mr-2 rounded-lg hover:bg-blue-600"
                                onClick={() => handleAddField('ingredients')}
                            >
                                추가
                            </button>
                        </div>

                        {/* 조리 과정 수정 폼 */}
                        <div className="mb-4">
                            <label className="block text-lg font-semibold mb-2">조리 과정</label>
                            {editedRecipe.process.map((step, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        className="form-control pl-2 w-auto"
                                        value={step}
                                        onChange={(e) => handleArrayChange(e, index, 'process')}
                                    />
                                    <div className="flex mx-2"> {/* 버튼들이 수평으로 정렬되도록 설정 */}
                                        {editedRecipe.process.length > 1 && (
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 ml-2 rounded-lg hover:bg-red-600"
                                                onClick={() => handleRemoveField('process', index)}
                                            >
                                                삭제
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                                onClick={() => handleAddField('process')}
                            >
                                추가
                            </button>
                        </div>

                        {/* 수정 및 취소 버튼 */}
                        <div className="flex justify-between">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                onClick={handleEdit}
                            >
                            수정 완료
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                onClick={() => setIsEditing(false)}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* 레시피 정보 표시 */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">태그:</h3>
                            <ul className="list-disc ml-6">
                                {recipe.tag.map((tag, index) => (
                                    <li key={index} className="text-gray-600">{tag}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">재료:</h3>
                            <ul className="list-disc ml-6">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index} className="text-gray-600">{ingredient}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">과정:</h3>
                            <ul className="list-decimal ml-6">
                                {recipe.process.map((step, index) => (
                                    <li key={index} className="text-gray-600">{step}</li>
                                ))}
                            </ul>
                        </div>
                        {/* 수정, 삭제, 목록으로 돌아가기 버튼 */}
                        <div className="flex mt-6">
                            <button
                                className="bg-yellow-500 text-white px-4 py-2 mr-3 rounded-lg hover:bg-yellow-600"
                                onClick={() => setIsEditing(true)}
                            >
                                수정
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 mr-3 rounded-lg hover:bg-red-600"
                                onClick={handleDelete}
                            >
                                삭제
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                onClick={() => router.push('/')}
                            >
                                목록으로
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}