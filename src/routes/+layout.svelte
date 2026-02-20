<!-- template for the layout of the app, including navigation and footer -->
<script lang="ts">
  let { children } = $props();
//   import ChangeLanguageButton from '$lib/components/ChangeLanguageButton.svelte';
</script>

<div>
	<!-- logo and changelanguagebutton here -->	
	<img src="src\lib\assets\logo.png" alt="Quiz Game Logo" class="logo" style="width: 50px;"/>
	
	<!-- <ChangeLanguageButton /> -->
	<button>Change Language</button> <!--change this to a real button later -->
</div>

<hr />

{@render children()} 
