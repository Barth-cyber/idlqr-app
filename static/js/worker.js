/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals, no-restricted-syntax */

self.addEventListener('push', (event) => {
	if (!event.data) {
		return;
	}

	const { title, ...data } = event.data.json();
	const notification = self.registration.showNotification(title || 'QRFY', {
		icon: '/android-chrome-512x512.png',
		badge: '/android-chrome-192x192.png',
		...data
	});

	event.waitUntil(notification);
});

self.addEventListener('notificationclick', (event) => {
	event.notification.close();

	event.waitUntil(
		clients
			.matchAll({
				type: 'window'
			})
			.then((clientList) => {
				const path =
					event.notification.tag === 'trial-ended'
						? '/app/plans-and-payments'
						: '/';

				// focus the app tab if it is open
				for (const client of clientList) {
					if (client.url === path && 'focus' in client) {
						return client.focus();
					}
				}

				return clients.openWindow(path);
			})
	);
});
