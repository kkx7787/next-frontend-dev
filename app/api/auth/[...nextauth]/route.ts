import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

interface User {
    id: string;  // id를 문자열로 설정
    email: string;
    username: string;
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!
        }),
        GithubProvider({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials || {};
                if (email && password) {
                    const user: User = {
                        id: '1',
                        email: email!,
                        username: email!.split('@')[0],
                    };
                    return user;
                } else {
                    return null;
                }
            }
        })
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {

    }
});

export { handler as GET, handler as POST };