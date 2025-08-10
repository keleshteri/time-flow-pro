<!--
	TimeFlow Pro Modal Component
	
	A comprehensive modal component with focus management, keyboard navigation,
	and accessibility features. Supports different sizes and customizable behavior.
	
	@component
	@example
	```svelte
	<Modal bind:open={showModal} title="Confirm Action" size="md">
		<p>Are you sure you want to delete this item?</p>
		<svelte:fragment slot="footer">
			<Button variant="secondary" onclick={() => showModal = false}>Cancel</Button>
			<Button variant="danger" onclick={handleDelete}>Delete</Button>
		</svelte:fragment>
	</Modal>
	```
-->

<script lang="ts">
	import type { ModalProps } from '$lib/types/components.js';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	
	const dispatch = createEventDispatcher<{
		open: void;
		close: void;
		backdrop: void;
		escape: void;
	}>();
	
	// Props with defaults
	export let open: ModalProps['open'] = false;
	export let size: ModalProps['size'] = 'md';
	export let title: ModalProps['title'] = '';
	export let showClose: ModalProps['showClose'] = true;
	export let closeOnBackdrop: ModalProps['closeOnBackdrop'] = true;
	export let closeOnEscape: ModalProps['closeOnEscape'] = true;
	export let preventScroll: ModalProps['preventScroll'] = true;
	
	// Base component props
	let className: ModalProps['class'] = '';
	export { className as class };
	export let style: ModalProps['style'] = '';
	
	// Internal state
	let modalElement: HTMLDivElement;
	let previousActiveElement: Element | null = null;
	let mounted = false;
	
	// Generate unique ID for accessibility
	const modalId = `modal-${Math.random().toString(36).substr(2, 9)}`;
	const titleId = `${modalId}-title`;
	
	// Computed classes
	$: sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
		full: 'max-w-full mx-4'
	}[size];
	
	// Handle modal open/close
	$: if (browser && mounted) {
		if (open) {
			handleOpen();
		} else {
			handleClose();
		}
	}
	
	function handleOpen() {
		// Store the currently focused element
		previousActiveElement = document.activeElement;
		
		// Prevent body scroll if requested
		if (preventScroll) {
			document.body.style.overflow = 'hidden';
		}
		
		// Focus the modal after a brief delay to ensure it's rendered
		setTimeout(() => {
			if (modalElement) {
				modalElement.focus();
			}
		}, 10);
		
		dispatch('open');
	}
	
	function handleClose() {
		// Restore body scroll
		if (preventScroll) {
			document.body.style.overflow = '';
		}
		
		// Restore focus to the previously focused element
		if (previousActiveElement && previousActiveElement instanceof HTMLElement) {
			previousActiveElement.focus();
		}
		
		dispatch('close');
	}
	
	function closeModal() {
		open = false;
	}
	
	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdrop && event.target === event.currentTarget) {
			dispatch('backdrop');
			closeModal();
		}
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (!open) return;
		
		if (event.key === 'Escape' && closeOnEscape) {
			event.preventDefault();
			dispatch('escape');
			closeModal();
		}
		
		// Trap focus within modal
		if (event.key === 'Tab') {
			trapFocus(event);
		}
	}
	
	function trapFocus(event: KeyboardEvent) {
		if (!modalElement) return;
		
		const focusableElements = modalElement.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		
		const firstFocusable = focusableElements[0] as HTMLElement;
		const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
		
		if (event.shiftKey) {
			// Shift + Tab
			if (document.activeElement === firstFocusable) {
				event.preventDefault();
				lastFocusable?.focus();
			}
		} else {
			// Tab
			if (document.activeElement === lastFocusable) {
				event.preventDefault();
				firstFocusable?.focus();
			}
		}
	}
	
	onMount(() => {
		mounted = true;
	});
	
	onDestroy(() => {
		// Clean up on component destroy
		if (browser && preventScroll) {
			document.body.style.overflow = '';
		}
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- Modal backdrop -->
	<div
		class="fixed inset-0 z-50 overflow-y-auto"
		aria-labelledby={title ? titleId : undefined}
		aria-modal="true"
		role="dialog"
	>
		<!-- Backdrop overlay -->
		<div
			class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
			on:click={handleBackdropClick}
			on:keydown={(e) => e.key === 'Enter' && handleBackdropClick(e)}
		>
			<!-- Backdrop -->
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				aria-hidden="true"
			></div>
			
			<!-- Modal panel -->
			<div
				bind:this={modalElement}
				class="
					relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all
					sm:my-8 w-full {sizeClasses} {className}
				"
				{style}
				tabindex="-1"
			>
				<!-- Modal header -->
				{#if title || showClose || $$slots.header}
					<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								{#if $$slots.header}
									<slot name="header" />
								{:else if title}
									<h3 class="text-base font-semibold leading-6 text-gray-900" id={titleId}>
										{title}
									</h3>
								{/if}
							</div>
							
							{#if showClose}
								<button
									type="button"
									class="
										ml-3 inline-flex h-8 w-8 items-center justify-center rounded-md
										text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2
										focus:ring-primary-500 focus:ring-offset-2
									"
									aria-label="Close modal"
									on:click={closeModal}
								>
									<svg
										class="h-5 w-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										></path>
									</svg>
								</button>
							{/if}
						</div>
					</div>
				{/if}
				
				<!-- Modal body -->
				<div class="bg-white px-4 pb-4 pt-5 sm:p-6 {title || showClose || $$slots.header ? 'pt-0' : ''}">
					<slot />
				</div>
				
				<!-- Modal footer -->
				{#if $$slots.footer}
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<slot name="footer" />
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Dark mode styles - using CSS custom properties instead of @apply */
	:global(.dark) .bg-white {
		background-color: #1f2937;
		color: white;
	}

	:global(.dark) .bg-gray-50 {
		background-color: #374151;
	}

	:global(.dark) .text-gray-900 {
		color: white;
	}

	:global(.dark) .text-gray-400 {
		color: #d1d5db;
	}

	:global(.dark) .hover\:text-gray-500:hover {
		color: #e5e7eb;
	}
	
	/* High contrast mode support */
	@media (prefers-contrast: high) {
		.bg-gray-500 {
			background-color: black;
		}

		.bg-opacity-75 {
			background-color: rgba(0, 0, 0, 0.9);
		}
	}
	
	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.transition-opacity,
		.transition-all {
			transition: none;
		}
	}
</style>
