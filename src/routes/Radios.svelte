<script lang="ts">
	import {
		Container,
		Table
	} from 'sveltestrap';
	import { players } from '../stores/players';

</script>

<Container>
	<Table responsive size="sm">
		<thead class="thead-dark">
			<tr>
				<th>Radio</th>
				<th>Playlist</th>
			</tr>
		</thead>
		<tbody>
			{#each ($players.filter(p => p.playerId && p.playerId.startsWith('R'))) as player}
				<tr>
					<td>{player.playerId}</td>
					<td>{player.playlistName}</td>
				</tr>
			{/each}
		</tbody>
	</Table>
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
