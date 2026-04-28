var achievementList = [
  { id: "first_money", name: "Hello, World", desc: "Earn your first unit of money.", icon: "◎", check: () => mny.gte(1) },
  { id: "sci_note", name: "Scientific Notation", desc: "Reach 1e6 money.", icon: "🔬", check: () => mny.gte(d(1e6)) },
  { id: "millionaire", name: "Millionaire", desc: "Have 1,000,000 money.", icon: "◈", check: () => statistics.totalEarned.gte(d(1e6)) },
  { id: "e9", name: "Billions", desc: "Earn 1e9 money total.", icon: "◉", check: () => statistics.totalEarned.gte(d(1e9)) },
  { id: "e15", name: "Quadrillionaire", desc: "Earn 1e15 money total.", icon: "⬡", check: () => statistics.totalEarned.gte(d(1e15)) },
  { id: "totally_balanced", name: "Totally Balanced", desc: "Reach e9e15 money.", icon: "⚖", check: () => mny.gte(ExpantaNum.pow(10, d(9e15))) },
  { id: "shop1", name: "First Purchase", desc: "Buy your first shop item.", icon: "🛒", check: () => statistics.totalPurchases >= 1 },
  { id: "shop10", name: "Shopaholic", desc: "Make 10 purchases.", icon: "🏪", check: () => statistics.totalPurchases >= 10 },
  { id: "shop100", name: "Retail Therapy", desc: "Make 100 purchases.", icon: "🏬", check: () => statistics.totalPurchases >= 100 },
  { id: "upg1", name: "Upgraded", desc: "Buy your first upgrade.", icon: "⬆", check: () => statistics.totalUpgrades >= 1 },
  { id: "upg10", name: "Optimizer", desc: "Buy 10 upgrades.", icon: "⬆⬆", check: () => statistics.totalUpgrades >= 10 },
  { id: "click10", name: "Clicker", desc: "Click 10 times.", icon: "👆", check: () => statistics.totalClicks >= 10 },
  { id: "click100", name: "Spam Clicker", desc: "Click 100 times.", icon: "👆👆", check: () => statistics.totalClicks >= 100 },
  { id: "click1000", name: "Transcendent Clicker", desc: "Click 1,000 times.", icon: "✦", check: () => statistics.totalClicks >= 1000 },
  { id: "inf1", name: "Infinity", desc: "Perform your first Infinity.", icon: "∞", check: () => Infinity.count >= 1 },
  { id: "inf10", name: "Infinities", desc: "Perform 10 Infinities.", icon: "∞∞", check: () => Infinity.count >= 10 },
  { id: "eter1", name: "Eternity", desc: "Perform your first Eternity.", icon: "Ω", check: () => eternity.count >= 1 },
  { id: "eter5", name: "Eternal", desc: "Perform 5 Eternities.", icon: "ΩΩ", check: () => eternity.count >= 5 },
  { id: "dim_all", name: "Dimensional", desc: "Unlock all 8 dimensions.", icon: "⬡", check: () => dimensions.filter(d => d.count.gt(0)).length >= 8 },
  { id: "dim_100", name: "Dimension Master", desc: "Have 100 of any dimension.", icon: "⬡⬡", check: () => dimensions.some(d => d.count.gte(100)) },
  { id: "e30", name: "Astronomic", desc: "Earn 1e30 total money.", icon: "★", check: () => statistics.totalEarned.gte(d(1e30)) },
  { id: "e100", name: "Googolward", desc: "Earn 1e100 total money.", icon: "✦", check: () => statistics.totalEarned.gte(ExpantaNum.pow(10, 100)) },
  { id: "e1000", name: "Millennial", desc: "Earn 10^1000 total money.", icon: "◆", check: () => statistics.totalEarned.gte(ExpantaNum.pow(10, 1000)) },
  { id: "speed1", name: "Fast Lane", desc: "Reach 1e6 money per second.", icon: "⚡", check: () => current().gte(d(1e6)) },
  { id: "speed2", name: "Light Speed", desc: "Reach 1e15 money per second.", icon: "⚡⚡", check: () => current().gte(d(1e15)) },
  { id: "offline", name: "Away From Desk", desc: "Gain offline progress.", icon: "💤", check: () => statistics.offlineGained.gt(0) },
  { id: "save1", name: "Saved", desc: "Save the game.", icon: "💾", check: () => statistics.totalSaves >= 1 },
  { id: "playtime1", name: "Committed", desc: "Play for 1 hour.", icon: "⏱", check: () => statistics.totalTime >= 3600 },
  { id: "playtime2", name: "Dedicated", desc: "Play for 24 hours.", icon: "⌛", check: () => statistics.totalTime >= 86400 },
];

var unlockedAchievements = new Set();

function checkAchievements() {
  achievementList.forEach(a => {
    if (!unlockedAchievements.has(a.id) && a.check()) {
      unlockedAchievements.add(a.id);
      notify("Achievement: " + a.name);
    }
  });
}

function renderAchievements() {
  var el = document.getElementById("ach-list");
  if (!el) return;
  el.innerHTML = "";
  achievementList.forEach(a => {
    var locked = !unlockedAchievements.has(a.id);
    var div = document.createElement("div");
    div.className = "achievement" + (locked ? " locked" : "");
    div.innerHTML = '<div class="achievement-icon">' + a.icon + '</div><div class="achievement-info"><div class="achievement-name">' + a.name + '</div><div class="achievement-desc">' + a.desc + '</div></div>';
    el.appendChild(div);
  });
}
