const notifications = [
    "🪙 Earn Coins on the Webhook in Google Chat",
    "🏫 No School on Aug 12",
    "📢 Check Release Notes for Updates",
    "🍂 Autumn Event Is Now Out for fishing!",
    "🎃 Halloween Event starting on October 29th!",
    "🥢 Welcome to Chopsticks Hub!"
];

let notificationIndex = 0;

const notificationText =
document.getElementById(
    "notification-text"
);

function updateNotification(){

    if(!notificationText)
        return;

    notificationText.style.opacity =
    "0";

    setTimeout(() => {

        notificationText.textContent =
        notifications[
            notificationIndex
        ];

        notificationText.style.opacity =
        "0.9";

        notificationIndex++;

        if(
            notificationIndex >=
            notifications.length
        ){

            notificationIndex = 0;

        }

    }, 500);

}

updateNotification();

setInterval(
    updateNotification,
    4000
);
