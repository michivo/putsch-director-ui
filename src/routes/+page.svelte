<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Col, Container, Nav, Navbar, NavbarBrand, NavItem, NavLink, Row } from 'sveltestrap';
	import { cleanupPlayerStore, initPlayerStore } from '../stores/players';
	import Players from './Players.svelte';
	import Map from './Map.svelte';

	let activeTab = 'players';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		activeTab = urlParams.get('activeTab') ?? 'players';
		initPlayerStore();
	});

	onDestroy(() => {
		cleanupPlayerStore();
	});
</script>

<Navbar light color="light" class="py-1">
	<Container fluid>
		<Row>
			<Col>
				<NavbarBrand style="font-family: 'Orbitron';font-weight: 900;font-size: 30pt"
					>putsch</NavbarBrand
				>
			</Col>
			<Col>
				<Nav pills class="mt-2">
					<NavItem>
						<NavLink
							on:click={() => (activeTab = 'players')}
							active={activeTab === 'players'}
							href="/?activeTab=players">Spieler*innen</NavLink
						>
					</NavItem>
					<NavItem>
						<NavLink
							on:click={() => (activeTab = 'map')}
							active={activeTab === 'map'}
							href="/?activeTab=map">Plan</NavLink
						>
					</NavItem>
				</Nav>
			</Col>
		</Row>
	</Container>
</Navbar>
{#if activeTab === 'players'}
	<Players />
{:else if activeTab === 'map'}
	<Map />
{/if}

<style>
	@font-face {
		font-family: 'Orbitron';
		font-weight: 900;
		src: url('/fonts/orbitron.ttf');
		unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
			U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
	}
</style>
