<script lang="ts">
	import { onMount } from 'svelte'
	import type { Snippet } from 'svelte'

	interface Props {
		src?: string
		speed?: number
		class?: string
		children?: Snippet
	}

	let { src = '/homegrassbg.png', speed = 0.5, class: className = '', children }: Props = $props()

	let bgPos = $state(0)
	let animFrame: number

	onMount(() => {
		const img = new Image()
		img.src = src
		img.onload = () => {
			const renderedWidth = (img.width / img.height) * window.innerHeight

			function animate() {
				bgPos = (bgPos + speed) % renderedWidth
				animFrame = requestAnimationFrame(animate)
			}
			animate()
		}

		return () => cancelAnimationFrame(animFrame)
	})
</script>

<div
	class="scrolling-bg {className}"
	style="background-image: url('{src}'); background-position-x: {bgPos}px;"
>
	{@render children?.()}
</div>

<style>
	.scrolling-bg {
		background-repeat: repeat-x;
		background-size: auto 100%;
		background-position-y: 0;
	}
</style>
