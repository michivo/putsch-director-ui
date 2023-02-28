<script lang="ts">
	import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore';
	import { onDestroy, onMount } from 'svelte';
	import { Table } from 'sveltestrap';
	import { putschFirestore } from '../tools/firebase';
	import type { PlayerQuestStage } from '../types/PlayerQuestStage';

	let firestoreUnsubscribe: Unsubscribe;
	let playerData: PlayerQuestStage[] = [];

	onMount(async () => {
		playerData = [];
		await initFirestore();
	});

	onDestroy(() => {
		if (firestoreUnsubscribe) {
			firestoreUnsubscribe();
		}
	});

	async function initFirestore() {
		const docRef = collection(putschFirestore, 'playerQuests');

		firestoreUnsubscribe = onSnapshot(docRef, (data) => {
			if (data.empty) {
				playerData = [];
			} else {
				const newPlayerData: PlayerQuestStage[] = [];
				data.forEach((doc) => {
					const item = doc.data() as PlayerQuestStage;
					newPlayerData.push(item);
				});
				playerData = newPlayerData.sort(comparePlayers);
			}
		});
	}

	
	function comparePlayers(p1: PlayerQuestStage, p2: PlayerQuestStage) : number {
		if(p1.playerId.match(/P\d+/) && p2.playerId.match(/P\d+/)) {
			const id1 = Number.parseInt(p1.playerId.substring(1));
			const id2 = Number.parseInt(p2.playerId.substring(1));

			return id1 - id2;
		} 

		if(p1.playerId.match(/P\d+/)) {
			return -1;
		}

		if(p2.playerId.match(/P\d+/)) {
			return 1;
		}

		return p1.playerId.localeCompare(p2.playerId);
	}
</script>

<Table responsive size="sm">
	<thead class="thead-dark">
		<tr>
			<th>Spieler*in</th>
			<th>Ort</th>
			<th>Quest</th>
			<th>Stage</th>
		</tr>
	</thead>
	<tbody>
		{#each playerData as player}
			<tr>
				<td>{player.playerId}</td>
				<td>{player.currentLocation}</td>
				<td>{player.questId}</td>
				<td>{player.stageIndex === -1 ? '--Ende--' : player.stageIndex}</td>
			</tr>
		{/each}
	</tbody>
</Table>

<style>
	th {
		font-weight: 900;
		background-color: black;
		color: white;
	}
</style>