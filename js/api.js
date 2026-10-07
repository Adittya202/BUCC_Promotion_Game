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
        return JSON.parse(raw);
      } catch (e) {}
    }

    // Default seeded leaderboard
    const defaultScores = [
      { name: "Adittya (R&D)", score: 12850, coins: 142, rank: "Governing Body Leader", created_at: "Today" },
      { name: "Mahir Coder", score: 9800, coins: 98, rank: "Executive Board", created_at: "Today" },
      { name: "Abrar Creative", score: 7650, coins: 75, rank: "Senior Executive", created_at: "Yesterday" },
      { name: "Tahmid C&M", score: 5400, coins: 58, rank: "Executive", created_at: "Yesterday" },
      { name: "BUCC Rookie GM", score: 2100, coins: 20, rank: "General Member", created_at: "2 days ago" }
    ];
    localStorage.setItem("bucc_game_leaderboard", JSON.stringify(defaultScores));
    return defaultScores;
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
      name: scoreData.name || "BUCC Member",
      score: scoreData.score || 0,
      coins: scoreData.coins || 0,
      rank: scoreData.rank || "General Member",
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    scores.push(newEntry);
    scores.sort((a, b) => b.score - a.score);
    const trimmed = scores.slice(0, 15);
    localStorage.setItem("bucc_game_leaderboard", JSON.stringify(trimmed));

    const rankPos = trimmed.findIndex(s => s.name === newEntry.name && s.score === newEntry.score) + 1;
    return {
      status: "success",
      leaderboard_rank: rankPos > 0 ? rankPos : trimmed.length,
      leaderboard: trimmed
    };
  }
};
