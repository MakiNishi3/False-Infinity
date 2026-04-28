var gamespeed = 1;
var mlt = 1;
var mny = new ExpantaNum(0);
function d(x) { return new ExpantaNum(x); }
var cst = {};
function current() {
  var total = d(0);
  shop.forEach(function(s) { total = total.add(s.production()); });
  dimensions.forEach(function(dim) { total = total.add(dim.production()); });
  return total.mul(mlt);
}

var options = {
  offlineProgress: true,
  updateRate: 20,
  theme: "default",
};

var statistics = {
  totalEarned: d(0),
  totalClicks: 0,
  totalPurchases: 0,
  totalUpgrades: 0,
  totalTime: 0,
  offlineGained: d(0),
  totalSaves: 0,
  startTime: Date.now(),
};

var shop = [
  { id: "cursor",   name: "Cursor",    baseCost: d(10),      baseProduction: d(0.1),   count: d(0), mult: d(1) },
  { id: "node",     name: "Node",      baseCost: d(100),     baseProduction: d(0.5),   count: d(0), mult: d(1) },
  { id: "farm",     name: "Farm",      baseCost: d(1100),    baseProduction: d(4),     count: d(0), mult: d(1) },
  { id: "mine",     name: "Mine",      baseCost: d(12000),   baseProduction: d(20),    count: d(0), mult: d(1) },
  { id: "factory",  name: "Factory",   baseCost: d(130000),  baseProduction: d(100),   count: d(0), mult: d(1) },
  { id: "lab",      name: "Lab",       baseCost: d(1.4e6),   baseProduction: d(500),   count: d(0), mult: d(1) },
  { id: "temple",   name: "Temple",    baseCost: d(2e7),     baseProduction: d(2000),  count: d(0), mult: d(1) },
  { id: "wizard",   name: "Wizard",    baseCost: d(3.3e8),   baseProduction: d(10000), count: d(0), mult: d(1) },
  { id: "portal",   name: "Portal",    baseCost: d(5.1e9),   baseProduction: d(55000), count: d(0), mult: d(1) },
  { id: "timem",    name: "Timemach",  baseCost: d(7.5e10),  baseProduction: d(260000),count: d(0), mult: d(1) },
  { id: "antimass", name: "Antimass",  baseCost: d(1e12),    baseProduction: d(1.6e6), count: d(0), mult: d(1) },
  { id: "prism",    name: "Prism",     baseCost: d(1.5e13),  baseProduction: d(1e7),   count: d(0), mult: d(1) },
  { id: "chancemaker", name: "Chancemkr", baseCost: d(2e14), baseProduction: d(7e7), count: d(0), mult: d(1) },
  { id: "fractal",  name: "Fractalmk", baseCost: d(3.1e15), baseProduction: d(5e8),   count: d(0), mult: d(1) },
];

shop.forEach(function(s) {
  s.cost = function() { return s.baseCost.mul(ExpantaNum.pow(1.15, s.count)); };
  s.production = function() { return s.baseProduction.mul(s.count).mul(s.mult); };
  s.buy = function() {
    if (mny.gte(s.cost())) {
      mny = mny.sub(s.cost());
      s.count = s.count.add(1);
      statistics.totalPurchases++;
      renderShop();
      renderStats();
    }
  };
});

