<script lang="ts">
	import {
		Button,
		FormGroup,
		Icon,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Spinner,
		Table
	} from 'sveltestrap';
	import AutoComplete from 'simple-svelte-autocomplete';
	import { getAllQuests, resetPlayer, startQuestForPlayer, triggerEventsBatch } from '../services/eventhub';
	import { players } from '../stores/players';
	import type { PlayerQuestStage } from '../types/PlayerQuestStage';
	import type { AgentSelection } from '../types/AgentSelection';
	import { onMount } from 'svelte';
	import type { StageSelection } from '../types/StageSelection';
	import type { Quest } from '../types/Quest';

	let playerBeingReset: PlayerQuestStage | undefined = undefined;
	let resetModalOpen = false;
	let startQuestModalOpen = false;
	let triggerEventModalOpen = false;
	let setStageModalOpen = false;
	let processing = false;
	let resetting = false;
	let selectedPlayers: AgentSelection[] = [];
	let sensorId = '';
	let questId = '';
	let stageId: StageSelection | undefined = undefined;
	let allQuestIds: string[] = [];
	let allStageIds: StageSelection[] = [];
	let allQuests: Quest[] = [];

	$: allStageIds = allQuests.filter(q => !questId || q.id === questId).flatMap(q => q.stages.map((s, idx) => ({ index: idx + 1, playlistName: `${idx + 1}: ${s.playlistName}` })));

	onMount(async () => {
		let quests = await getAllQuests();
		if(quests) {
			allQuests = quests;
			allQuestIds = allQuests.map(q => q.id);
		}
	});

	players.subscribe((allPlayers) => {
		for (const player of allPlayers) {
			if (!selectedPlayers.find((p) => p.player.playerId === player.playerId) && player.playerId && player.playerId.startsWith('P')) {
				selectedPlayers.push({
					player: player,
					active: false
				});
			}
		}
	});

	function getStageIndexLabel(player: PlayerQuestStage): string | number {
		if (player.stageIndex === undefined) {
			return '';
		}
		if (player.stageIndex === -1) {
			return '--Ende--';
		}
		if (player.stageCount) {
			return `${player.stageIndex} / ${player.stageCount}`;
		}

		return player.stageIndex;
	}

	function openResetPlayerModal(player: PlayerQuestStage | undefined = undefined) {
		playerBeingReset = player;
		openModal();
	}

	async function resetCurrentPlayer() {
		try {
			resetting = true;
			if (playerBeingReset) {
				await resetPlayer(playerBeingReset.playerId);
			} else {
				await resetPlayer();
			}
		} finally {
			closeModal();
			playerBeingReset = undefined;
			resetting = false;
		}
	}

	const openModal = () => {
		resetModalOpen = true;
	};

	const closeModal = () => {
		resetModalOpen = false;
	};

	const startQuest = () => {
		startQuestModalOpen = true;
	};

	const closeStartQuestModal = () => {
		startQuestModalOpen = false;
	};

	const doStartQuest = async () => {
		processing = true;
		try {
			for (const player of selectedPlayers.filter((p) => p.active)) {
				await startQuestForPlayer(
					player.player.playerId,
					questId,
				);
			}
		} finally {
			processing = false;
			startQuestModalOpen = false;
		}
	};

	const triggerEvent = () => {
		triggerEventModalOpen = true;
	};

	const closeTriggerEventModal = () => {
		triggerEventModalOpen = false;
	};

	const doTriggerEvent = async () => {
		processing = true;
		try {
			await triggerEventsBatch(
				sensorId,
				selectedPlayers.filter((p) => p.active).map((p) => p.player.playerId)
			);
		} finally {
			processing = false;
			triggerEventModalOpen = false;
		}
	};

	const setStage = () => {
		setStageModalOpen = true;
	};

	const closeSetStageModal = () => {
		setStageModalOpen = false;
	};

	const doSetStage = async () => {
		processing = true;
		try {
			await triggerEventsBatch(
				sensorId,
				selectedPlayers.filter((p) => p.active).map((p) => p.player.playerId)
			);
		} finally {
			processing = false;
			setStageModalOpen = false;
		}
	};

	const toggleAll = () => {
		const targetValue = selectedPlayers.some((p) => !p.active);
		selectedPlayers.forEach((p) => (p.active = targetValue));
		selectedPlayers = selectedPlayers;
	};

	const togglePlayer = (player: PlayerQuestStage) => {
		const selectedPlayer = selectedPlayers.find((p) => p.player.playerId === player.playerId);
		if (!selectedPlayer) {
			selectedPlayers.push({
				player: player,
				active: true
			});
		} else {
			selectedPlayer.active = !selectedPlayer.active;
		}
		selectedPlayers = selectedPlayers;
	};
</script>

