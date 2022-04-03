import { useEffect, useRef, useState } from 'react'
import useCalculateSize from './useCalculateSize'

// https://www.kirupa.com/canvas/canvas_high_dpi_retina.htm
// https://codepen.io/matt-west/pen/naXPjb
// https://www.sitepoint.com/building-3d-engine-javascript/

const map = { width: 800, height: 900 }
const field = { width: 400, height: 500 }

type Vertex3D = { x: number; y: number; z: number }
type Face = Vertex3D[]
const createVertex = (x: number, y: number, z = 0) => ({ x, y, z })

const fieldFace: Face = [
	{ x: 0, y: 0, z: 0 },
	{ x: 400, y: 0, z: 0 },
	{ x: 400, y: 500, z: 0 },
	{ x: 0, y: 500, z: 0 },
]

const positionVertex = (startingPoint: Vertex3D, vertex: Vertex3D): Vertex3D => ({
	x: vertex.x + startingPoint.x,
	y: vertex.y + startingPoint.y,
	z: vertex.z + startingPoint.z,
})

const positionFace = (startingPoint: Vertex3D, face: Face): Face =>
	face.map((vertex) => positionVertex(startingPoint, vertex))

const App = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const { measuredRef, box } = useCalculateSize()
	const [context, setContext] = useState<CanvasRenderingContext2D>()
	const [canvasScale, setCanvasScale] = useState<number>(1)

	const scale = (number: number) => number * canvasScale

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

			const fieldX = fieldFace.reduce((maxX, vertex) => Math.max(maxX, vertex.x), 0)
			const fieldY = fieldFace.reduce((maxY, vertex) => Math.max(maxY, vertex.y), 0)
			const fieldStartingPoint = { x: (map.width - fieldX) / 2, y: (map.height - fieldY) / 2, z: 0 }

			const positionedFieldFace = positionFace(fieldStartingPoint, fieldFace)

			drawFace(context, positionedFieldFace, canvasScale)

			// const scaledMapRect = scaleSet(positionedFieldFace.x, positionedFieldFace.y, fieldX, fieldY)
			// console.log('scaledMapRect', scaledMapRect)
			// mapPath.rect(...scaledMapRect)
			// context.stroke(mapPath)
		}
	}

	draw()

	return (
		<div ref={measuredRef} className="root">
			<canvas ref={canvasRef}></canvas>
		</div>
	)
}

const drawFace = (context: CanvasRenderingContext2D, unscaledFace: Face, scale = 1) => {
	const scaleSet = <T extends number[]>(...args: T): T => args.map((arg) => arg * scale) as T

	const face = unscaledFace.map((vertex) => createVertex(...scaleSet(vertex.x, vertex.y, vertex.z)))

	let path = new Path2D()
	path.moveTo(face[0].x, face[0].y)

	const faceReversed = [...face].reverse()
	// Draw from first point to last point and then all the way back to the first point
	faceReversed.forEach((vertex) => {
		path.lineTo(vertex.x, vertex.y)
	})

	context.stroke(path)
}

export default App