var upgrades = [
  { id: "u1",  name: "Cursor I",    desc: "Cursors 2x",    cost: d(100),    bought: false, apply: function() { shop[0].mult = shop[0].mult.mul(2); } },
  { id: "u2",  name: "Cursor II",   desc: "Cursors 4x",    cost: d(500),    bought: false, apply: function() { shop[0].mult = shop[0].mult.mul(4); } },
  { id: "u3",  name: "Node I",      desc: "Nodes 2x",      cost: d(1000),   bought: false, apply: function() { shop[1].mult = shop[1].mult.mul(2); } },
  { id: "u4",  name: "Node II",     desc: "Nodes 4x",      cost: d(5000),   bought: false, apply: function() { shop[1].mult = shop[1].mult.mul(4); } },
  { id: "u5",  name: "Farm I",      desc: "Farms 2x",      cost: d(11000),  bought: false, apply: function() { shop[2].mult = shop[2].mult.mul(2); } },
  { id: "u6",  name: "Farm II",     desc: "Farms 4x",      cost: d(55000),  bought: false, apply: function() { shop[2].mult = shop[2].mult.mul(4); } },
  { id: "u7",  name: "Mine I",      desc: "Mines 2x",      cost: d(120000), bought: false, apply: function() { shop[3].mult = shop[3].mult.mul(2); } },
  { id: "u8",  name: "Mine II",     desc: "Mines 4x",      cost: d(600000), bought: false, apply: function() { shop[3].mult = shop[3].mult.mul(4); } },
  { id: "u9",  name: "Factory I",   desc: "Factories 2x",  cost: d(1.3e6),  bought: false, apply: function() { shop[4].mult = shop[4].mult.mul(2); } },
  { id: "u10", name: "Factory II",  desc: "Factories 4x",  cost: d(6.5e6),  bought: false, apply: function() { shop[4].mult = shop[4].mult.mul(4); } },
  { id: "u11", name: "Lab I",       desc: "Labs 2x",       cost: d(1.4e7),  bought: false, apply: function() { shop[5].mult = shop[5].mult.mul(2); } },
  { id: "u12", name: "Lab II",      desc: "Labs 4x",       cost: d(7e7),    bought: false, apply: function() { shop[5].mult = shop[5].mult.mul(4); } },
  { id: "u13", name: "Global I",    desc: "All prod 1.5x", cost: d(1e8),    bought: false, apply: function() { mlt *= 1.5; } },
  { id: "u14", name: "Global II",   desc: "All prod 2x",   cost: d(1e10),   bought: false, apply: function() { mlt *= 2; } },
  { id: "u15", name: "Global III",  desc: "All prod 3x",   cost: d(1e15),   bought: false, apply: function() { mlt *= 3; } },
  { id: "u16", name: "Click I",     desc: "+10 per click", cost: d(500),    bought: false, apply: function() { clickBonus = clickBonus.add(10); } },
  { id: "u17", name: "Click II",    desc: "+100 per click",cost: d(5000),   bought: false, apply: function() { clickBonus = clickBonus.add(100); } },
  { id: "u18", name: "Click III",   desc: "+1000 /click",  cost: d(50000),  bought: false, apply: function() { clickBonus = clickBonus.add(1000); } },
  { id: "u19", name: "Gamespeed I", desc: "1.5x game speed",cost: d(1e9),   bought: false, apply: function() { gamespeed *= 1.5; } },
  { id: "u20", name: "Gamespeed II", desc: "2x game speed",cost: d(1e12),   bought: false, apply: function() { gamespeed *= 2; } },
];

var clickBonus = d(1);

var dimensions = [];
(function() {
  var dimCosts = [d(1e3), d(1e4), d(1e5), d(1e7), d(1e9), d(1e12), d(1e16), d(1e21)];
  var dimProd =  [d(0.001), d(0.005), d(0.025), d(0.12), d(0.6), d(3), d(16), d(85)];
  for (var i = 0; i < 8; i++) {
    dimensions.push({ idx: i, name: "Dim " + (i+1), cost: dimCosts[i], baseProd: dimProd[i], count: d(0), unlocked: false,
      production: (function(ii) { return function() {
        if (!dimensions[ii].unlocked) return d(0);
        var base = dimensions[ii].baseProd.mul(dimensions[ii].count);
        if (ii < 7) base = base.add(dimensions[ii+1].baseProd.mul(dimensions[ii+1].count).mul(0.1));
        return base;
      }; })(i)
    });
  }
  dimensions[0].unlocked = true;
})();

