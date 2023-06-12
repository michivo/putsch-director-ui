import type { Quest } from "../types/Quest";

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

async function startQuestForPlayer(playerId: string, questId: string): Promise<void> {
	const requestBody = {
		playerId, questId
	};
	await fetch('https://putsch-event-hub.uc.r.appspot.com/api/v1/events/quests/startRequests', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});
}

async function triggerEventsBatch(sensorId: string, playerIds: string[]) {
	const requestBody = playerIds.map(p => ({
		playerId: p,
		sensorId,
		value: '',
	}));

	await fetch('https://putsch-event-hub.uc.r.appspot.com/api/v1/events/batch', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});
}


async function getAllQuests() {
	const response = await fetch(
	  'https://putsch-event-hub.uc.r.appspot.com/api/v1/game-data/quests',
	  { method: 'GET', headers: {
		'Cache-Control': 'no-cache' } }
	);
	const data = (await response.json()) as Quest[] | undefined;
	return data;
  }

async function setCurrentStage(playerIds: string[], questId: string, stageIndex: number) {
	const requestBody = playerIds.map(p => ({
		playerId: p,
		questId,
		stageIndex,
	}));

	await fetch('https://putsch-event-hub.uc.r.appspot.com/api/v1/currentStage', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});
}

export { resetPlayer, triggerEvent, startQuestForPlayer, triggerEventsBatch, getAllQuests, setCurrentStage };