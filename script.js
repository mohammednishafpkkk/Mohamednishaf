(function() {
    // 1. Fast Shutter Preloader
    var pre = document.getElementById('preloader');
    var num = document.getElementById('num');
    var bar = document.getElementById('bar');
    var p = 0;

    function openSite() {
        if (pre) pre.classList.add('done');
    }

    var timer = setInterval(function() {
        p += 25;
        if (p >= 100) {
            p = 100;
            clearInterval(timer);
            setTimeout(openSite, 100);
        }
        if (num) num.textContent = p;
        if (bar) bar.style.width = p + '%';
    }, 45);
    setTimeout(openSite, 900);

    // 2. Interactive 2D Physics Canvas (Runs on index.html)
    var canvas = document.getElementById('canvas');
    var hero = document.getElementById('hero');
    if (canvas && hero && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var w = 0, h = 0, shapes = [];
        var ptr = { x: -999, y: -999, r: 85 };

        function resize() {
            w = canvas.width = hero.clientWidth || window.innerWidth;
            h = canvas.height = hero.clientHeight || window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        var cols = ['#d4ff33', '#38bdf8', '#f3f3f1', '#a855f7'];
        for (var i = 0; i < 14; i++) {
            var r = Math.random() * 22 + 20;
            shapes.push({
                x: Math.random() * (w - r * 2) + r,
                y: Math.random() * (h - r * 2) + r,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                r: r, a: Math.random() * 6,
                va: (Math.random() - 0.5) * 0.02,
                c: cols[i % cols.length],
                t: i % 3, s: i % 2 === 0
            });
        }

        function movePtr(cx, cy) {
            var rect = canvas.getBoundingClientRect();
            ptr.x = cx - rect.left;
            ptr.y = cy - rect.top;
        }
        canvas.addEventListener('mousemove', function(e) { movePtr(e.clientX, e.clientY); });
        canvas.addEventListener('touchmove', function(e) {
            if (e.touches[0]) movePtr(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });

        function loop() {
            ctx.clearRect(0, 0, w, h);
            for (var i = 0; i < shapes.length; i++) {
                var s = shapes[i];
                s.x += s.vx; s.y += s.vy; s.a += s.va;
                if (s.x < s.r || s.x > w - s.r) s.vx *= -1;
                if (s.y < s.r || s.y > h - s.r) s.vy *= -1;

                var dx = s.x - ptr.x, dy = s.y - ptr.y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < s.r + ptr.r && d > 1) {
                    s.vx += (dx / d) * 1.1;
                    s.vy += (dy / d) * 1.1;
                }
                s.vx *= 0.99; s.vy *= 0.99;

                ctx.save();
                ctx.translate(s.x, s.y);
                ctx.rotate(s.a);
                ctx.lineWidth = 2;
                ctx.strokeStyle = s.c;
                ctx.fillStyle = s.c;
                if (s.t === 0) {
                    ctx.beginPath(); ctx.arc(0, 0, s.r, 0, Math.PI * 2);
                    s.s ? ctx.stroke() : ctx.fill();
                } else if (s.t === 1) {
                    s.s ? ctx.strokeRect(-s.r, -s.r, s.r * 2, s.r * 2) : ctx.fillRect(-s.r, -s.r, s.r * 2, s.r * 2);
                } else {
                    s.s ? ctx.strokeRect(-s.r * 1.4, -s.r * 0.5, s.r * 2.8, s.r) : ctx.fillRect(-s.r * 1.4, -s.r * 0.5, s.r * 2.8, s.r);
                }
                ctx.restore();
            }
            requestAnimationFrame(loop);
        }
        loop();
    }
})();
