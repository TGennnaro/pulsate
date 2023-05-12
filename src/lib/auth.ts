import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import { db } from './prisma';
import GoogleProvider from 'next-auth/providers/google';

function getGoogleCredentials(): { clientId: string; clientSecret: string } {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	if (!clientId || !clientSecret) {
		throw new Error('Missing Google Client ID or Client Secret');
	}
	return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(db),
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/signin',
	},
	providers: [
		GoogleProvider({
			clientId: getGoogleCredentials().clientId,
			clientSecret: getGoogleCredentials().clientSecret,
		}),
	],
	callbacks: {
		async session({ token, session }) {
			if (token && session?.user) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
			}

			return session;
		},
		async jwt({ token, user }) {
			const dbUser = await db.user.findFirst({
				where: {
					email: token.email,
				},
			});

			if (!dbUser) {
				token.id = user!.id;
				return token;
			}

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
			};
		},
		redirect() {
			return '/inventory';
		},
	},
};
