'use client'
import React, { useContext } from 'react'

type ContainerProps = {
	children: React.ReactNode
}

type TypeExContextType = {
	exampleTsx: string
	setExampleTsx: React.Dispatch<React.SetStateAction<string>>
}

const typeExContextState = {
	exampleTsx: '',
	setExampleTsx: () => '',
}

const Context = React.createContext<TypeExContextType>(typeExContextState)

export const useMyContext = () => useContext(Context)

export const Provider = (props: ContainerProps) => {
	const [exampleTsx, setExampleTsx] = React.useState<string>('')
	return <Context.Provider value={{ exampleTsx, setExampleTsx }}>{props.children}</Context.Provider>
}
