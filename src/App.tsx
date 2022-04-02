import React, { useEffect, useRef, useState } from 'react'
import useCalculateSize from './useCalculateSize'
import useRerenderOnDimensionChange from './useRerenderOnDimensionChange'

// https://www.kirupa.com/canvas/canvas_high_dpi_retina.htm

const App = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const { measuredRef, box } = useCalculateSize()
	const [context, setContext] = useState<CanvasRenderingContext2D>()

	useEffect(() => {
		const canvasContext = canvasRef.current!.getContext('2d')
		if (canvasContext) {
			setContext(canvasContext)
		}
	}, [])

	useEffect(() => {
		const canvas = canvasRef.current
		console.log('canvas', canvasRef, canvas)
		if (canvas) {
			const { width, height, offsetHeight, offsetWidth } = canvas
			console.log('canvas', { width, height, offsetWidth, offsetHeight })
			canvas.width = offsetWidth
			canvas.height = offsetHeight

			draw()
		}
	}, [box])

	const draw = () => {
		if (context && canvasRef.current) {
			context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)

			const { width, height } = canvasRef.current

			let path1 = new Path2D()
			path1.rect(width * 0.1, height * 0.4, width * 0.2, width * 0.2)

			let path2 = new Path2D(path1)
			path2.moveTo(width * 0.8, height * 0.4 + width * 0.1)
			path2.arc(width * 0.7, height * 0.4 + width * 0.1, width * 0.1, 0, 2 * Math.PI)

			context.stroke(path2)
		}
	}

	return (
		<div ref={measuredRef}>
			<canvas ref={canvasRef}></canvas>
		</div>
	)
}

export default App
