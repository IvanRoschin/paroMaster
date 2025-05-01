"use client"
import { FallingLines } from "react-loader-spinner"

const Loader: React.FC = () => {
  return (
    <div
      className="
			h-[60vh]
			flex
			flex-col
			gap-2
			justify-center
			items-center"
    >
      <FallingLines color="#EA580C" width="100" visible={true} />
    </div>
  )
}

export default Loader
