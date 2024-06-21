'use server'

// lib/novaPoshta.ts

import axios from 'axios'

// Create an instance of axios
const novaPoshtaApi = axios.create({
	baseURL: 'https://api.novaposhta.ua/v2.0/json/Address/getCities',
})

// Define the server action to get data from Nova Poshta
export async function getData(body: any) {
	try {
		const { data, status } = await novaPoshtaApi.post(``, body)
		if (status !== 200) {
			throw new Error(`Failed to fetch data: ${status}`)
		}
		console.log('data', data)
		return { success: true, data }
	} catch (error) {
		// Return error object
		return { success: false, error: error }
	}
}