var Infinity = {
  count: 0,
  points: d(0),
  mult: d(1),
  requirement: d(1e308),
  upgrades: [
    { id: "iu1", name: "Inf Mult I",  desc: "2x all production", cost: d(1),  bought: false, apply: function() { Infinity.mult = Infinity.mult.mul(2); } },
    { id: "iu2", name: "Inf Mult II", desc: "4x all production", cost: d(5),  bought: false, apply: function() { Infinity.mult = Infinity.mult.mul(4); } },
    { id: "iu3", name: "Inf Mult III","desc": "10x all production",cost: d(25),bought: false, apply: function() { Infinity.mult = Infinity.mult.mul(10); } },
    { id: "iu4", name: "Inf Speed",   desc: "2x game speed",     cost: d(10), bought: false, apply: function() { gamespeed *= 2; } },
    { id: "iu5", name: "Inf Click",   desc: "Click gives 1% MPS",cost: d(50), bought: false, apply: function() { Infinity.clickMPS = true; } },
  ],
  clickMPS: false,
  canInfinity: function() { return mny.gte(Infinity.requirement); },
  doInfinity: function() {
    if (!Infinity.canInfinity()) return;
    Infinity.count++;
    Infinity.points = Infinity.points.add(1);
    mny = d(0);
    shop.forEach(function(s) { s.count = d(0); s.mult = d(1); });
    upgrades.forEach(function(u) { u.bought = false; });
    dimensions.forEach(function(dim, i) { dim.count = d(0); dim.unlocked = i === 0; });
    mlt = 1;
    clickBonus = d(1);
    Infinity.mult = d(1);
    Infinity.upgrades.forEach(function(u) { if (u.bought) u.apply(); });
    notify("Infinity #" + Infinity.count + "!");
    renderAll();
  }
};

var eternity = {
  count: 0,
  points: d(0),
  mult: d(1),
  requirement: d(1),
  upgrades: [
    { id: "eu1", name: "Eter Mult I",  desc: "Infinity pts 2x",  cost: d(1),  bought: false, apply: function() { eternity.mult = eternity.mult.mul(2); } },
    { id: "eu2", name: "Eter Mult II", desc: "Infinity pts 4x",  cost: d(3),  bought: false, apply: function() { eternity.mult = eternity.mult.mul(4); } },
    { id: "eu3", name: "Eter Speed",   desc: "2x gamespeed",     cost: d(5),  bought: false, apply: function() { gamespeed *= 2; } },
    { id: "eu4", name: "Eter Auto",    desc: "Auto-infinity",    cost: d(10), bought: false, apply: function() { eternity.autoInf = true; } },
  ],
  autoInf: false,
  canEternity: function() { return Infinity.count >= 10; },
  doEternity: function() {
    if (!eternity.canEternity()) return;
    eternity.count++;
    eternity.points = eternity.points.add(1);
    Infinity.count = 0;
    Infinity.points = d(0);
    Infinity.mult = d(1);
    Infinity.clickMPS = false;
    mny = d(0);
    shop.forEach(function(s) { s.count = d(0); s.mult = d(1); });
    upgrades.forEach(function(u) { u.bought = false; });
    dimensions.forEach(function(dim, i) { dim.count = d(0); dim.unlocked = i === 0; });
    mlt = 1; clickBonus = d(1);
    Infinity.upgrades.forEach(function(u) { u.bought = false; });
    eternity.upgrades.forEach(function(u) { if (u.bought) u.apply(); });
    notify("Eternity #" + eternity.count + "!");
    renderAll();
  }
};

var lastTick = Date.now();
var lastSave = Date.now();

