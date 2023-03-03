async function resetPlayer(playerId: string): Promise<void> {
	const requestBody = { playerId };
	await fetch('https://putsch-event-hub.uc.r.appspot.com/api/v1/events/players/resetRequests', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});
}

export { resetPlayer };