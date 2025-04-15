const SpotifyAPI = {
  clientId: "44e2ccf9b3044723acbbd36fc87e06c7",
  redirectUri: window.location.href.includes("localhost")
    ? "http://localhost:5173/callback"
    : "https://deployed-site.com/callback",
  accessToken: null,
  expiresIn: null,

  isAuthenticated() {
    const savedToken = localStorage.getItem("spotify_access_token");
    const expiresAt = localStorage.getItem("spotify_expires_at");

    return savedToken && expiresAt && Date.now() < Number(expiresAt);
  },

  getAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    }

    const savedToken = localStorage.getItem("spotify_access_token");
    const expiresAt = localStorage.getItem("spotify_expires_at");

    if (savedToken && expiresAt && Date.now() < Number(expiresAt)) {
      this.accessToken = savedToken;
      return savedToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      this.accessToken = accessTokenMatch[1];
      this.expiresIn = Number(expiresInMatch[1]);

      const expiresAt = Date.now() + this.expiresIn * 1000;

      localStorage.setItem("spotify_access_token", this.accessToken);
      localStorage.setItem("spotify_expires_at", expiresAt);

      window.history.pushState("Access Token", null, "/");

      return this.accessToken;
    }

    return null;
  },

  redirectToSpotifyAuth() {
    const scope =
      "user-read-private user-read-email playlist-modify-public playlist-modify-private";
    window.location = `https://accounts.spotify.com/authorize?client_id=${
      this.clientId
    }&response_type=token&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(this.redirectUri)}`;
  },

  logout() {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_expires_at");
    localStorage.removeItem("spotify_user_profile");
    this.accessToken = null;
    this.expiresIn = null;
  },

  async getUserProfile() {
    const cachedProfile = localStorage.getItem("spotify_user_profile");
    if (cachedProfile) {
      return JSON.parse(cachedProfile);
    }

    const accessToken = this.getAccessToken();
    if (!accessToken) return null;

    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {

          this.logout();
          return null;
        }
        throw new Error("Failed to get user profile");
      }

      const userProfile = await response.json();

      localStorage.setItem("spotify_user_profile", JSON.stringify(userProfile));

      return userProfile;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  },

  async search(term) {
    const accessToken = this.getAccessToken();
    if (!accessToken) return [];

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(
          term
        )}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          return [];
        }
        throw new Error("Search request failed");
      }

      const jsonResponse = await response.json();

      if (!jsonResponse.tracks) {
        return [];
      }

      return jsonResponse.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        albumArt: track.album.images[0]?.url,
        duration: track.duration_ms,
        uri: track.uri,
      }));
    } catch (error) {
      console.error("Error searching tracks:", error);
      return [];
    }
  },

  async getUserId() {
    const userProfile = await this.getUserProfile();
    return userProfile ? userProfile.id : null;
  },

  async createPlaylist(userId, name) {
    const accessToken = this.getAccessToken();
    if (!accessToken) return null;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            description: "Created with Jammming",
            public: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create playlist");
      }

      const jsonResponse = await response.json();
      return jsonResponse.id;
    } catch (error) {
      console.error("Error creating playlist:", error);
      return null;
    }
  },

  async addTracksToPlaylist(playlistId, trackURIs) {
    const accessToken = this.getAccessToken();
    if (!accessToken) return false;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: trackURIs,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add tracks to playlist");
      }

      return true;
    } catch (error) {
      console.error("Error adding tracks to playlist:", error);
      return false;
    }
  },

  async savePlaylist(name, trackURIs) {
    if (!name || !trackURIs.length) {
      return false;
    }

    try {
      const userId = await this.getUserId();
      if (!userId) return false;

      const playlistId = await this.createPlaylist(userId, name);
      if (!playlistId) return false;

      const result = await this.addTracksToPlaylist(playlistId, trackURIs);
      return result;
    } catch (error) {
      console.error("Error saving playlist:", error);
      return false;
    }
  },
};

export default SpotifyAPI;
