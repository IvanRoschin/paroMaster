export const ReactIcon = styled.div<{ color?: string; hoverColor?: string }>`
	display: flex;
	justify-content: center;
	align-items: center;
	svg {
		color: ${({ color }) => color ?? 'black'};
	}
	svg:hover {
		color: ${({ hoverColor }) => hoverColor ?? 'red'};
	}
`