function tick() {
  var now = Date.now();
  var dt = (now - lastTick) / 1000 * gamespeed;
  lastTick = now;
  dt = Math.min(dt, 60);

  var prod = current().mul(dt).mul(Infinity.mult);
  mny = mny.add(prod);
  statistics.totalEarned = statistics.totalEarned.add(prod);
  statistics.totalTime += dt / gamespeed;

  if (eternity.autoInf && Infinity.canInfinity()) Infinity.doInfinity();

  checkAchievements();

  if (now - lastSave > 30000) { saveGame(); lastSave = now; }

  renderMoney();
  renderDims();
  renderShop();
  renderStats();
  renderAchievements();
}

function clickMoney() {
  var bonus = clickBonus;
  if (Infinity.clickMPS) bonus = bonus.add(current().mul(0.01));
  mny = mny.add(bonus);
  statistics.totalEarned = statistics.totalEarned.add(bonus);
  statistics.totalClicks++;
  renderMoney();
  renderStats();
}

function renderMoney() {
  var el = document.getElementById("mny-val");
  if (el) el.textContent = formatNum(mny);
  var mps = document.getElementById("mps-val");
  if (mps) mps.textContent = formatNum(current().mul(Infinity.mult)) + "/s";
  var top = document.getElementById("top-mny");
  if (top) top.textContent = formatNum(mny);
}

function renderShop() {
  var el = document.getElementById("shop-list");
  if (!el) return;
  el.innerHTML = "";
  shop.forEach(function(s) {
    var canBuy = mny.gte(s.cost());
    var div = document.createElement("div");
    div.className = "shop-item" + (canBuy ? "" : " disabled");
    div.innerHTML =
      '<div class="shop-item-name"><span>' + s.name + '</span><span>x' + formatNum(s.count) + '</span></div>' +
      '<div class="shop-item-cost">Cost: ' + formatNum(s.cost()) + '</div>' +
      '<div class="shop-item-prod">Prod: ' + formatNum(s.production()) + '/s</div>';
    if (canBuy) div.onclick = function() { s.buy(); };
    el.appendChild(div);
  });
}

function renderUpgrades() {
  var el = document.getElementById("upg-list");
  if (!el) return;
  el.innerHTML = "";
  upgrades.forEach(function(u) {
    var canBuy = !u.bought && mny.gte(u.cost);
    var div = document.createElement("div");
    div.className = "upgrade-item" + (u.bought ? " bought" : canBuy ? "" : " disabled");
    div.innerHTML =
      '<div class="upgrade-item-name"><span>' + u.name + '</span><span>' + (u.bought ? "✓" : formatNum(u.cost)) + '</span></div>' +
      '<div class="upgrade-item-desc">' + u.desc + '</div>';
    if (canBuy) div.onclick = function() {
      if (mny.gte(u.cost)) {
        mny = mny.sub(u.cost);
        u.bought = true;
        u.apply();
        statistics.totalUpgrades++;
        renderUpgrades();
        renderStats();
        notify("Bought: " + u.name);
      }
    };
    el.appendChild(div);
  });
}

function renderDims() {
  var el = document.getElementById("dim-list");
  if (!el) return;
  el.innerHTML = "";
  dimensions.forEach(function(dim) {
    var unlockCost = dim.cost;
    var canBuy = mny.gte(unlockCost);
    var div = document.createElement("div");
    div.className = "dim-bar";
    var label = dim.unlocked ? (dim.name + " x" + formatNum(dim.count)) : (dim.name + " [LOCKED]");
    var costLabel = dim.unlocked ? formatNum(dim.cost) : "Unlock: " + formatNum(dim.cost);
    div.innerHTML =
      '<span class="dim-name">' + label + '</span>' +
      '<span class="dim-prod">' + formatNum(dim.production()) + '/s</span>' +
      '<span class="dim-cost">' + costLabel + '</span>';
    if (canBuy) {
      div.style.cursor = "pointer";
      div.onclick = function() {
        if (mny.gte(unlockCost)) {
          mny = mny.sub(unlockCost);
          dim.unlocked = true;
          dim.count = dim.count.add(1);
          statistics.totalPurchases++;
          renderDims();
        }
      };
    }
    el.appendChild(div);
  });
}

