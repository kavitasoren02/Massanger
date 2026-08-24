self.addEventListener("install", (event) => {
  console.log("Server worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Server worker activated");
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  console.log("Message recived", data);

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "src/assets/Messangerico.ico",
      data: {
        chatUserId: data.chatUserId,
      },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const chatUserId = event.notification.data?.chatUserId;
  if (!chatUserId) return;

  const chatUrl = `/chat/${chatUserId}`;

  event.waitUntil(
    self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clients) => {
      for(const client of clients){
        if("focus" in client){
          client.navigate(chatUrl);
          return client.focus();
        }
      }

      return self.clients.openWindow(chatUrl);
    })
  )
});
