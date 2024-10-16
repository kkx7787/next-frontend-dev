'use client';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Recipe from "../types/index";

export default function Home() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session) {
            loadRecipes(session.user!.email!);
        }
    }, [session]);

    const loadRecipes = (email: string) => {
        const savedRecipes = localStorage.getItem(JSON.stringify(email));
        if (savedRecipes) {
            try {
                const parsedRecipes: Recipe[] = JSON.parse(savedRecipes);
                const uniqueRecipes = getUniqueRecipesByTitle(parsedRecipes);
                setRecipes(uniqueRecipes);
            } catch (error) {
                console.error('JSON 파싱 에러:', error);
            }
        }
    };

    const getUniqueRecipesByTitle = (recipes: Recipe[]): Recipe[] => {
        return Object.values(
            recipes.reduce((acc, recipe) => {
                if (!acc[recipe.title] || acc[recipe.title].version < recipe.version) {
                    acc[recipe.title] = recipe;
                }
                return acc;
            }, {} as { [title: string]: Recipe })
        );
    };

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
                <Image className="mb-5" src="/image/example-recipe.jpg" alt="Example recipe" width={500} height={400} />
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
            <Header />
            <RecipeGrid recipes={recipes} />
        </div>
    );
}

// 상단 헤더 컴포넌트
const Header = () => (
    <div className="flex justify-between items-center w-full max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-gray-800">저장된 레시피 목록</h1>
        <Link href="/additem">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 ease-in-out">
                Add New Recipe
            </button>
        </Link>
    </div>
);

const RecipeGrid = ({ recipes }: { recipes: Recipe[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
        {recipes.length === 0 ? (
            <NoRecipes />
        ) : (
            recipes.map((recipe, index) => <RecipeCard key={index} recipe={recipe} index={index} />)
        )}
    </div>
);

const NoRecipes = () => (
    <div>
        <p className="text-lg text-gray-600">저장된 레시피가 없습니다.</p>
    </div>
);

const RecipeCard = ({ recipe, index }: { recipe: Recipe, index: number }) => (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <div className="flex">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 mr-3">{recipe.title}</h2>
            <h2 className="text-2xl text-gray-400">#{recipe.version}</h2>
        </div>
        <Tags tags={recipe.tag} />
        <Link href={{ pathname: `/recipe/${index}`, query: { recipe: JSON.stringify(recipe) } }}>
            <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200">
                자세히 보기
            </button>
        </Link>
    </div>
);

const Tags = ({ tags }: { tags: string[] }) => (
    <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700">태그:</h3>
        <ul className="flex flex-wrap gap-2">
            {tags.map((tag, tagIndex) => (
                <li key={tagIndex} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg">
                    #{tag}
                </li>
            ))}
        </ul>
    </div>
);