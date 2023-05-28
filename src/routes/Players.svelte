<script lang="ts">
	import {
		Button,
		Container,
		Icon,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Spinner,
		Table
	} from 'sveltestrap';
	import { resetPlayer } from '../services/eventhub';
	import { players } from '../stores/players';
	import type { PlayerQuestStage } from '../types/PlayerQuestStage';

	type Selection = {
		player: PlayerQuestStage;
		active: boolean;
	};

	let playerBeingReset: PlayerQuestStage | undefined = undefined;
	let resetModalOpen = false;
	let startQuestModalOpen = false;
	let triggerEventModalOpen = false;
	let resetting = false;
	let selectedPlayers: Selection[] = [];

	players.subscribe((allPlayers) => {
		for (const player of allPlayers) {
			if (!selectedPlayers.find((p) => p.player.playerId === player.playerId)) {
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

	const doStartQuest = () => {
		startQuestModalOpen = false;
	};

	const triggerEvent = () => {
		triggerEventModalOpen = true;
	};

	const closeTriggerEventModal = () => {
		triggerEventModalOpen = false;
	};

	const doTriggerEvent = () => {
		triggerEventModalOpen = false;
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

<Container>
	<Table responsive size="sm">
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
				<th>Ort</th>
				<th>Quest</th>
				<th>Stage</th>
				<th>Abgeschlossen</th>
				<th />
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
					<td>{player.currentLocation}</td>
					<td>{player.questId}</td>
					<td>{getStageIndexLabel(player)}</td>
					<td>{player.questsComplete ?? []}</td>
					<td>
						<Button class="p-0" title="Zurücksetzen" on:click={() => openResetPlayerModal(player)}>
							<Icon style="color:var(--bs-red)" name="person-x" class="putsch-action-button" />
						</Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>
	<div class="buttons">
		<Button
			class="mx-1"
			color="info"
			title="Quest starten"
			disabled={!selectedPlayers.some((p) => p.active)}
			on:click={() => startQuest()}>Quest starten</Button
		>
		<Button
			class="mx-1"
			color="info"
			title="Event triggern"
			disabled={!selectedPlayers.some((p) => p.active)}
			on:click={() => triggerEvent()}>Event triggern</Button
		>		
		<Button
			class="float-end"
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
			TODO
		</ModalBody>
		<ModalFooter>
			{#if !resetting}
				<Button color="danger" on:click={doTriggerEvent}>OK</Button>
				<Button color="info" on:click={closeTriggerEventModal}>Abbrechen</Button>
			{:else}
				<Spinner />
			{/if}
		</ModalFooter>
	</Modal>
	<Modal isOpen={startQuestModalOpen}>
		<ModalHeader>Quest starten</ModalHeader>
		<ModalBody>
			TODO
		</ModalBody>
		<ModalFooter>
			{#if !resetting}
				<Button color="danger" on:click={doStartQuest}>OK</Button>
				<Button color="info" on:click={closeStartQuestModal}>Abbrechen</Button>
			{:else}
				<Spinner />
			{/if}
		</ModalFooter>
	</Modal>		
</Container>

<style>
	th {
		font-weight: 900;
		background-color: black;
		color: white;
	}

	th, td {
		padding-top: 0;
		padding-bottom: 0;
	}

	:global(.putsch-action-button) {
		font-size: 1.25rem;
	}
</style>
