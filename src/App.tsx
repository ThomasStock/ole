import { useEffect, useRef, useState } from 'react'
import useCalculateSize from './useCalculateSize'

// https://www.kirupa.com/canvas/canvas_high_dpi_retina.htm

const map = { width: 800, height: 900 }
const field = { width: 400, height: 500 }

const App = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const { measuredRef, box } = useCalculateSize()
	const [context, setContext] = useState<CanvasRenderingContext2D>()
	const [canvasScale, setCanvasScale] = useState<number>(1)

	const scale = (number: number) => number * canvasScale
	const scaleSet = <T extends number[]>(...args: T): T => args.map((arg) => arg * canvasScale) as T

	useEffect(() => {
		const canvasContext = canvasRef.current!.getContext('2d')
		if (canvasContext) {
			setContext(canvasContext)
		}
	}, [])

	useEffect(() => {
		const canvas = canvasRef.current
		if (canvas && box) {
			const mapAspectRatio = map.width / map.height
			const boxAspectRatio = box.width / box.height

			if (mapAspectRatio > boxAspectRatio) {
				canvas.width = box.width
				canvas.height = box.width / mapAspectRatio
			} else {
				canvas.height = box.height
				canvas.width = box.height * mapAspectRatio
			}

			setCanvasScale(canvas.width / map.width)
		}
	}, [box, context])

	const draw = () => {
		if (context && canvasRef.current) {
			context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)

			let mapPath = new Path2D()
			const scaledMapRect = scaleSet(
				(map.width - field.width) / 2,
				(map.height - field.height) / 2,
				field.width,
				field.height,
			)
			console.log('scaledMapRect', scaledMapRect)
			mapPath.rect(...scaledMapRect)
			context.stroke(mapPath)
		}
	}

	draw()

	return (
		<div ref={measuredRef} className="root">
			<canvas ref={canvasRef}></canvas>
		</div>
	)
}

export default App
