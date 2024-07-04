type Props = {}

const SingleUserPage = (props: Props) => {
	return (
		<div>
			<h2>SingleUserPage</h2>
			<div>name</div>
			<div>data</div>

			<div>
				<form action=''>
					<label>Username</label>
					<input type='text' name='username' placeholder='John Doe' />
					<label>Email</label>
					<input type='email' name='email' placeholder='JohnDoe@gmail.com' />
					<label>Password</label>
					<input type='password' name='password' placeholder='JohnDoe@gmail.com' />
					<label>Phone</label>
					<input type='phone' name='phone' placeholder='+123' />
					<label>Is admin?</label>
					<select name='role' id='role'>
						<option value='true'>Так</option>
						<option value='false'>Ні</option>
					</select>
					<label>Is active?</label>
					<select name='active' id='active'>
						<option value='true'>Так</option>
						<option value='false'>Ні</option>
					</select>
					<button>Update</button>
				</form>
			</div>
		</div>
	)
}

export default SingleUserPage
