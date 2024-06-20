import { createVfm } from 'vue-final-modal';

export default defineNuxtPlugin((nuxtApp) => {
	// we want to ignore the hydration warning because it's not relevant for us by using primevue
	nuxtApp.vueApp.config.warnHandler = (
		msg: string,
		instance: ComponentPublicInstance | null,
		trace: string
	) => {
		if (msg.includes('Hydration')) return;
		// eslint-disable-next-line no-console
		console.warn(msg);
	};

	const vfm = createVfm() as any;

	nuxtApp.vueApp.use(vfm);
});
