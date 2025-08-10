/**
 * Event Bus Tests
 * 
 * Comprehensive tests for the event bus system
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus, eventBus } from './eventBus';

describe('EventBus', () => {
	let testBus: EventBus;

	beforeEach(() => {
		testBus = new EventBus();
	});

	describe('Basic Event Handling', () => {
		it('should emit and listen to events', () => {
			const handler = vi.fn();
			
			testBus.on('timer:start', handler);
			testBus.emit('timer:start', { projectId: '123', timestamp: new Date() });
			
			expect(handler).toHaveBeenCalledTimes(1);
			expect(handler).toHaveBeenCalledWith({
				projectId: '123',
				timestamp: expect.any(Date)
			});
		});

		it('should handle multiple listeners for the same event', () => {
			const handler1 = vi.fn();
			const handler2 = vi.fn();
			
			testBus.on('timer:stop', handler1);
			testBus.on('timer:stop', handler2);
			testBus.emit('timer:stop', { duration: 100, timestamp: new Date() });
			
			expect(handler1).toHaveBeenCalledTimes(1);
			expect(handler2).toHaveBeenCalledTimes(1);
		});

		it('should not call handlers after they are removed', () => {
			const handler = vi.fn();
			
			testBus.on('project:created', handler);
			testBus.off('project:created', handler);
			testBus.emit('project:created', { projectId: '123', name: 'Test' });
			
			expect(handler).not.toHaveBeenCalled();
		});
	});

	describe('Once Listeners', () => {
		it('should call once listeners only once', () => {
			const handler = vi.fn();
			
			testBus.once('task:completed', handler);
			testBus.emit('task:completed', { taskId: '123', timestamp: new Date() });
			testBus.emit('task:completed', { taskId: '456', timestamp: new Date() });
			
			expect(handler).toHaveBeenCalledTimes(1);
		});

		it('should return unsubscribe function for once listeners', () => {
			const handler = vi.fn();
			
			const unsubscribe = testBus.once('ui:notification', handler);
			unsubscribe();
			testBus.emit('ui:notification', { type: 'info', message: 'Test' });
			
			expect(handler).not.toHaveBeenCalled();
		});
	});

	describe('Unsubscribe Functions', () => {
		it('should return unsubscribe function from on()', () => {
			const handler = vi.fn();
			
			const unsubscribe = testBus.on('settings:updated', handler);
			unsubscribe();
			testBus.emit('settings:updated', { key: 'theme', value: 'dark' });
			
			expect(handler).not.toHaveBeenCalled();
		});

		it('should handle multiple unsubscribes safely', () => {
			const handler = vi.fn();
			
			const unsubscribe = testBus.on('data:sync:start', handler);
			unsubscribe();
			unsubscribe(); // Should not throw
			
			testBus.emit('data:sync:start', { timestamp: new Date() });
			expect(handler).not.toHaveBeenCalled();
		});
	});

	describe('Error Handling', () => {
		it('should handle errors in event listeners gracefully', () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			const goodHandler = vi.fn();
			const badHandler = vi.fn(() => {
				throw new Error('Test error');
			});
			
			testBus.on('ui:modal:open', badHandler);
			testBus.on('ui:modal:open', goodHandler);
			
			testBus.emit('ui:modal:open', { modalId: 'test' });
			
			expect(consoleErrorSpy).toHaveBeenCalled();
			expect(goodHandler).toHaveBeenCalled();
			
			consoleErrorSpy.mockRestore();
		});
	});

	describe('Utility Methods', () => {
		it('should count listeners correctly', () => {
			const handler1 = vi.fn();
			const handler2 = vi.fn();
			
			expect(testBus.listenerCount('timer:pause')).toBe(0);
			
			testBus.on('timer:pause', handler1);
			expect(testBus.listenerCount('timer:pause')).toBe(1);
			
			testBus.on('timer:pause', handler2);
			expect(testBus.listenerCount('timer:pause')).toBe(2);
			
			testBus.once('timer:pause', handler1);
			expect(testBus.listenerCount('timer:pause')).toBe(3);
		});

		it('should return event names', () => {
			const handler = vi.fn();
			
			testBus.on('timer:start', handler);
			testBus.on('project:created', handler);
			
			const eventNames = testBus.eventNames();
			expect(eventNames).toContain('timer:start');
			expect(eventNames).toContain('project:created');
		});

		it('should remove all listeners for an event', () => {
			const handler1 = vi.fn();
			const handler2 = vi.fn();
			
			testBus.on('timer:reset', handler1);
			testBus.on('timer:reset', handler2);
			testBus.on('timer:start', handler1);
			
			testBus.removeAllListeners('timer:reset');
			
			testBus.emit('timer:reset', { timestamp: new Date() });
			testBus.emit('timer:start', { timestamp: new Date() });
			
			expect(handler1).toHaveBeenCalledTimes(1); // Only from timer:start
			expect(handler2).not.toHaveBeenCalled();
		});

		it('should remove all listeners when no event specified', () => {
			const handler = vi.fn();
			
			testBus.on('timer:start', handler);
			testBus.on('project:created', handler);
			
			testBus.removeAllListeners();
			
			testBus.emit('timer:start', { timestamp: new Date() });
			testBus.emit('project:created', { projectId: '123', name: 'Test' });
			
			expect(handler).not.toHaveBeenCalled();
		});
	});

	describe('Memory Leak Prevention', () => {
		it('should warn about too many listeners', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			testBus.setMaxListeners(2);

			const handler1 = vi.fn();
			const handler2 = vi.fn();
			const handler3 = vi.fn();

			testBus.on('timer:start', handler1);
			testBus.on('timer:start', handler2);
			testBus.on('timer:start', handler3); // Should trigger warning

			expect(consoleWarnSpy).toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it('should get and set max listeners', () => {
			expect(testBus.getMaxListeners()).toBe(100);
			
			testBus.setMaxListeners(50);
			expect(testBus.getMaxListeners()).toBe(50);
		});
	});
});

describe('Global Event Bus', () => {
	beforeEach(() => {
		eventBus.removeAllListeners();
	});

	it('should be a singleton instance', () => {
		const handler = vi.fn();
		
		eventBus.on('timer:start', handler);
		eventBus.emit('timer:start', { timestamp: new Date() });
		
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('should maintain state across imports', () => {
		const handler = vi.fn();
		
		eventBus.on('project:updated', handler);
		
		// Simulate another module using the same event bus
		eventBus.emit('project:updated', { projectId: '123', changes: {} });
		
		expect(handler).toHaveBeenCalledTimes(1);
	});
});

describe('Type Safety', () => {
	it('should enforce event data types', () => {
		let testBus: EventBus;
		testBus = new EventBus();

		const handler = vi.fn();

		// This should compile without errors
		testBus.on('timer:start', (data) => {
			expect(data.timestamp).toBeInstanceOf(Date);
			expect(typeof data.projectId).toBe('string');
		});

		testBus.emit('timer:start', {
			projectId: '123',
			taskId: '456',
			timestamp: new Date()
		});
	});
});
