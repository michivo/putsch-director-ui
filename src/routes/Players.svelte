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

	let playerBeingReset: PlayerQuestStage | undefined = undefined;
	let resetModalOpen = false;
	let resetting = false;

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
</script>

<Container>
	<Table responsive size="sm">
		<thead class="thead-dark">
			<tr>
				<th>Sp*in</th>
				<th>Ort</th>
				<th>Quest</th>
				<th>Stage</th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each ($players.filter(p => p.playerId && p.playerId.startsWith('P'))) as player}
				<tr>
					<td>{player.playerId}</td>
					<td>{player.currentLocation}</td>
					<td>{player.questId}</td>
					<td>{getStageIndexLabel(player)}</td>
					<td
						><Button class="p-0" title="Zurücksetzen" on:click={() => openResetPlayerModal(player)}
							><Icon
								style="color:var(--bs-red)"
								name="person-x"
								class="putsch-action-button"
							/></Button
						></td
					>
				</tr>
			{/each}
		</tbody>
	</Table>
	<Button
		class="float-end"
		color="danger"
		title="Alle zurücksetzen"
		on:click={() => openResetPlayerModal()}>Alle zurücksetzen</Button
	>
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
</Container>

<style>
	th {
		font-weight: 900;
		background-color: black;
		color: white;
	}

	:global(.putsch-action-button) {
		font-size: 1.25rem;
	}
</style>
