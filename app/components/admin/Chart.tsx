'use client'

import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
	{
		name: 'Понеділок',
		visit: 4000,
		click: 2400,
	},
	{
		name: 'Вівторок',
		visit: 2000,
		click: 1400,
	},
	{
		name: 'Середа',
		visit: 3000,
		click: 200,
	},
	{
		name: 'Четвер',
		visit: 2780,
		click: 3908,
	},
	{
		name: "П'ятниця",
		visit: 4800,
		click: 2181,
	},
	{
		name: 'Субота',
		visit: 3800,
		click: 2500,
	},
	{
		name: 'Неділя',
		visit: 4300,
		click: 2100,
	},
]

const Chart = () => {
	return (
		<div>
			<h2>Weecly Recap</h2>
			<ResponsiveContainer width='100%' height='100%'>
				<LineChart
					width={500}
					height={300}
					data={data}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<XAxis dataKey='name' />
					<YAxis />
					<Tooltip contentStyle={{ background: '#151c2c', border: 'none' }} />
					<Legend />
					<Line type='monotone' dataKey='visit' stroke='#8884d8' strokeDasharray='5 5' />
					<Line type='monotone' dataKey='click' stroke='#82ca9d' strokeDasharray='3 4 5 2' />
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

export default Chart
