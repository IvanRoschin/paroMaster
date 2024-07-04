type Props = {}

const page = (props: Props) => {
	return (
		<div>
			<form>
				<h2>Login</h2>
				<input type='text' placeholder='username' />
				<input type='password' placeholder='password' />
				<button>Login</button>
			</form>
		</div>
	)
}

export default page
