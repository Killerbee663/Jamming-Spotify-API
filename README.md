# 🎧 Jammming – Spotify Playlist Creator

Jammming is a React web app that allows users to search for songs using Spotify’s Web API and create custom playlists which can be saved directly to their Spotify account.

## 🚀 Live Demo

(https://jammingyo.netlify.app)

## 🛠 Features

- 🔐 OAuth 2.0 Authentication with Spotify
- 🔍 Real-time search for songs using Spotify API
- 🎵 Add/remove tracks to your custom playlist
- 💾 Save playlists directly to your Spotify account
- 💻 Responsive and modern UI built with React and Tailwind CSS

---

## 📦 Tech Stack

- **React** – Frontend framework
- **Tailwind CSS** – Styling
- **Spotify Web API** – Song search, user info, and playlist integration
- **OAuth 2.0 Implicit Grant Flow** – Authentication
- **LocalStorage** – Access token management

---

## 🧠 How It Works

1. **User logs in** via Spotify using OAuth2 authentication.
2. After authentication, the access token is stored in `localStorage`.
3. The user searches for songs by keyword (artist, song, album).
4. Tracks can be added/removed from a dynamic playlist list.
5. Once satisfied, the playlist can be named and saved to the user’s Spotify account.