function renderStats() {
  var el = document.getElementById("stats-body");
  if (!el) return;
  el.innerHTML =
    stat("Money", formatNum(mny)) +
    stat("Total Earned", formatNum(statistics.totalEarned)) +
    stat("Per Second", formatNum(current().mul(Infinity.mult))) +
    stat("Per Click", formatNum(clickBonus)) +
    stat("Total Clicks", statistics.totalClicks) +
    stat("Total Purchases", statistics.totalPurchases) +
    stat("Total Upgrades", statistics.totalUpgrades) +
    stat("Infinities", Infinity.count) +
    stat("Inf Points", formatNum(Infinity.points)) +
    stat("Eternities", eternity.count) +
    stat("Eter Points", formatNum(eternity.points)) +
    stat("Play Time", formatTime(statistics.totalTime)) +
    stat("Game Speed", gamespeed.toFixed(2) + "x") +
    stat("Prod Mult", mlt.toFixed(2) + "x");
}

function stat(l, v) {
  return '<div class="stat-row"><span class="stat-label">' + l + '</span><span class="stat-val">' + v + '</span></div>';
}

function renderInfinity() {
  var el = document.getElementById("inf-panel");
  if (!el) return;
  var canInf = Infinity.canInfinity();
  el.innerHTML =
    '<div class="panel-title">Infinity</div>' +
    '<div class="inf-panel">' +
    stat("Count", Infinity.count) +
    stat("Points", formatNum(Infinity.points)) +
    stat("Mult", formatNum(Infinity.mult)) +
    stat("Req", formatNum(Infinity.requirement)) +
    '<button class="btn' + (canInf ? "" : " disabled") + '" onclick="Infinity.doInfinity()" ' + (canInf ? "" : "disabled") + '>INFINITY</button>' +
    '<div class="section-header">INF UPGRADES</div>' +
    Infinity.upgrades.map(function(u) {
      var canBuy = !u.bought && Infinity.points.gte(u.cost);
      return '<div class="upgrade-item' + (u.bought ? " bought" : canBuy ? "" : " disabled") + '" onclick="buyInfUpg(\'' + u.id + '\')">' +
        '<div class="upgrade-item-name"><span>' + u.name + '</span><span>' + (u.bought ? "✓" : formatNum(u.cost) + " IP") + '</span></div>' +
        '<div class="upgrade-item-desc">' + u.desc + '</div></div>';
    }).join("") +
    '</div>';
}

function buyInfUpg(id) {
  var u = Infinity.upgrades.find(function(x) { return x.id === id; });
  if (!u || u.bought || !Infinity.points.gte(u.cost)) return;
  Infinity.points = Infinity.points.sub(u.cost);
  u.bought = true;
  u.apply();
  renderInfinity();
  notify("Bought: " + u.name);
}

function renderEternity() {
  var el = document.getElementById("eter-panel");
  if (!el) return;
  var canEter = eternity.canEternity();
  el.innerHTML =
    '<div class="panel-title">Eternity</div>' +
    '<div class="eter-panel">' +
    stat("Count", eternity.count) +
    stat("Points", formatNum(eternity.points)) +
    stat("Req", "10 Infinities") +
    '<button class="btn' + (canEter ? "" : " disabled") + '" onclick="eternity.doEternity()" ' + (canEter ? "" : "disabled") + '>ETERNITY</button>' +
    '<div class="section-header">ETER UPGRADES</div>' +
    eternity.upgrades.map(function(u) {
      var canBuy = !u.bought && eternity.points.gte(u.cost);
      return '<div class="upgrade-item' + (u.bought ? " bought" : canBuy ? "" : " disabled") + '" onclick="buyEterUpg(\'' + u.id + '\')">' +
        '<div class="upgrade-item-name"><span>' + u.name + '</span><span>' + (u.bought ? "✓" : formatNum(u.cost) + " EP") + '</span></div>' +
        '<div class="upgrade-item-desc">' + u.desc + '</div></div>';
    }).join("") +
    '</div>';
}

