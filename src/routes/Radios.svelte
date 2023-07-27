<script lang="ts">
	import {
		Button,
		Container,
		FormGroup,
		Icon,
		Input,
		Label,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Spinner,
		Table
	} from 'sveltestrap';
	import { players } from '../stores/players';
	import type { PlayerQuestStage } from '../types/PlayerQuestStage';
	import { getAllQuests, resetPlayer, startQuestForPlayer } from '../services/eventhub';
	import type { Quest } from '../types/Quest';
	import type { AgentSelection } from '../types/AgentSelection';

	let radioBeingReset: PlayerQuestStage | undefined = undefined;
	let resetModalOpen = false;
	let startQuestModalOpen = false;
	let resetting = false;
	const radios = [
		'R1',
		'R2',
		'R3',
		'R4',
		'R5',
		'R6',
		'R7',
		'R8',
		'R9',
		'R10',
		'R11',
		'R12',
		'R13',
		'R14',
		'R15',
		'R16',
		'R17',
		'R18',
		'R19',
		'R20',
		'R21',
		'R22',
	];
	let selectedRadios: AgentSelection[] = [];
	let allQuests = [] as Quest[];
	let selectedQuest = undefined as Quest | undefined;
	let processing = false;

	$: radioUndefined = selectedRadios.length === 0;
	$: questUndefined = !selectedQuest;

	players.subscribe((allRadios) => {
		for (const radio of allRadios) {
			if (
				!selectedRadios.find((p) => p.player.playerId === radio.playerId) &&
				radio.playerId &&
				radios.includes(radio.playerId)
			) {
				selectedRadios.push({
					player: radio,
					active: false
				});
			}
		}
	});

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

	const startPlaylist = async () => {
		processing = true;
		try {
			for (const selectedRadio of selectedRadios) {
				if (selectedRadio.active) {
					startQuestForPlayer(selectedRadio.player.playerId, selectedQuest!.id);
				}
			}
		} finally {
			startQuestModalOpen = false;
			processing = false;
		}
	};

	const openQuestModal = async () => {
		processing = true;
		try {
			selectedQuest = undefined;
			if (allQuests.length === 0) {
				const quests = await getAllQuests();
				if (quests) {
					allQuests = quests.filter(
						(q) => q.preconditionsPlayer && q.preconditionsPlayer.includes('R')
					);
				}
			}
			startQuestModalOpen = true;
		} finally {
			processing = false;
		}
	};

	const closeQuestModal = () => {
		startQuestModalOpen = false;
	};

	const toggleAll = () => {
		const targetValue = selectedRadios.some((p) => !p.active);
		selectedRadios.forEach((p) => (p.active = targetValue));
		selectedRadios = selectedRadios;
	};

	const toggleRadio = (player: PlayerQuestStage) => {
		const selectedPlayer = selectedRadios.find((p) => p.player.playerId === player.playerId);
		if (!selectedPlayer) {
			selectedRadios.push({
				player: player,
				active: true
			});
		} else {
			selectedPlayer.active = !selectedPlayer.active;
		}
		selectedRadios = selectedRadios;
	};
</script>

<Container>
	<Table responsive striped size="sm">
		<thead class="thead-dark">
			<tr>
				<th style="width: 1rem"
					><input
						type="checkbox"
						on:change={() => toggleAll()}
						checked={!selectedRadios.some((p) => !p.active)}
					/></th
				>
				<th>Radio</th>
				<th>Playlist</th>
				<th>Quest</th>
				<th>&nbsp;</th>
			</tr>
		</thead>
		<tbody>
			{#each $players.filter((p) => p.playerId && p.playerId.startsWith('R')) as radio}
				<tr>
					<td class="pb-0 pt-1"
						><input
							type="checkbox"
							on:change={() => toggleRadio(radio)}
							checked={selectedRadios.find(
								(selectedRadio) => selectedRadio.player.playerId === radio.playerId
							)?.active}
						/></td
					>
					<td class="py-1">{radio.playerId}</td>
					<td class="py-1">{radio.playlistName}</td>
					<td class="py-1">{radio.questId}</td>
					<td class="py-1">
						<Button class="p-0" title="Zurücksetzen" on:click={() => openResetRadioModal(radio)}>
							<Icon style="color:var(--bs-red)" name="person-x" class="putsch-action-button" />
						</Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>
	<div class="buttons mt-3">
		<Button
			class="mx-1 py-1"
			color="info"
			title="Quest starten"
			disabled={processing}
			on:click={openQuestModal}>Quest starten</Button
		>
	</div>
	<Modal isOpen={startQuestModalOpen}>
		<ModalHeader>Quest starten</ModalHeader>
		<ModalBody>
			{#if processing}
				<Spinner />
			{/if}
			<FormGroup>
				<Label for="questSelect">Quest</Label>
				<Input
					type="select"
					required
					name="radio"
					id="questSelect"
					bind:value={selectedQuest}
					bind:disabled={radioUndefined}
				>
					{#each allQuests as quest}
						<option value={quest}>{quest.id}</option>
					{/each}
				</Input>
			</FormGroup>
		</ModalBody>
		<ModalFooter>
			{#if !resetting}
				<Button color="danger" on:click={startPlaylist} bind:disabled={questUndefined}>OK</Button>
				<Button color="info" on:click={closeQuestModal}>Abbrechen</Button>
			{:else}
				<Spinner />
			{/if}
		</ModalFooter>
	</Modal>
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
