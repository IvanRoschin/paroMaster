'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import './PriceFilter.css'
const currencySymbol = '\u20B4'

const PriceFilter = ({ minPrice, maxPrice }: { minPrice: number; maxPrice: number }) => {
	const [values, setValues] = useState<string[]>([
		minPrice.toLocaleString(),
		maxPrice.toLocaleString(),
	])
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { push } = useRouter()

	const createQueryString = useCallback(
		(low: string, high: string) => {
			const params = new URLSearchParams(searchParams.toString())
			if (low) {
				params.set('low', low)
			} else {
				params.delete('low')
			}
			if (high) {
				params.set('high', high)
			} else {
				params.delete('high')
			}
			return params.toString()
		},
		[searchParams],
	)

	useEffect(() => {
		if (values) {
			const handleClick = (low: string, high: string) => {
				const queryString = createQueryString(low, high)
				push(pathname + '?' + queryString, { scroll: false })
			}
			handleClick(values[0], values[1])
		}
	}, [values])

	// const handleClick = (low: string, high: string) => {
	// 	const queryString = createQueryString(low, high)
	// 	push(pathname + '?' + queryString, { scroll: false })
	// }

	// const handleClick = (low: string, high: string) => {
	// 	push(pathname + '?' + createQueryString('low', newBrand as string), { scroll: false })
	// }

	return (
		<div className='double-slider-box'>
			<h2 className='text-2xl text-primaryAccentColor mb-6 bold'>Ціна</h2>{' '}
			<div className='range-slider'>
				<span className='slider-track'></span>
				{/* <Slider
					className={'slider'}
					value={values.length > 0 ? values : [minPrice, maxPrice]}
					min={minPrice}
					max={maxPrice}
					onAfterChange={setValues}
					step={1}
				/> */}
				<input
					type='range'
					name='min_val'
					className='min-val'
					min={minPrice}
					max={maxPrice}
					value={values.length > 0 ? values[0] : minPrice}
					onChange={e => setValues([e.target.value, values[1]])}
				/>
				<input
					type='range'
					name='max_val'
					className='max-val'
					min={minPrice}
					max={maxPrice}
					value={values.length > 0 ? values[1] : maxPrice}
					onChange={e => setValues([values[0], e.target.value])}
				/>
				<div className='tooltip min-tooltip'>
					{values[0]} {currencySymbol}
				</div>
				<div className='tooltip max-tooltip'>
					{values[1]} {currencySymbol}
				</div>
			</div>
			<div className='input-box'>
				<div className='min-box'>
					<div className='input-wrap'>
						<span className='input-addon'>від</span>
						<input
							type='text'
							name='min_input'
							className='input-field'
							value={values[0]}
							onChange={e => {
								const newValue = e.target.value.replace(/\D/g, '')
								setValues([newValue, values[1]])
							}}
							pattern='[0-9]*'
						/>
					</div>
				</div>
				<div className='max-box'>
					<div className='input-wrap'>
						<span className='input-addon'>до</span>
						<input
							type='text'
							name='max_input'
							className='input-field'
							value={values[1]}
							onChange={e => {
								const newValue = e.target.value.replace(/\D/g, '')
								setValues([values[0], newValue])
							}}
							pattern='[0-9]*'
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PriceFilter

// import { usePathname, useRouter, useSearchParams } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import Slider from 'react-slider'
// import './PriceFilter.css'

// const MIN = 100
// const MAX = 400

// const PriceFilter = async () => {
// 	const [values, setValues] = useState<number[]>([MIN, MAX])
// 	const router = useRouter()
// 	const pathName = usePathname()
// 	const params = useSearchParams()

// 	useEffect(() => {
// 		const params = new URLSearchParams(window.location.search)
// 		// if (values.length > 0) {
// 		params.set('low', values[0].toString())
// 		params.set('high', values[1].toString())

// 		window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
// 		if (params.get('search')) {
// 			router.push(
// 				`/${pathName}?low=${values[0].toString()}&high=${values[1].toString()}&search=${params.get(
// 					'search',
// 				)}`,
// 				{
// 					scroll: false,
// 				},
// 			)
// 		}
// 		// else if ( params.get( 'sort' ) ) {
// 		// 	router.push(
// 		// 		`/${pathName}?low=${values[0].toString()}&high=${values[1].toString()}&sort=${params.get(
// 		// 			'sort',
// 		// 		)}`,
// 		// 		{
// 		// 			scroll: false,
// 		// 		},
// 		// 	)
// 		// } else {
// 		// 	router.push(`/${pathName}?low=${values[0].toString()}&high=${values[1].toString()}`, {
// 		// 		scroll: false,
// 		// 	})
// 		// }
// 		// } else {
// 		//   params.delete("low");
// 		//   params.delete("high");
// 		// }
// 	}, [pathName, router, values])

// 	return (
// 		<div className='my-10 w-[250px] p-2'>
// 			<h2 className='text-2xl text-primaryAccentColor mb-4 bold'>Ціна</h2>
// 			<p className='mb-[20px]'>
// 				<span className='inline-block w-[30px]'>
// 					{/* {values.length > 0 ? values[0] : MIN} */}
// 					{values[0]}
// 				</span>{' '}
// 				грн -{' '}
// 				<span className='inline-block w-[30px]'>
// 					{/* {values.length > 0 ? values[1] : MAX} */}
// 					{values[1]}
// 				</span>{' '}
// 				грн
// 			</p>
// 			<Slider
// 				className={'slider'}
// 				// value={values.length > 0 ? values : [MIN, MAX]}
// 				value={values}
// 				min={MIN}
// 				max={MAX}
// 				onAfterChange={setValues}
// 				step={10}
// 			/>
// 		</div>
// 	)
// }

// export default PriceFilter
