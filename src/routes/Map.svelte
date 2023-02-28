<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// resize the canvas to fill browser window dynamically
		window.addEventListener('resize', resizeCanvas, false);

		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		resizeCanvas();

		const canvas = document.getElementById('map') as HTMLCanvasElement;

		if (canvas) {
			const context = canvas.getContext('2d');
			const mapImage = new Image();
			mapImage.src = './images/plan.png';
			mapImage.onload = function () {
				console.log('drawing image');
				context?.drawImage(mapImage, 0, 0);
			};
		}
	});
</script>

<canvas id="map" width="1900" height="1000" />
