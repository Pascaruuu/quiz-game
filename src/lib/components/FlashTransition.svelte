<script lang="ts">
	import LoadingScreen from './LoadingScreen.svelte'

	interface Props {
		visible: boolean
	}

	let { visible }: Props = $props()
</script>

{#if visible}
	<div class="transition-overlay">
		<div class="flash"></div>
		<div class="iris">
			<LoadingScreen />
		</div>
	</div>
{/if}

<style>
	.transition-overlay {
		position: absolute;
		inset: 0;
		z-index: 50;
		pointer-events: none;
	}

	.flash {
		position: absolute;
		inset: 0;
		background: white;
		opacity: 0;
		animation: flash 0.9s ease-in-out forwards;
	}

	@keyframes flash {
		0% {
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		20% {
			opacity: 0;
		}
		36% {
			opacity: 1;
		}
		52% {
			opacity: 0;
		}
		68% {
			opacity: 1;
		}
		84% {
			opacity: 0;
		}
		100% {
			opacity: 0;
		}
	}

	.iris {
		position: absolute;
		inset: 0;
		clip-path: circle(0% at 50% 50%);
		animation: iris-out 0.8s ease-in 0.9s both;
		overflow: hidden;
	}

	@keyframes iris-out {
		0% {
			clip-path: circle(0% at 50% 50%);
		}
		100% {
			clip-path: circle(150% at 50% 50%);
		}
	}
</style>
