/* ==========================================================================
   Hanseatic Aerotec — Premium tier immersive hero
   Canvas 2D blueprint flight map: fine engineering grid, great-circle-style
   route arcs from Finkenwerder (XFW) to partner sites, plane markers
   travelling along the arcs, dash-animated route lines, compass rose.
   Performance-defensive:
     - devicePixelRatio capped at 2
     - pauses when tab hidden or hero scrolled out of view
     - prefers-reduced-motion renders a single static frame
     - no canvas support → CSS blueprint-grid fallback simply remains
   Interaction: the pointer (or a tap) becomes a measuring crosshair with
   coordinates and a dimension line to the XFW hub; it snaps to a route
   destination when close, like a CAD object snap.
   ========================================================================== */

(function () {
  "use strict";

  var canvas = document.getElementById("flight-canvas");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var running = false;
  var rafId = null;
  var t = 0;

  var BLUE = "27, 79, 138";     // blueprint blue
  var ORANGE = "232, 97, 28";   // safety orange
  var INK = "14, 42, 71";       // aviation navy

  /* Measuring crosshair state (eased toward the pointer) */
  var probe = { x: 0, y: 0, tx: 0, ty: 0, on: false, alpha: 0, until: 0 };

  /* Routes: hub + destinations in relative coordinates (0..1), label at dest */
  var HUB = { x: 0.62, y: 0.42, label: "XFW" };
  var routes = [
    { x: 0.30, y: 0.78, label: "TLS", speed: 0.00010, offset: 0.00 },
    { x: 0.10, y: 0.30, label: "YMX", speed: 0.00007, offset: 0.35 },
    { x: 0.90, y: 0.72, label: "TSN", speed: 0.00008, offset: 0.60 },
    { x: 0.88, y: 0.16, label: "HEL", speed: 0.00012, offset: 0.20 },
    { x: 0.38, y: 0.10, label: "BFS", speed: 0.00009, offset: 0.80 }
  ];

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    W = Math.max(1, Math.floor(rect.width));
    H = Math.max(1, Math.floor(rect.height));
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  /* Quadratic-curve control point: perpendicular offset → arc looks great-circle-ish */
  function controlPoint(x1, y1, x2, y2) {
    var mx = (x1 + x2) / 2;
    var my = (y1 + y2) / 2;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: mx - dy / len * len * 0.22, y: my + dx / len * len * 0.22 };
  }

  function pointOnQuad(p0, cp, p1, u) {
    var v = 1 - u;
    return {
      x: v * v * p0.x + 2 * v * u * cp.x + u * u * p1.x,
      y: v * v * p0.y + 2 * v * u * cp.y + u * u * p1.y
    };
  }

  function drawGrid() {
    // fine grid
    ctx.strokeStyle = "rgba(" + BLUE + ", 0.07)";
    ctx.lineWidth = 1;
    var step = 40;
    for (var x = 0; x <= W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (var y = 0; y <= H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    // heavier grid every 5 cells
    ctx.strokeStyle = "rgba(" + BLUE + ", 0.12)";
    for (x = 0; x <= W; x += step * 5) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (y = 0; y <= H; y += step * 5) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function drawCompass() {
    var cx = W * 0.88, cy = H * 0.82, r = Math.min(W, H) * 0.07;
    ctx.strokeStyle = "rgba(" + BLUE + ", 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2); ctx.stroke();
    var a = t * 0.0002;
    ctx.strokeStyle = "rgba(" + ORANGE + ", 0.7)";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9);
    ctx.stroke();
  }

  function drawPlane(p, angle) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(angle);
    ctx.fillStyle = "rgba(" + ORANGE + ", 0.95)";
    ctx.beginPath();
    ctx.moveTo(7, 0);
    ctx.lineTo(-5, 4.5);
    ctx.lineTo(-2.5, 0);
    ctx.lineTo(-5, -4.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /* Fake but consistent geo mapping around Finkenwerder for the readout */
  function fmt(v, digits) { return v.toFixed(digits).replace(".", ","); }

  function drawProbe(hub) {
    if (probe.alpha < 0.02) return;
    var a = probe.alpha;
    probe.x += (probe.tx - probe.x) * 0.25;
    probe.y += (probe.ty - probe.y) * 0.25;

    // object snap to a nearby destination
    var x = probe.x, y = probe.y, snapped = null;
    routes.forEach(function (r) {
      var dx = r.x * W - x, dy = r.y * H - y;
      if (dx * dx + dy * dy < 46 * 46) snapped = r;
    });
    if (snapped) { x = snapped.x * W; y = snapped.y * H; }

    ctx.save();
    ctx.globalAlpha = a;
    // full-width crosshair
    ctx.strokeStyle = "rgba(" + BLUE + ", 0.35)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    // dimension line to the hub
    ctx.strokeStyle = "rgba(" + ORANGE + ", 0.8)";
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(x, y); ctx.stroke();
    ctx.setLineDash([]);
    // reticle
    ctx.strokeStyle = "rgba(" + ORANGE + ", 0.95)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, snapped ? 13 : 9, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 18, y); ctx.lineTo(x - 5, y); ctx.moveTo(x + 5, y); ctx.lineTo(x + 18, y);
    ctx.moveTo(x, y - 18); ctx.lineTo(x, y - 5); ctx.moveTo(x, y + 5); ctx.lineTo(x, y + 18);
    ctx.stroke();

    // readout: pseudo coordinates and distance to XFW
    var lat = 53.532 + (hub.y - y) / H * 9;
    var lon = 9.836 + (x - hub.x) / W * 16;
    var km = Math.sqrt(Math.pow((lat - 53.532) * 111, 2) + Math.pow((lon - 9.836) * 111 * Math.cos(lat * Math.PI / 180), 2));
    var lines = [
      (snapped ? snapped.label + " · " : "") + fmt(lat, 3) + "° N  " + fmt(lon, 3) + "° O",
      "Δ XFW " + Math.round(km).toLocaleString("de-DE") + " km"
    ];
    ctx.font = "11px 'Space Mono', monospace";
    var bw = Math.max(ctx.measureText(lines[0]).width, ctx.measureText(lines[1]).width) + 16;
    var bx = x + 16, by = y + 16;
    if (bx + bw > W - 8) bx = x - 16 - bw;
    if (by + 40 > H - 8) by = y - 56;
    ctx.fillStyle = "rgba(247, 249, 251, 0.92)";
    ctx.strokeStyle = "rgba(" + BLUE + ", 0.5)";
    ctx.lineWidth = 1;
    ctx.fillRect(bx, by, bw, 40);
    ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, 39);
    ctx.fillStyle = "rgba(" + INK + ", 0.95)";
    ctx.fillText(lines[0], bx + 8, by + 16);
    ctx.fillStyle = "rgba(" + ORANGE + ", 1)";
    ctx.fillText(lines[1], bx + 8, by + 31);
    ctx.restore();
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawCompass();

    var hub = { x: HUB.x * W, y: HUB.y * H };

    ctx.font = "11px 'Space Mono', monospace";

    routes.forEach(function (r) {
      var dest = { x: r.x * W, y: r.y * H };
      var cp = controlPoint(hub.x, hub.y, dest.x, dest.y);

      // dash-animated route line
      ctx.strokeStyle = "rgba(" + BLUE + ", 0.5)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 7]);
      ctx.lineDashOffset = -t * 0.02;
      ctx.beginPath();
      ctx.moveTo(hub.x, hub.y);
      ctx.quadraticCurveTo(cp.x, cp.y, dest.x, dest.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // destination node + label
      ctx.fillStyle = "rgba(" + BLUE + ", 0.85)";
      ctx.beginPath(); ctx.arc(dest.x, dest.y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillText(r.label, dest.x + 9, dest.y + 4);

      // plane travelling along the arc (ping-pong)
      var u = (t * r.speed + r.offset) % 2;
      if (u > 1) u = 2 - u;
      var p = pointOnQuad(hub, cp, dest, u);
      var ahead = pointOnQuad(hub, cp, dest, Math.min(1, u + 0.02));
      var angle = Math.atan2(ahead.y - p.y, ahead.x - p.x);
      if (u >= 1) angle += Math.PI; // flying home
      drawPlane(p, angle);
    });

    // hub: pulsing ring + label
    var pulse = 8 + Math.sin(t * 0.003) * 3;
    ctx.strokeStyle = "rgba(" + ORANGE + ", 0.55)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(hub.x, hub.y, pulse + 6, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(" + ORANGE + ", 0.95)";
    ctx.beginPath(); ctx.arc(hub.x, hub.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(" + INK + ", 0.9)";
    ctx.font = "bold 12px 'Space Mono', monospace";
    ctx.fillText(HUB.label + " · FINKENWERDER", hub.x + 12, hub.y - 8);

    var target = probe.on || performance.now() < probe.until ? 1 : 0;
    probe.alpha += (target - probe.alpha) * 0.15;
    drawProbe(hub);
  }

  function step() {
    t += 16;
    drawFrame();
    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (running || prefersReducedMotion) return;
    running = true;
    rafId = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* ---------- Init ---------- */
  resize();
  window.addEventListener("resize", function () {
    resize();
    if (!running) drawFrame();
  });

  if (prefersReducedMotion) {
    drawFrame(); // single static frame
    return;
  }

  /* Pointer: hover with a mouse, tap with a finger */
  var heroEl = document.querySelector("[data-hero]") || canvas.parentElement;
  function aim(e) {
    var r = canvas.getBoundingClientRect();
    probe.tx = e.clientX - r.left;
    probe.ty = e.clientY - r.top;
    if (probe.alpha < 0.05) { probe.x = probe.tx; probe.y = probe.ty; }
  }
  heroEl.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    aim(e);
    probe.on = true;
  }, { passive: true });
  heroEl.addEventListener("pointerleave", function () { probe.on = false; });
  heroEl.addEventListener("pointerdown", function (e) {
    if (e.target.closest("a, button")) return;
    aim(e);
    probe.until = performance.now() + 2600;
  }, { passive: true });

  /* Pause when the tab is hidden */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stop(); } else { start(); }
  });

  /* Pause when the hero scrolls out of view */
  var hero = document.querySelector("[data-hero]");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { start(); } else { stop(); }
      });
    }, { threshold: 0.05 }).observe(hero);
  } else {
    start();
  }
})();
