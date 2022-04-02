export const calculateHeaderHeight = () => {
	if (typeof document !== 'undefined') {
		const headers = document.getElementsByTagName('header')
		if (headers && headers.length) {
			return headers[0].clientHeight
		}
	}
	return 0
}

export const requiresUpdate = (o1: any, o2: any) => {
	if (!o1 || !o2) {
		return true
	}
	// Object.keys() doesn't work on a ClientRect
	// https://stackoverflow.com/questions/39417566/how-best-to-convert-a-clientrect-domrect-into-a-plain-object
	for (const key in o1) {
		if (o1[key] !== o2[key]) {
			return true
		}
	}
	return false
}
