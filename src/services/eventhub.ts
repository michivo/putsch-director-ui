async function resetPlayer(playerId: string | undefined = undefined): Promise<void> {
	const requestBody = playerId ? { playerId } : {};
	await fetch('https://putsch-event-hub.uc.r.appspot.com/api/v1/events/players/resetRequests', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});
}

async function triggerEvent(playerId: string, sensorId: string): Promise<void> {
	const requestBody = {
		playerId, sensorId, value: ''
	};
	await fetch('https://putsch-event-hub.uc.r.appspot.com/api/v1/events', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});
}

export { resetPlayer, triggerEvent };