(function () {
    'use strict';

    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Offscreen canvas for the static MW nebula glow (drawn once per resize)
    const glowCanvas = document.createElement('canvas');
    const glowCtx    = glowCanvas.getContext('2d');

    let W, H, bgStars = [], mwStars = [], shots = [], raf, lastShot = 0;

    // ── Milky Way arc ─────────────────────────────────────────────────────
    // Parabola: peaks at top-centre, curves down to both sides
    function mwY(x) {
        const a = (H * 0.60) / Math.pow(W * 0.5, 2);
        return a * Math.pow(x - W * 0.5, 2) + H * 0.06;
    }

    // Colour along the arc: blue-white (centre) → blue → teal-green → warm orange (edges)
    function lerp3(a, b, t) {
        return [
            Math.round(a[0] + (b[0] - a[0]) * t),
            Math.round(a[1] + (b[1] - a[1]) * t),
            Math.round(a[2] + (b[2] - a[2]) * t),
        ];
    }

    function mwColour(x) {
        const t = Math.abs(x / W - 0.5) * 2; // 0 at centre, 1 at edges
        if (t < 0.25) return lerp3([230, 240, 255], [140, 170, 255], t / 0.25);
        if (t < 0.50) return lerp3([140, 170, 255], [ 70, 200, 160], (t - 0.25) / 0.25);
        if (t < 0.75) return lerp3([ 70, 200, 160], [120, 185,  70], (t - 0.50) / 0.25);
        return             lerp3([120, 185,  70], [255, 145,  35], (t - 0.75) / 0.25);
    }

    // ── Pre-render nebula glow to offscreen canvas ────────────────────────
    function buildGlow() {
        glowCanvas.width  = W;
        glowCanvas.height = H;
        glowCtx.clearRect(0, 0, W, H);

        const steps    = 28;
        const bandSize = H * 0.15;

        for (let i = 0; i <= steps; i++) {
            const t  = i / steps;
            const x  = t * W;
            const y  = mwY(x);
            const r  = bandSize * 1.8;
            // Brighter in the central arc
            const cx = Math.abs(t - 0.5) * 2;          // 0 at centre, 1 at edge
            const peak = 0.04 - cx * 0.022;
            const col = mwColour(x);

            const g = glowCtx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${peak.toFixed(3)})`);
            g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
            glowCtx.fillStyle = g;
            glowCtx.fillRect(0, 0, W, H);
        }

        // Extra bright core at galactic centre (top-centre)
        const cx = W * 0.5, cy = mwY(W * 0.5);
        const core = glowCtx.createRadialGradient(cx, cy, 0, cx, cy, H * 0.12);
        core.addColorStop(0, 'rgba(200,220,255,0.09)');
        core.addColorStop(1, 'rgba(200,220,255,0)');
        glowCtx.fillStyle = core;
        glowCtx.fillRect(0, 0, W, H);
    }

    // ── Build star arrays ─────────────────────────────────────────────────
    function buildStars() {
        bgStars = [];
        mwStars = [];

        // Sparse background: cool white/blue-white
        const bgN = Math.round((W * H) / 4200);
        for (let i = 0; i < bgN; i++) {
            const x = Math.random() * W;
            const y = Math.random() * H;
            bgStars.push({
                x, y,
                r:       Math.random() * 1.0 + 0.2,
                phase:   Math.random() * Math.PI * 2,
                freq:    Math.random() * 0.006 + 0.001,
                sparkle: Math.random() > 0.93,
                rgb:     [215 + Math.round(Math.random() * 40),
                          225 + Math.round(Math.random() * 30),
                          255],
            });
        }

        // Milky Way band: very dense, Gaussian spread around the arc
        const mwN     = Math.round((W * H) / 350);
        const bandwidth = H * 0.17;

        for (let i = 0; i < mwN; i++) {
            const x = Math.random() * W;

            // Box-Muller for Gaussian spread perpendicular to arc
            const u1 = Math.random(), u2 = Math.random();
            const g  = Math.sqrt(-2 * Math.log(u1 + 1e-9)) * Math.cos(2 * Math.PI * u2);
            const y  = mwY(x) + g * bandwidth * 0.42;

            if (y < 0 || y > H) continue;

            // Reject stars too far from band
            if (Math.abs(g) > 2.2) continue;

            const base = mwColour(x);
            const jitter = () => Math.round((Math.random() - 0.5) * 35);

            mwStars.push({
                x, y,
                r:       Math.random() * 1.1 + 0.15,
                phase:   Math.random() * Math.PI * 2,
                freq:    Math.random() * 0.008 + 0.001,
                sparkle: Math.random() > 0.97,
                rgb: [
                    Math.min(255, Math.max(0, base[0] + jitter())),
                    Math.min(255, Math.max(0, base[1] + jitter())),
                    Math.min(255, Math.max(0, base[2] + jitter())),
                ],
            });
        }
    }

    function resize() {
        W = canvas.width  = canvas.clientWidth;
        H = canvas.height = canvas.clientHeight;
        buildGlow();
        buildStars();
    }

    // ── Sparkle cross ─────────────────────────────────────────────────────
    function drawSparkle(x, y, r, a, rgb) {
        const arm  = r * 5;
        const diag = arm * 0.38;
        const [R, G, B] = rgb;
        ctx.save();
        ctx.globalAlpha = a * 0.6;
        ctx.strokeStyle = `rgb(${R},${G},${B})`;
        ctx.lineWidth   = 0.6;
        ctx.beginPath();
        ctx.moveTo(x - arm, y); ctx.lineTo(x + arm, y);
        ctx.moveTo(x, y - arm); ctx.lineTo(x, y + arm);
        ctx.stroke();
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(x - diag, y - diag); ctx.lineTo(x + diag, y + diag);
        ctx.moveTo(x + diag, y - diag); ctx.lineTo(x - diag, y + diag);
        ctx.stroke();
        ctx.restore();
    }

    // ── Render a star array ───────────────────────────────────────────────
    // No shadowBlur — replaced with two-circle glow (outer halo + inner core).
    // shadowBlur is the single most expensive canvas op; this is equivalent visually.
    function renderStars(arr) {
        for (const s of arr) {
            s.phase += s.freq;
            const a = Math.pow(Math.max(0, Math.sin(s.phase)), 2.2) * 0.92 + 0.04;
            const [R, G, B] = s.rgb;

            // Outer halo — only when bright enough to be worth drawing
            if (a > 0.45) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${R},${G},${B},${(a * 0.12).toFixed(3)})`;
                ctx.fill();
            }

            // Core dot
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${R},${G},${B},${a.toFixed(3)})`;
            ctx.fill();

            if (s.sparkle && a > 0.70) drawSparkle(s.x, s.y, s.r, a, s.rgb);
        }
    }

    // ── Shooting stars ────────────────────────────────────────────────────
    function spawnShot() {
        const palettes = ['255,255,255', '180,215,255', '255,195,90'];
        shots.push({
            x:   Math.random() * W * 0.55,
            y:   Math.random() * H * 0.35,
            vx:  Math.random() * 5 + 3,
            vy:  Math.random() * 2.5 + 1,
            len: Math.random() * 120 + 55,
            a:   1,
            c:   palettes[Math.floor(Math.random() * palettes.length)],
        });
    }

    // ── Main loop ─────────────────────────────────────────────────────────
    function draw(ts) {
        ctx.clearRect(0, 0, W, H);

        // Static nebula glow (pre-rendered, single drawImage)
        ctx.drawImage(glowCanvas, 0, 0);

        // Stars
        renderStars(bgStars);
        renderStars(mwStars);

        // Shooting stars
        if (ts - lastShot > 7500 + Math.random() * 7000) {
            spawnShot();
            lastShot = ts;
        }

        for (let i = shots.length - 1; i >= 0; i--) {
            const s = shots[i];
            s.x += s.vx; s.y += s.vy; s.a -= 0.01;
            if (s.a <= 0) { shots.splice(i, 1); continue; }

            const speed = Math.hypot(s.vx, s.vy);
            const tx = s.x - (s.vx / speed) * s.len;
            const ty = s.y - (s.vy / speed) * s.len;

            const gr = ctx.createLinearGradient(tx, ty, s.x, s.y);
            gr.addColorStop(0, `rgba(${s.c},0)`);
            gr.addColorStop(1, `rgba(${s.c},${s.a.toFixed(3)})`);
            ctx.beginPath();
            ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = gr;
            ctx.lineWidth   = 1.5;
            ctx.stroke();

            // Head: outer halo + bright core (no shadowBlur)
            ctx.beginPath();
            ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.c},${(s.a * 0.18).toFixed(3)})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.c},${s.a.toFixed(3)})`;
            ctx.fill();
        }

        raf = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(draw);
})();
