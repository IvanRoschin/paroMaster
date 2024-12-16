'use client'

import { addNewLid } from '@/actions/lids'
import AddLidForm from '@/components/AddLidForm'
import Logo from '@/components/Logo'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'

const containerStyle = {
	width: '100%',
	height: '400px',
	borderRadius: '10px',
	boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
}

const center = {
	lat: 50.52175, // Координаты центра карты (например, Ирпень)
	lng: 30.25055,
}

const ContactPage = () => {
	return (
		<div className='container mx-auto p-8'>
			<h2 className='text-4xl font-bold mb-8 text-center text-primaryAccentColor'>Контакти</h2>

			{/* Google Maps */}
			<section className='mb-8'>
				<div className='flex flex-col items-center'>
					<div className='flex flex-row justify-center items-baseline'>
						<FaMapMarkerAlt className='inline-block mr-1 subtitle' />
						<Logo />
					</div>
					<p>
						<h3 className='subtitle mb-4 flex justify-center items-center'>на Google карті</h3>
					</p>
				</div>
				<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
					<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
						<Marker position={center} />
					</GoogleMap>
				</LoadScript>
			</section>
			<div className='flex flex-col lg:flex-row justify-between items-start'>
				{' '}
				{/* Working Hours */}
				<section className='mb-8'>
					<h3 className='subtitle mb-4 flex justify-center items-center'>
						<FaCalendarAlt className='inline-block mr-1' /> Режим роботи
					</h3>
					<p className='text-lg text-gray-700'>
						<strong>Понеділок - П&apos;ятниця:</strong> <br /> 9:00 - 18:00
					</p>
					<p className='text-lg text-gray-700'>
						<strong>Субота:</strong> 10:00 - 16:00
					</p>
					<p className='text-lg text-gray-700'>
						<strong>Неділя:</strong> Вихідний
					</p>
				</section>
				{/* Contact Form */}
				<section>
					<AddLidForm action={addNewLid} title='Замовити зворотній дзвінок' subtitle />
				</section>
			</div>
		</div>
	)
}

export default ContactPage
