<script lang="ts" setup>
	import { ModalsContainer } from 'vue-final-modal';
	useHead({
		title: 'KBot2',
		htmlAttrs: {
			class: 'nuxt-ui-scrollbars'
		},
		bodyAttrs: {
			class: 'bg-surface-50 dark:bg-surface-950 dark:text-white dark:text-opacity-75 text-black '
		}
	});
</script>

<template>
	<div class="full-wh overflow-auto">
		<NuxtLoadingIndicator />

		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>

		<Toast position="bottom-right" />
		<ModalsContainer />
		<ConfirmDialog />
	</div>
</template>