function buyEterUpg(id) {
  var u = eternity.upgrades.find(function(x) { return x.id === id; });
  if (!u || u.bought || !eternity.points.gte(u.cost)) return;
  eternity.points = eternity.points.sub(u.cost);
  u.bought = true;
  u.apply();
  renderEternity();
  notify("Bought: " + u.name);
}

function renderOptions() {
  var el = document.getElementById("options-body");
  if (!el) return;
  el.innerHTML =
    '<div class="options-section">' +
    '<div class="options-label">Gameplay</div>' +
    '<label><input type="checkbox" id="opt-offline" ' + (options.offlineProgress ? "checked" : "") + ' onchange="options.offlineProgress=this.checked"> Offline Progress</label>' +
    '<div class="options-label">Update Rate (per second)</div>' +
    '<select onchange="setUpdateRate(this.value)"><option value="10"' + (options.updateRate===10?" selected":"") + '>10</option><option value="20"' + (options.updateRate===20?" selected":"") + '>20 (default)</option><option value="40"' + (options.updateRate===40?" selected":"") + '>40</option><option value="60"' + (options.updateRate===60?" selected":"") + '>60</option></select>' +
    '<div class="options-label">Visual / UI Theme</div>' +
    '<select onchange="setTheme(this.value)"><option value="default"' + (options.theme==="default"?" selected":"") + '>Default (White)</option><option value="dark"' + (options.theme==="dark"?" selected":"") + '>Dark</option><option value="green"' + (options.theme==="green"?" selected":"") + '>Terminal Green</option></select>' +
    '<div class="options-label">Save / Export</div>' +
    '<button class="btn" onclick="saveGame()">Save the Game</button>' +
    '<button class="btn btn-outline" onclick="exportGame()">Export Game</button>' +
    '<button class="btn btn-outline" onclick="exportGameFile()">Export Game via File</button>' +
    '<button class="btn btn-outline" onclick="importGamePrompt()">Import the Game</button>' +
    '<button class="btn btn-outline" onclick="importGameFile()">Import Game via File</button>' +
    '<div class="options-label">Import Text</div>' +
    '<textarea id="import-text" rows="3" placeholder="Paste save data here..."></textarea>' +
    '<button class="btn btn-outline" onclick="importFromTextarea()">Import from Text</button>' +
    '<div class="options-label">Danger Zone</div>' +
    '<button class="btn btn-danger" onclick="resetGame()">RESET THE GAME</button>' +
    '</div>';
}

function setUpdateRate(val) {
  options.updateRate = parseInt(val);
  if (window._tickInterval) clearInterval(window._tickInterval);
  window._tickInterval = setInterval(tick, 1000 / options.updateRate);
}

function setTheme(val) {
  options.theme = val;
  document.body.className = val === "dark" ? "theme-dark" : val === "green" ? "theme-green" : "";
}

function renderAll() {
  renderMoney();
  renderShop();
  renderUpgrades();
  renderDims();
  renderStats();
  renderInfinity();
  renderEternity();
  renderAchievements();
  renderOptions();
}

function formatNum(n) {
  if (!(n instanceof ExpantaNum)) n = d(n);
  if (n.lt(d(1e6))) {
    var v = parseFloat(n.toNumber().toFixed(2));
    return v.toLocaleString();
  }
  return n.toExponential(3);
}

function formatTime(s) {
  s = Math.floor(s);
  var h = Math.floor(s / 3600);
  var m = Math.floor((s % 3600) / 60);
  var sec = s % 60;
  return h + "h " + m + "m " + sec + "s";
}

function notify(msg) {
  var el = document.getElementById("notify");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(window._notifyTimeout);
  window._notifyTimeout = setTimeout(function() { el.classList.remove("show"); }, 2500);
}

