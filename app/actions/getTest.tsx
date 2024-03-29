import { connectToDB } from '@/utils/dbConnect'

type Props = {}

const getTest = (props: Props) => {
	const db = connectToDB()
	console.log(db)
	return <div>getTest</div>
}

export default getTest