<div class="px-5">
	<Table responsive striped size="sm">
		<thead class="thead-dark">
			<tr>
				<th
					><input
						type="checkbox"
						on:change={() => toggleAll()}
						checked={!selectedPlayers.some((p) => !p.active)}
					/></th
				>
				<th>Sp*in</th>
				<th class="current-location">Ort</th>
				<th>Quest</th>
				<th>Stage</th>
				<th class="quests-complete">Abgeschlossen</th>
				<th>Aktion</th>
			</tr>
		</thead>
		<tbody>
			{#each $players.filter((p) => p.playerId && p.playerId.startsWith('P')) as player}
				<tr>
					<td
						><input
							type="checkbox"
							on:change={() => togglePlayer(player)}
							checked={selectedPlayers.find(
								(selectedPlayer) => selectedPlayer.player.playerId === player.playerId
							)?.active}
						/></td
					>
					<td>{player.playerId}</td>
					<td class="current-location">{player.currentLocation}</td>
					<td>{player.questId}</td>
					<td>{getStageIndexLabel(player)}</td>
					<td class="quests-complete">{player.questsComplete ?? []}</td>
					<td>
						<Button class="p-0 m-0" title="Zurücksetzen" on:click={() => openResetPlayerModal(player)}>
							<Icon style="color:var(--bs-red)" name="person-x" class="putsch-action-button" />
						</Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>
	<div class="buttons">
		<Button
			class="mx-1 py-1"
			color="info"
			title="Quest starten"
			disabled={!selectedPlayers.some((p) => p.active) || processing}
			on:click={() => startQuest()}>Quest starten</Button
		>
		<Button
			class="mx-1 py-1"
			color="info"
			title="Event triggern"
			disabled={!selectedPlayers.some((p) => p.active) || processing}
			on:click={() => triggerEvent()}>Event triggern</Button
		>
		<Button
			class="mx-1 py-1"
			color="warning"
			title="Event triggern"
			disabled={!selectedPlayers.some((p) => p.active) || processing}
			on:click={() => setStage()}>Stufe setzen</Button
		>
		{#if processing}
			<Spinner />
		{/if}
		<Button
			class="float-end py-1"
			color="danger"
			title="Alle zurücksetzen"
			on:click={() => openResetPlayerModal()}>Alle zurücksetzen</Button
		>
	</div>
	<Modal isOpen={resetModalOpen}>
		<ModalHeader>Zurücksetzen</ModalHeader>
		<ModalBody>
			{#if playerBeingReset}
				Willst du Spieler*in {playerBeingReset.playerId} wirklich zurücksetzen?
			{:else}
				Willst du <em>alle</em> Spieler*innen zurücksetzen?
			{/if}
		</ModalBody>
		<ModalFooter>
			{#if !resetting}
				<Button color="danger" on:click={resetCurrentPlayer}>Ja</Button>
				<Button color="info" on:click={closeModal}>Nein</Button>
			{:else}
				<Spinner />
			{/if}
		</ModalFooter>
	</Modal>
	<Modal isOpen={triggerEventModalOpen}>
		<ModalHeader>Event triggern</ModalHeader>
		<ModalBody>
			<label
				>Sensor-ID
				<input bind:value={sensorId} placeholder="Sensor-ID" />
			</label>
		</ModalBody>
		<ModalFooter>
			{#if !processing}
				<Button color="primary" disabled={!sensorId} on:click={doTriggerEvent}>OK</Button>
				<Button color="info" on:click={closeTriggerEventModal}>Abbrechen</Button>
			{:else}
				<Spinner />
			{/if}
		</ModalFooter>
	</Modal>
	<Modal isOpen={startQuestModalOpen}>
		<ModalHeader>Quest starten</ModalHeader>
		<ModalBody>
			<label
				>Quest-ID
				<input bind:value={questId} placeholder="Quest-ID" />
			</label>
		</ModalBody>
		<ModalFooter>
			{#if !processing}
				<Button color="primary" disabled={!questId} on:click={doStartQuest}>OK</Button>
				<Button color="info" on:click={closeStartQuestModal}>Abbrechen</Button>
			{:else}
				<Spinner />
			{/if}
		</ModalFooter>
	</Modal>
	<Modal isOpen={setStageModalOpen}>
		<ModalHeader>Stufe setzen</ModalHeader>
		<ModalBody>
			<FormGroup>	
				<label for="quest-selection">Quest-ID</label>
				<AutoComplete id="quest-selection" items="{allQuestIds}" bind:selectedItem="{questId}" />
			</FormGroup>
			<FormGroup>
				<label for="stage-selection">Stage-ID</label>
				<AutoComplete disabled={!questId} id="stage-selection" items="{allStageIds}" bind:selectedItem="{stageId}" 
				labelFieldName='playlistName' />
			</FormGroup>
		</ModalBody>
		<ModalFooter>
			{#if !processing}
				<Button color="primary" disabled={!questId || !stageId} on:click={doSetStage}>OK</Button>
				<Button color="info" on:click={closeSetStageModal}>Abbrechen</Button>
			{:else}
				<Spinner />
			{/if}
		</ModalFooter>
	</Modal>
</div>

<style>
	th {
		font-weight: 900;
		background-color: black;
		color: white;
	}

	th,
	td {
		padding-top: 0;
		padding-bottom: 0;
	}

	:global(.putsch-action-button) {
		font-size: 1.2rem;
	}
</style>
