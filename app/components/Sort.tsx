'use client'

import useCustomRouter from 'app/hooks/useCustomRouter'
const Sort = () => {
	const { pushQuery, query } = useCustomRouter()
	return (
		<div>
			Sort:
			<select
				value={query.sort || 'createdAt'}
				onChange={e => pushQuery({ search: null, sort: e.target.value })}
			>
				<option value={'createdAt'}>createdAt up</option>
				<option value={'-createdAt'}>createdAt down</option>
			</select>
		</div>
	)
}

export default Sort
