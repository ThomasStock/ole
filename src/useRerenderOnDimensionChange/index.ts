import useCalculateSize from '../useCalculateSize'

/* 
--------------
Example usage: 
--------------

const myComponent = () => {
	const measuredRef = useRerenderOnDimensionChange()

	return <div ref={measuredRef}>{children}}</div>
}

 */

/**
 * This hook exists because we needed a way to use the side effect of useCalculateSize, which
 * is triggering a new render but without using any of the returned properties, besides measuredRef.
 * In useCalculateSize we also return all kinds of info about the size of the component you refer to.
 *
 * **Example usage**: You want to recalculate a virtual scroller's items when the available space changes.
 *
 * @return {measuredRef} use this ref on a component when it's resize requires a re-render
 */
const useRerenderOnDimensionChange = () => {
	const { measuredRef } = useCalculateSize()
	return measuredRef
}

export default useRerenderOnDimensionChange
