<script lang="ts">
	import { Alert, Button, Container, Form, FormGroup, Input, Label } from 'sveltestrap';
	import { triggerEvent } from '../services/eventhub';
	import type { Color } from 'sveltestrap/src/shared';

	let playerId = '';
	let sensorId = '';
	let processing = false;
	let lastPlayerId = '';
	let lastSensorId = '';
	let alertColor: Color = 'info';
	let showAlert = false;

	async function onTriggerEvent(): Promise<void> {
		processing = true;
		try {
			lastPlayerId = playerId;
			lastSensorId = sensorId;
			alertColor = 'info';
			await triggerEvent(playerId, sensorId);
		}
		catch {
			alertColor = 'danger';
		} finally {
			processing = false;
			showAlert = true;
			setTimeout(() => showAlert = false, 2000);
		}
	}
</script>

<Container>
	<Form>
		<FormGroup>
			<Label for="playerId">Spieler-ID</Label>
			<Input
				style="border: 1px solid #ccc"
				id="playerId"
				plaintext
				bind:value={playerId}
				placeholder="P1, P2, P3, ..."
			/>
		</FormGroup>
		<FormGroup>
			<Label for="sensorId">Raum</Label>
			<Input
				style="border: 1px solid #ccc"
				id="playerId"
				plaintext
				bind:value={sensorId}
				placeholder="Büro 711, ..."
			/>
		</FormGroup>
		<Button
			color="primary"
			on:click={onTriggerEvent}
			disabled={processing || !sensorId || !playerId}>Event triggern</Button
		>
	</Form>
	<Alert bind:color={alertColor} isOpen={showAlert}>Event für Spieler*in {lastPlayerId}/Raum {lastSensorId} wurde abgeschickt. {alertColor === 'danger' ? 'Fehler!' : ''}</Alert>
</Container>
