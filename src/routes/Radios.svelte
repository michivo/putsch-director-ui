<script lang="ts">
	import { Button, Container, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Table } from 'sveltestrap';
	import { players } from '../stores/players';
	import type { PlayerQuestStage } from '../types/PlayerQuestStage';
	import { resetPlayer } from '../services/eventhub';

	let radioBeingReset: PlayerQuestStage | undefined = undefined;
	let resetModalOpen = false;
	let resetting = false;

	function openResetRadioModal(radio: PlayerQuestStage | undefined = undefined) {
		radioBeingReset = radio;
		openModal();
	}

	async function resetCurrentRadio() {
		try {
			resetting = true;
			if (radioBeingReset) {
				await resetPlayer(radioBeingReset.playerId);
			}
		} finally {
			closeModal();
			radioBeingReset = undefined;
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
				<th>Radio</th>
				<th>Playlist</th>
				<th>&nbsp;</th>
			</tr>
		</thead>
		<tbody>
			{#each $players.filter((p) => p.playerId && p.playerId.startsWith('R')) as radio}
				<tr>
					<td>{radio.playerId}</td>
					<td>{radio.playlistName}</td>
					<td>
						<Button class="p-0" title="Zurücksetzen" on:click={() => openResetRadioModal(radio)}>
							<Icon style="color:var(--bs-red)" name="person-x" class="putsch-action-button" />
						</Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>
	<Modal isOpen={resetModalOpen}>
		<ModalHeader>Zurücksetzen</ModalHeader>
		<ModalBody>
			Willst du Radio {radioBeingReset?.playerId} wirklich zurücksetzen?
		</ModalBody>
		<ModalFooter>
			{#if !resetting}
				<Button color="danger" on:click={resetCurrentRadio}>Ja</Button>
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
