'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Slider from 'react-slider'
import './PriceFilter.css'

const MIN = 100
const MAX = 400

const PriceFilter = () => {
	const [values, setValues] = useState<number[]>([MIN, MAX])
	const router = useRouter()
	const pathName = usePathname()
	const params = useSearchParams()

	// const handleChange = (range: number[]) => {
	//   console.log("RANGE", range);
	//   const params = new URLSearchParams(window.location.search);
	//   params.set("low", values[0].toString());
	//   params.set("high", values[1].toString());

	//   window.history.replaceState(
	//     {},
	//     "",
	//     `${window.location.pathname}?${params}`
	//   );
	//   router.push(
	//     `/${pathName}?low=${values[0].toString()}&high=${values[1].toString()}`,
	//     {
	//       scroll: false,
	//     }
	//   );
	// };

	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		// if (values.length > 0) {
		params.set('low', values[0].toString())
		params.set('high', values[1].toString())

		window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
		if (params.get('search')) {
			router.push(
				`/${pathName}?low=${values[0].toString()}&high=${values[1].toString()}&search=${params.get(
					'search',
				)}`,
				{
					scroll: false,
				},
			)
		} else if (params.get('sort')) {
			router.push(
				`/${pathName}?low=${values[0].toString()}&high=${values[1].toString()}&sort=${params.get(
					'sort',
				)}`,
				{
					scroll: false,
				},
			)
		} else {
			router.push(`/${pathName}?low=${values[0].toString()}&high=${values[1].toString()}`, {
				scroll: false,
			})
		}
		// } else {
		//   params.delete("low");
		//   params.delete("high");
		// }
	}, [pathName, router, values])

	return (
		<div className='my-10 w-[250px] p-2'>
			<h2 className='mb-[20px]'>Діапазон ціни</h2>
			<p className='mb-[20px]'>
				<span className='inline-block w-[30px]'>
					{/* {values.length > 0 ? values[0] : MIN} */}
					{values[0]}
				</span>{' '}
				грн -{' '}
				<span className='inline-block w-[30px]'>
					{/* {values.length > 0 ? values[1] : MAX} */}
					{values[1]}
				</span>{' '}
				грн
			</p>
			<Slider
				className={'slider'}
				// value={values.length > 0 ? values : [MIN, MAX]}
				value={values}
				min={MIN}
				max={MAX}
				onAfterChange={setValues}
				step={10}
			/>
		</div>
	)
}

export default PriceFilter
