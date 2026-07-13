# Splitz Backend

> The backend service powering **Splitz**, a lightweight, real-time bill-splitting app built for me and my friends.

## Why Splitz?

My friends in Bangalore still split bills the old-fashioned way:

- Sending long WhatsApp messages.
- Scrolling through endless chat threads.
- Manually calculating who owes what.

You might wonder, **"Why not just use Splitwise, Settle Up, Tricount, or any of the dozens of bill-splitting apps already out there?"**

They're all great apps, but they don't quite fit how my friends and I split bills.

For us:

- Not everyone wants to install yet another app or create an account.
- Sometimes we only need to split a single restaurant bill.
- And, being Indians, we'd often rather wrestle with a calculator, a WhatsApp group, and GPay than download another app. 😄

So I'm building **Splitz**—a lightweight, real-time bill-splitting app that's designed to solve exactly this problem without the friction of traditional bill-splitting apps.

With Splitz, anyone can:

- Create a room.
- Invite friends to join.
- Add items as they're ordered (or later).
- Claim the items they consumed.
- Enter the final bill amount.

Once everyone's done, Splitz takes care of the calculations so nobody has to.

---

# Splitz Backend

This repository contains the backend powering **Splitz**.

The goal is to keep the architecture simple while providing a fast and seamless real-time experience.

## Features

- Room creation and management
- Real-time communication using WebSockets
- Pub/Sub architecture for broadcasting updates
- Instant synchronization across all connected clients in a room
- Persistent storage of room and bill data

As users add items, claim them, or update the bill, every connected client in the room sees the changes instantly.

---

## Project Status

🚧 **This project is currently under active development.**

I'm building this primarily for personal use with my friends, so expect the architecture and features to evolve as the project grows.

---

## Running the Backend

```bash
# Clone the repository
git clone <your-repository-url>

# Move into the project
cd splitz-backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
```

---

## Contributing

This is currently a personal side project, but suggestions, ideas, and feedback are always welcome.

If you find a bug or have an idea that could improve Splitz, feel free to open an issue or submit a pull request.

---

## Want to use it?

If I end up completing and maintaining the project, feel free to clone this repository, host it yourself, and use it with your own friends.

Until then, consider this a fun side project that's solving a very real problem in our WhatsApp groups. 😊