function getSave() {
  return {
    mny: mny.toString(),
    mlt: mlt,
    gamespeed: gamespeed,
    clickBonus: clickBonus.toString(),
    shop: shop.map(function(s) { return { count: s.count.toString(), mult: s.mult.toString() }; }),
    upgrades: upgrades.map(function(u) { return u.bought; }),
    dimensions: dimensions.map(function(dim) { return { count: dim.count.toString(), unlocked: dim.unlocked }; }),
    Infinity: { count: Infinity.count, points: Infinity.points.toString(), mult: Infinity.mult.toString(), clickMPS: Infinity.clickMPS, upgrades: Infinity.upgrades.map(function(u) { return u.bought; }) },
    eternity: { count: eternity.count, points: eternity.points.toString(), mult: eternity.mult.toString(), autoInf: eternity.autoInf, upgrades: eternity.upgrades.map(function(u) { return u.bought; }) },
    statistics: { totalEarned: statistics.totalEarned.toString(), totalClicks: statistics.totalClicks, totalPurchases: statistics.totalPurchases, totalUpgrades: statistics.totalUpgrades, totalTime: statistics.totalTime, offlineGained: statistics.offlineGained.toString(), totalSaves: statistics.totalSaves, startTime: statistics.startTime },
    achievements: Array.from(unlockedAchievements),
    options: options,
    lastSaveTime: Date.now(),
  };
}

function applySave(data) {
  try {
    mny = d(data.mny);
    mlt = data.mlt || 1;
    gamespeed = data.gamespeed || 1;
    clickBonus = d(data.clickBonus || 1);
    if (data.shop) data.shop.forEach(function(s, i) { if (shop[i]) { shop[i].count = d(s.count); shop[i].mult = d(s.mult); } });
    if (data.upgrades) data.upgrades.forEach(function(b, i) { if (upgrades[i]) { upgrades[i].bought = b; if (b) upgrades[i].apply(); } });
    if (data.dimensions) data.dimensions.forEach(function(dim, i) { if (dimensions[i]) { dimensions[i].count = d(dim.count); dimensions[i].unlocked = dim.unlocked; } });
    if (data.Infinity) {
      Infinity.count = data.Infinity.count || 0;
      Infinity.points = d(data.Infinity.points || 0);
      Infinity.mult = d(data.Infinity.mult || 1);
      Infinity.clickMPS = data.Infinity.clickMPS || false;
      if (data.Infinity.upgrades) data.Infinity.upgrades.forEach(function(b, i) { if (Infinity.upgrades[i]) { Infinity.upgrades[i].bought = b; if (b) Infinity.upgrades[i].apply(); } });
    }
    if (data.eternity) {
      eternity.count = data.eternity.count || 0;
      eternity.points = d(data.eternity.points || 0);
      eternity.mult = d(data.eternity.mult || 1);
      eternity.autoInf = data.eternity.autoInf || false;
      if (data.eternity.upgrades) data.eternity.upgrades.forEach(function(b, i) { if (eternity.upgrades[i]) { eternity.upgrades[i].bought = b; if (b) eternity.upgrades[i].apply(); } });
    }
    if (data.statistics) {
      statistics.totalEarned = d(data.statistics.totalEarned || 0);
      statistics.totalClicks = data.statistics.totalClicks || 0;
      statistics.totalPurchases = data.statistics.totalPurchases || 0;
      statistics.totalUpgrades = data.statistics.totalUpgrades || 0;
      statistics.totalTime = data.statistics.totalTime || 0;
      statistics.offlineGained = d(data.statistics.offlineGained || 0);
      statistics.totalSaves = data.statistics.totalSaves || 0;
      statistics.startTime = data.statistics.startTime || Date.now();
    }
    if (data.achievements) data.achievements.forEach(function(id) { unlockedAchievements.add(id); });
    if (data.options) { options.offlineProgress = data.options.offlineProgress !== false; options.updateRate = data.options.updateRate || 20; options.theme = data.options.theme || "default"; setTheme(options.theme); }
    if (options.offlineProgress && data.lastSaveTime) {
      var offlineSec = Math.min((Date.now() - data.lastSaveTime) / 1000, 86400);
      var offlineGain = current().mul(Infinity.mult).mul(offlineSec).mul(0.5);
      mny = mny.add(offlineGain);
      statistics.totalEarned = statistics.totalEarned.add(offlineGain);
      statistics.offlineGained = statistics.offlineGained.add(offlineGain);
      if (offlineSec > 10) notify("Offline: +" + formatNum(offlineGain));
    }
  } catch(e) { notify("Load error: " + e.message); }
}

