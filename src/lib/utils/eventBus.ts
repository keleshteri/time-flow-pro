/**
 * TimeFlow Pro Event Bus
 * 
 * A type-safe event bus system for cross-component communication.
 * Provides a centralized way to emit and listen to events throughout the application.
 * 
 * @example
 * ```typescript
 * import { eventBus } from '$lib/utils/eventBus';
 * 
 * // Listen to events
 * eventBus.on('timer:start', (data) => {
 *   console.log('Timer started:', data);
 * });
 * 
 * // Emit events
 * eventBus.emit('timer:start', { projectId: '123', taskId: '456' });
 * 
 * // Remove listeners
 * const unsubscribe = eventBus.on('timer:stop', handler);
 * unsubscribe(); // Remove listener
 * ```
 */

// Event type definitions for type safety
export interface EventMap {
	// Timer events
	'timer:start': { projectId?: string; taskId?: string; timestamp: Date };
	'timer:stop': { duration: number; timestamp: Date };
	'timer:pause': { timestamp: Date };
	'timer:resume': { timestamp: Date };
	'timer:reset': { timestamp: Date };
	
	// Project events
	'project:created': { projectId: string; name: string };
	'project:updated': { projectId: string; changes: Record<string, unknown> };
	'project:deleted': { projectId: string };
	'project:selected': { projectId: string };
	
	// Task events
	'task:created': { taskId: string; projectId: string; name: string };
	'task:updated': { taskId: string; changes: Record<string, unknown> };
	'task:deleted': { taskId: string };
	'task:completed': { taskId: string; timestamp: Date };
	
	// Time entry events
	'timeEntry:created': { entryId: string; projectId: string; taskId?: string };
	'timeEntry:updated': { entryId: string; changes: Record<string, unknown> };
	'timeEntry:deleted': { entryId: string };
	
	// UI events
	'ui:notification': { type: 'success' | 'error' | 'warning' | 'info'; message: string; duration?: number };
	'ui:modal:open': { modalId: string; data?: unknown };
	'ui:modal:close': { modalId: string };
	'ui:theme:changed': { theme: 'light' | 'dark' | 'system' };
	
	// Settings events
	'settings:updated': { key: string; value: unknown };
	'settings:reset': { timestamp: Date };
	
	// Data events
	'data:sync:start': { timestamp: Date };
	'data:sync:complete': { timestamp: Date; success: boolean };
	'data:export:start': { format: string; timestamp: Date };
	'data:export:complete': { format: string; success: boolean; timestamp: Date };
}

// Event listener function type
type EventListener<T = unknown> = (data: T) => void;

// Event bus class
class EventBus {
	private listeners: Map<string, Set<EventListener>> = new Map();
	private onceListeners: Map<string, Set<EventListener>> = new Map();
	private maxListeners = 100; // Prevent memory leaks
	
	/**
	 * Add an event listener
	 * @param event - Event name
	 * @param listener - Event handler function
	 * @returns Unsubscribe function
	 */
	on<K extends keyof EventMap>(
		event: K,
		listener: EventListener<EventMap[K]>
	): () => void {
		return this.addEventListener(event, listener, false);
	}
	
	/**
	 * Add a one-time event listener
	 * @param event - Event name
	 * @param listener - Event handler function
	 * @returns Unsubscribe function
	 */
	once<K extends keyof EventMap>(
		event: K,
		listener: EventListener<EventMap[K]>
	): () => void {
		return this.addEventListener(event, listener, true);
	}
	
	/**
	 * Remove an event listener
	 * @param event - Event name
	 * @param listener - Event handler function to remove
	 */
	off<K extends keyof EventMap>(
		event: K,
		listener: EventListener<EventMap[K]>
	): void {
		const eventListeners = this.listeners.get(event);
		if (eventListeners) {
			eventListeners.delete(listener);
			if (eventListeners.size === 0) {
				this.listeners.delete(event);
			}
		}
		
		const onceListeners = this.onceListeners.get(event);
		if (onceListeners) {
			onceListeners.delete(listener);
			if (onceListeners.size === 0) {
				this.onceListeners.delete(event);
			}
		}
	}
	
	/**
	 * Emit an event to all listeners
	 * @param event - Event name
	 * @param data - Event data
	 */
	emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
		// Call regular listeners
		const eventListeners = this.listeners.get(event);
		if (eventListeners) {
			eventListeners.forEach(listener => {
				try {
					listener(data);
				} catch (error) {
					console.error(`Error in event listener for "${event}":`, error);
				}
			});
		}
		
		// Call once listeners and remove them
		const onceListeners = this.onceListeners.get(event);
		if (onceListeners) {
			onceListeners.forEach(listener => {
				try {
					listener(data);
				} catch (error) {
					console.error(`Error in once event listener for "${event}":`, error);
				}
			});
			this.onceListeners.delete(event);
		}
	}
	
	/**
	 * Remove all listeners for an event
	 * @param event - Event name (optional, removes all if not provided)
	 */
	removeAllListeners<K extends keyof EventMap>(event?: K): void {
		if (event) {
			this.listeners.delete(event);
			this.onceListeners.delete(event);
		} else {
			this.listeners.clear();
			this.onceListeners.clear();
		}
	}
	
	/**
	 * Get the number of listeners for an event
	 * @param event - Event name
	 * @returns Number of listeners
	 */
	listenerCount<K extends keyof EventMap>(event: K): number {
		const regular = this.listeners.get(event)?.size || 0;
		const once = this.onceListeners.get(event)?.size || 0;
		return regular + once;
	}
	
	/**
	 * Get all event names that have listeners
	 * @returns Array of event names
	 */
	eventNames(): string[] {
		const names = new Set([
			...this.listeners.keys(),
			...this.onceListeners.keys()
		]);
		return Array.from(names);
	}
	
	/**
	 * Set maximum number of listeners per event
	 * @param max - Maximum number of listeners
	 */
	setMaxListeners(max: number): void {
		this.maxListeners = max;
	}
	
	/**
	 * Get maximum number of listeners per event
	 * @returns Maximum number of listeners
	 */
	getMaxListeners(): number {
		return this.maxListeners;
	}
	
	// Private helper method
	private addEventListener<K extends keyof EventMap>(
		event: K,
		listener: EventListener<EventMap[K]>,
		once: boolean
	): () => void {
		const listenersMap = once ? this.onceListeners : this.listeners;
		
		if (!listenersMap.has(event)) {
			listenersMap.set(event, new Set());
		}
		
		const eventListeners = listenersMap.get(event)!;
		
		// Check for memory leaks
		if (eventListeners.size >= this.maxListeners) {
			console.warn(
				`Possible memory leak detected: ${eventListeners.size} listeners for event "${event}". ` +
				`Use eventBus.setMaxListeners() to increase the limit.`
			);
		}
		
		eventListeners.add(listener);
		
		// Return unsubscribe function
		return () => {
			eventListeners.delete(listener);
			if (eventListeners.size === 0) {
				listenersMap.delete(event);
			}
		};
	}
}

// Create and export singleton instance
export const eventBus = new EventBus();

// Export types for external use
export type { EventMap, EventListener };

// Export class for testing or custom instances
export { EventBus };
