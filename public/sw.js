self.addEventListener('sync', (event) => {
	console.log({ event })
})

self.addEventListener('push', (event) => {
	console.log({ event: Object.entries(event.data) })
})
