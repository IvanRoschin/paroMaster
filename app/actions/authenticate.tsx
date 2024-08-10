// 'use server'
// import { AuthError } from 'next-auth'
// import { revalidatePath } from 'next/cache'
// import { isRedirectError, redirect } from 'next/dist/client/components/redirect'
// import { signIn, signOut } from '../../auth'

// export async function authenticate(formData: FormData): Promise<void> {
// 	const email = formData.get('email') as string
// 	const password = formData.get('password') as string

// 	try {
// 		await signIn('credentials', { email, password })
// 	} catch (error) {
// 		if (error instanceof AuthError) {
// 			const { type, cause } = error
// 			switch (type) {
// 				case 'CredentialsSignin':
// 					throw new Error('Invalid credentials.')
// 				case 'CallbackRouteError':
// 					throw new Error(cause?.err?.message || 'Callback route error.')
// 				default:
// 					throw new Error('Something went wrong.')
// 			}
// 		} else if (isRedirectError(error)) {
// 			throw error
// 		} else {
// 			throw new Error('Unknown error occurred.')
// 		}
// 	} finally {
// 		// Redirect to admin page after successful authentication
// 		revalidatePath(`/admin`)
// 		redirect(`/admin`)
// 	}
// }

// export async function signOutAction() {
// 	try {
// 		await signOut({ redirectTo: '/' })
// 	} catch (error) {
// 		console.log(error)
// 	} finally {
// 		revalidatePath(`/`)
// 		redirect(`/`)
// 	}
// }
