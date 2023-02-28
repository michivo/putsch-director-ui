<script lang="ts">
	import { Table } from 'sveltestrap';
	import { players } from '../stores/players';
	import type { PlayerQuestStage } from '../types/PlayerQuestStage';

	function getStageIndexLabel(player: PlayerQuestStage) : string | number {
		if(player.stageIndex === undefined) {
			return '';
		}
		if(player.stageIndex === -1) {
			return '--Ende--';
		}
		if(player.stageCount) {
			return `${player.stageIndex} / ${player.stageCount}`;
		}
		
		return player.stageIndex;
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
		{#each $players as player}
			<tr>
				<td>{player.playerId}</td>
				<td>{player.currentLocation}</td>
				<td>{player.questId}</td>
				<td>{getStageIndexLabel(player)}</td>
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