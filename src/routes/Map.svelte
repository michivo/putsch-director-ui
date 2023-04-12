<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { Badge, Container } from 'sveltestrap';
	import { players } from '../stores/players';
	import type { PlayerQuestStage } from '../types/PlayerQuestStage';

	let mapElement: HTMLElement;

	onMount(() => {
    const resizeObserver = new ResizeObserver(entries => {
      updatePositions();
    });

    resizeObserver.observe(mapElement);

    return () => resizeObserver.unobserve(mapElement);
  });

	afterUpdate(() => {
		updatePositions();
	});

	function updatePositions() {
		const badges = document.getElementsByClassName('playerBadge');
		const playerPositions: any[] = [];
		for (const badge of badges) {
			const id = badge.id.substring(7);
			const player = $players.find((p) => p.playerId === id);
			if (player) {
				const location = player.currentLocation || 'unknown';
				const badgeElement = badge as HTMLElement;
				const badgeCoordinates = coordinates.find(c => c.locationName === location) ?? { locationName: 'unknown', top: 100, left: 0};
				const top = Math.floor(badgeCoordinates.top * mapElement.getBoundingClientRect().height / 100.0);
				let left = Math.floor(badgeCoordinates.left * mapElement.getBoundingClientRect().width / 100.0);
				const existingPositionAssignment = playerPositions.find(e => e.locationName === badgeCoordinates.locationName);
				if(!existingPositionAssignment) {
					playerPositions.push({ locationName: badgeCoordinates.locationName, offset: badgeElement.getBoundingClientRect().width + 1 });
				}
				else {
					left += existingPositionAssignment.offset;
					existingPositionAssignment.offset += badgeElement.getBoundingClientRect().width + 1;
				}
				badgeElement.style.top = `${top}px`;
				badgeElement.style.left = `${left}px`;
			}
		}
	}

	function formatStageIndexLabel(player: PlayerQuestStage): string | number {
		if (player.stageIndex === undefined || player.stageIndex < 0) {
			return '';
		}
		if (player.stageCount) {
			return ` - ${player.stageIndex} / ${player.stageCount}`;
		}

		return ` - ${player.stageIndex}`;
	}

	const coordinates = [
		{ locationName: 'Gang OG1a', top: 37, left: 73 },
		{ locationName: 'HS OG1-EG', top: 47, left: 53 },
		{ locationName: 'HS UG', top: 88, left: 72 },
		{ locationName: 'KS UG', top: 88, left: 10 },
		{ locationName: 'KS OG1-EG', top: 55, left: 40 },
		{ locationName: 'Gang OG1b', top: 37, left: 10 },
		{ locationName: 'Gang EG', top: 70, left: 42 },
		{ locationName: 'HS EG', top: 62, left: 55 },
		{ locationName: 'HS OG1', top: 37, left: 55 },
		{ locationName: 'GangOG1axxx', top: 72, left: 7 },
		{ locationName: 'HS OG1 - EG', top: 47, left: 53 },
		{ locationName: 'KS EG OG1', top: 57, left: 38 },
		{ locationName: 'Drucker', top: 48, left: 67 },
		{ locationName: 'KS OG EG', top: 54, left: 38 },
		{ locationName: 'HS EG-OG1', top: 0, left: 1 },
		{ locationName: 'Glastür OG1a', top: 0, left: 20 },
		{ locationName: 'UG1', top: 0, left: 30 },
		{ locationName: 'GangOG1bxxx', top: 0, left: 40 },
		{ locationName: 'Gang OG1', top: 0, left: 50 },
		{ locationName: 'KS EG-OG1b', top: 0, left: 60 },
		{ locationName: 'HS EG -OG1', top: 0, left: 70 },
		{ locationName: 'HSOG1-XXX', top: 0, left: 80 },
		{ locationName: 'KSOB1-XXX', top: 0, left: 90 },
		{ locationName: 'HS OG1-OG2', top: 10, left: 0 },
		{ locationName: 'MEa', top: 10, left: 10 },
		{ locationName: 'HS OG2', top: 10, left: 20 },
		{ locationName: 'KS OG2', top: 10, left: 30 },
		{ locationName: 'KS OG2-OG1', top: 10, left: 40 },
		{ locationName: 'MEb', top: 10, left: 50 },
		{ locationName: 'KS KE', top: 10, left: 60 },
		{ locationName: 'UGb', top: 10, left: 70 },
		{ locationName: 'Gang UG', top: 10, left: 80 },
		{ locationName: 'B1', top: 10, left: 90 },
		{ locationName: 'B2', top: 20, left: 0 },
		{ locationName: 'HOME', top: 20, left: 10 },
		{ locationName: 'Lade HomeXXX', top: 20, left: 20 },
		{ locationName: 'B5', top: 20, left: 30 },
		{ locationName: 'B3', top: 20, left: 40 },
		{ locationName: 'HS-UG Lift xxx', top: 20, left: 50 },
		{ locationName: 'B4', top: 20, left: 60 },
		{ locationName: 'HS OG1 Lift', top: 20, left: 70 },
		{ locationName: 'HS-EG Lift', top: 20, left: 80 },
		{ locationName: 'B8', top: 20, left: 90 },
		{ locationName: 'KUa', top: 30, left: 0 },
		{ locationName: 'BU10', top: 30, left: 10 },
		{ locationName: 'B10', top: 30, left: 20 },
		{ locationName: 'B11', top: 30, left: 30 },
		{ locationName: 'B12', top: 30, left: 40 },
		{ locationName: 'B13', top: 30, left: 50 },
		{ locationName: 'B14', top: 30, left: 60 },
		{ locationName: 'KÜb1', top: 30, left: 70 },
		{ locationName: 'KÜa', top: 30, left: 80 },
		{ locationName: 'G-a', top: 30, left: 90 },
		{ locationName: 'HS-UG', top: 40, left: 0 },
		{ locationName: 'KE1', top: 40, left: 10 },
		{ locationName: 'G-b', top: 40, left: 20 },
		{ locationName: 'KÜb', top: 40, left: 30 }
	];
</script>

<Container fluid class="w-100" style="height:calc(100vh - 70px)">
	<div style="display:flex;position:relative;height:100%" on:load={() => updatePositions()} on:resize={() => updatePositions()}>
		<img src="./images/plan.png" alt="Gebäudeplan" id="map" height="1226" width="3110" bind:this={mapElement}/>
		{#each $players.filter(p => p.playerId && p.playerId.startsWith('P')) as player}
			<Badge pill color="{player.stageIndex === -1 ? 'primary' : 'info'}" class="playerBadge" id={`player_${player.playerId}`}
				>{player.playerId}<br><small>{player.questId + formatStageIndexLabel(player)} </small></Badge
			>
		{/each}
	</div>
</Container>

<style>
	#map {
		position: absolute;
		width: 100%;
		height: auto;
		z-index: 5;
	}

	:global(.playerBadge) {
		position: absolute;
		z-index: 10;
		font-size: 1rem;
		transition: top .5s, left .5s;
	}

	small {
		font-size: .75rem;
	}
</style>
