import React, { useCallback, useEffect, useState } from 'react'

import { Size } from './types'
import { calculateHeaderHeight, requiresUpdate } from './utils'

/* 
--------------
Example usage: 
--------------

const myComponent = () => {
	const { measuredRef, box, viewport, headerOffset } = useCalculateSize()

	return <div ref={measuredRef}>My dimensions are {box ? `${box.width}x${box.height}` : 'not calculated yet'}</div>
}

 */

interface ReturnType {
	measuredRef: React.Dispatch<any>
	box: ClientRect | undefined
	viewport: Size | undefined
	headerOffset: number | undefined
}

const useCalculateSize = (): ReturnType => {
	const [node, setNode] = useState<HTMLElement>()
	const [box, setBox] = useState<ClientRect>()
	const [viewport, setViewport] = useState<Size>()
	const [headerOffset, setHeaderOffset] = useState<number>()

	// https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
	const measuredRef = useCallback((nodeRef) => nodeRef && setNode(nodeRef), [])

	useEffect(() => {
		updateIfNeeded()
	})

	useEffect(() => {
		// Could use https://github.com/donavon/use-event-listener
		window.addEventListener('resize', updateIfNeeded)
		return () => {
			window.removeEventListener('resize', updateIfNeeded)
		}
	}, [node])

	const updateIfNeeded = () => {
		if (node) {
			const currentBox = node.getBoundingClientRect()
			if (requiresUpdate(box, currentBox)) {
				setBox(currentBox)
			}
			const currentViewport = {
				width: window.innerWidth,
				height: window.innerHeight,
			}
			if (requiresUpdate(viewport, currentViewport)) {
				setViewport(currentViewport)
			}

			setHeaderOffset(calculateHeaderHeight())
		}
	}

	return {
		measuredRef,
		box,
		viewport,
		headerOffset,
	}
}

export default useCalculateSize
