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
            icon: "src/assets/Messangerico.ico"
        })
    )
});