function saveGame() {
  try {
    statistics.totalSaves++;
    var data = JSON.stringify(getSave());
    var encoded = btoa(data);
    localStorage.setItem("incrementalSave", encoded);
    notify("Game saved.");
  } catch(e) { notify("Save error: " + e.message); }
}

function loadGame() {
  try {
    var raw = localStorage.getItem("incrementalSave");
    if (!raw) return;
    var data = JSON.parse(atob(raw));
    applySave(data);
  } catch(e) { notify("Load error: " + e.message); }
}

function exportGame() {
  var data = btoa(JSON.stringify(getSave()));
  navigator.clipboard.writeText(data).then(function() { notify("Copied to clipboard!"); }).catch(function() {
    var el = document.getElementById("import-text");
    if (el) { el.value = data; notify("Copied to import box."); }
  });
}

function exportGameFile() {
  var data = btoa(JSON.stringify(getSave()));
  var blob = new Blob([data], { type: "text/plain" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "incremental_save.txt";
  a.click();
  notify("File exported.");
}

function importGamePrompt() {
  var el = document.getElementById("import-text");
  if (!el) { notify("Use the text box in Options."); return; }
  switchRightTab("options");
  setTimeout(function() { el.focus(); notify("Paste save data in the text box."); }, 100);
}

function importFromTextarea() {
  var el = document.getElementById("import-text");
  if (!el || !el.value.trim()) { notify("No data to import."); return; }
  importFromString(el.value.trim());
  el.value = "";
}

function importGameFile() {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt";
  input.onchange = function() {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) { importFromString(e.target.result.trim()); };
    reader.readAsText(file);
  };
  input.click();
}

function importFromString(str) {
  try {
    var data = JSON.parse(atob(str));
    applySave(data);
    renderAll();
    notify("Game imported!");
  } catch(e) { notify("Invalid save data."); }
}

function resetGame() {
  if (!confirm("Really reset ALL progress? This cannot be undone.")) return;
  localStorage.removeItem("incrementalSave");
  location.reload();
}

var _leftTab = "shop";
var _rightTab = "stats";

function switchLeftTab(tab) {
  _leftTab = tab;
  document.querySelectorAll("#left-tabs .tab-btn").forEach(function(b) { b.classList.toggle("active", b.dataset.tab === tab); });
  document.querySelectorAll("#left-contents .tab-content").forEach(function(c) { c.classList.toggle("active", c.dataset.tab === tab); });
  if (tab === "upgrades") renderUpgrades();
  if (tab === "dims") renderDims();
}

function switchRightTab(tab) {
  _rightTab = tab;
  document.querySelectorAll("#right-tabs .tab-btn").forEach(function(b) { b.classList.toggle("active", b.dataset.tab === tab); });
  document.querySelectorAll("#right-contents .tab-content").forEach(function(c) { c.classList.toggle("active", c.dataset.tab === tab); });
  if (tab === "inf") renderInfinity();
  if (tab === "eter") renderEternity();
  if (tab === "options") renderOptions();
  if (tab === "ach") renderAchievements();
}

window.onload = function() {
  loadGame();
  renderAll();
  setUpdateRate(options.updateRate);
  setTheme(options.theme);
};

window.onbeforeunload = function() { saveGame(); };
