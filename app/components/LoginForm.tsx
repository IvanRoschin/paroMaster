'use client'

import authentificate from '@/actions/auth'
import { useState } from 'react'

type Props = {}

const LoginForm = (props: Props) => {
	const [error, setError] = useState('')

	const handleLogin = async (formData: FormData) => {
		const data = await authentificate(formData)
		const error = data?.error
		if (error) {
			setError(error)
		}
	}

	return (
		<div>
			<form action={handleLogin}>
				<h2>Login</h2>
				<input type='email' placeholder='email' name='email' />
				<input type='password' placeholder='password' name='password' />
				<button>Login</button>
				{error && error}
			</form>
		</div>
	)
}

export default LoginForm
