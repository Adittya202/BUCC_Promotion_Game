/**
 * BUCC Dino Runner & Boss Shooter - API Service
 * Handles server communication for scores, sessions, and configs with localStorage fallback.
 */

const ApiService = {
  isPhpAvailable: false,

  async init() {
    try {
      const res = await fetch("api/session.php", { method: "GET" });
      if (res.ok) {
        this.isPhpAvailable = true;
        console.log("[ApiService] Connected to PHP backend.");
      }
    } catch (e) {
      this.isPhpAvailable = false;
      console.log("[ApiService] PHP backend unavailable, using localStorage fallback.");
    }
  },

  async getLeaderboard() {
    if (this.isPhpAvailable) {
      try {
        const res = await fetch("api/scores.php");
        const json = await res.json();
        if (json.status === "success") {
          return json.leaderboard;
        }
      } catch (err) {
        console.warn("[ApiService] Error fetching leaderboard from API, falling back:", err);
      }
    }

    // LocalStorage fallback
    const raw = localStorage.getItem("bucc_game_leaderboard");
    if (raw) {
      try {
        let scores = JSON.parse(raw);
        // Purge old mock seeded data if present
        if (Array.isArray(scores)) {
          scores = scores.filter(s => s && s.name && !s.id?.startsWith("score_seed_") && s.name !== "BUCC Rookie GM" && s.name !== "Mahir Coder" && s.name !== "Abrar Creative" && s.name !== "Tahmid C&M" && s.name !== "Adittya (R&D)");
          return scores.slice(0, 5);
        }
      } catch (e) {}
    }

    // Default: Clean start with no fake players
    return [];
  },

  async submitScore(scoreData) {
    if (this.isPhpAvailable) {
      try {
        const res = await fetch("api/scores.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scoreData)
        });
        const json = await res.json();
        if (json.status === "success") {
          return json;
        }
      } catch (err) {
        console.warn("[ApiService] Error submitting score to API:", err);
      }
    }

    // LocalStorage fallback
    const scores = await this.getLeaderboard();
    const newEntry = {
      name: scoreData.name || "BUCC Player",
      score: scoreData.score || 0,
      coins: scoreData.coins || 0,
      rank: scoreData.rank || "General Member",
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    scores.push(newEntry);
    // Sort descending by score, then coins
    scores.sort((a, b) => {
      if (b.score === a.score) return (b.coins || 0) - (a.coins || 0);
      return (b.score || 0) - (a.score || 0);
    });
    // Keep strictly top 5 in leaderboard
    const trimmed = scores.slice(0, 5);
    localStorage.setItem("bucc_game_leaderboard", JSON.stringify(trimmed));

    const rankPos = trimmed.findIndex(s => s.name === newEntry.name && s.score === newEntry.score) + 1;
    return {
      status: "success",
      leaderboard_rank: rankPos > 0 ? rankPos : (scores.length <= 5 ? scores.length : 999),
      leaderboard: trimmed
    };
  }
};
