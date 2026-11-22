/* ==========================================================
   Chopsticks Hub - Three.js ocean
   - data-scene="home"   : camera dives from the surface to the abyss as you scroll
   - otherwise (ambient) : calm shallow water with bubbles behind the page
   Disabled by Settings -> Animated background, and falls back to the CSS
   gradient when WebGL or the CDN is unavailable.
========================================================== */
(async function () {

    if (localStorage.getItem("animatedBg") === "off") return;

    const mode = document.body.dataset.scene === "home" ? "home" : "ambient";
    const reduced =
        matchMedia("(prefers-reduced-motion: reduce)").matches ||
        localStorage.getItem("reduceMotion") === "on";

    let THREE;
    try {
        THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
    } catch (error) {
        console.warn("Three.js could not be loaded - using the plain background.", error);
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.id = "ocean-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "low-power" });
    } catch (error) {
        canvas.remove();
        return;
    }
    document.body.classList.add("has-ocean");

    const DEPTH = mode === "home" ? 70 : 14;
    const MAX_METERS = 3000;

    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));

    const scene = new THREE.Scene();
    const fogColor = new THREE.Color();
    scene.fog = new THREE.FogExp2(fogColor, 0.03);
    scene.background = fogColor;

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
    camera.position.set(0, 0, 8);

    /* ---------- lights ---------- */
    const hemi = new THREE.HemisphereLight(0xbfeaff, 0x04101c, 0.9);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(4, 30, 10);
    scene.add(sun);
    const lamp = new THREE.PointLight(0x7fe0ff, 0, 0, 2);
    scene.add(lamp);

    /* ---------- theme palette ---------- */
    const palette = {
        dark:  { top: new THREE.Color(0x0e6aa6), bottom: new THREE.Color(0x01050b) },
        light: { top: new THREE.Color(0xb4e7ff), bottom: new THREE.Color(0x2f86bd) }
    };
    let colors = palette.dark;
    const readTheme = () => {
        colors = document.documentElement.classList.contains("light-theme") ? palette.light : palette.dark;
    };
    readTheme();
    document.addEventListener("themechange", readTheme);

    /* ---------- bubbles ---------- */
    function bubbleTexture() {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const g = c.getContext("2d");
        const grad = g.createRadialGradient(26, 26, 2, 32, 32, 30);
        grad.addColorStop(0, "rgba(255,255,255,0.95)");
        grad.addColorStop(0.55, "rgba(190,235,255,0.25)");
        grad.addColorStop(0.9, "rgba(190,235,255,0.55)");
        grad.addColorStop(1, "rgba(190,235,255,0)");
        g.fillStyle = grad;
        g.beginPath(); g.arc(32, 32, 30, 0, Math.PI * 2); g.fill();
        return new THREE.CanvasTexture(c);
    }

    const BUBBLES = mode === "home" ? 650 : 160;
    const bubblePos = new Float32Array(BUBBLES * 3);
    const bubbleSpeed = new Float32Array(BUBBLES);
    const yTop = 12, yBottom = -DEPTH - 14;
    for (let i = 0; i < BUBBLES; i++) {
        bubblePos[i * 3]     = (Math.random() - 0.5) * 46;
        bubblePos[i * 3 + 1] = yBottom + Math.random() * (yTop - yBottom);
        bubblePos[i * 3 + 2] = -28 + Math.random() * 34;
        bubbleSpeed[i] = 0.5 + Math.random() * 1.4;
    }
    const bubbleGeo = new THREE.BufferGeometry();
    bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePos, 3));
    const bubbles = new THREE.Points(bubbleGeo, new THREE.PointsMaterial({
        map: bubbleTexture(), size: 0.42, sizeAttenuation: true,
        transparent: true, opacity: 0.8, depthWrite: false, color: 0xffffff
    }));
    bubbles.frustumCulled = false;
    scene.add(bubbles);

    /* ---------- sunlight shafts (near the surface) ---------- */
    const rays = [];
    for (let i = 0; i < 7; i++) {
        const mat = new THREE.MeshBasicMaterial({
            color: 0xcff1ff, transparent: true, opacity: 0.08,
            depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
        });
        const m = new THREE.Mesh(new THREE.PlaneGeometry(1.6 + Math.random() * 2.2, 60), mat);
        m.position.set(-18 + i * 6 + Math.random() * 3, -6, -12 - Math.random() * 10);
        m.rotation.z = -0.28 + Math.random() * 0.1;
        scene.add(m);
        rays.push(m);
    }

    /* ---------- fish schools ---------- */
    const bodyGeo = new THREE.SphereGeometry(0.5, 12, 8);
    bodyGeo.scale(1.7, 0.72, 0.42);
    const tailGeo = new THREE.ConeGeometry(0.32, 0.65, 4);
    tailGeo.rotateZ(Math.PI / 2);
    tailGeo.translate(-0.95, 0, 0);
    tailGeo.scale(1, 1, 0.35);

    function makeSchool(colorHex, count, cx, cy, cz, rx, rz, scale) {
        const mat = new THREE.MeshStandardMaterial({
            color: colorHex, roughness: 0.45, metalness: 0.1,
            emissive: colorHex, emissiveIntensity: 0.22
        });
        const fish = [];
        for (let i = 0; i < count; i++) {
            const g = new THREE.Group();
            g.add(new THREE.Mesh(bodyGeo, mat), new THREE.Mesh(tailGeo, mat));
            const s = scale * (0.75 + Math.random() * 0.5);
            g.scale.setScalar(s);
            g.userData = {
                ph: Math.random() * Math.PI * 2,
                sp: 0.22 + Math.random() * 0.12,
                rx: rx * (0.7 + Math.random() * 0.6),
                rz: rz * (0.7 + Math.random() * 0.6),
                oy: (Math.random() - 0.5) * 3.2,
                dir: 1
            };
            scene.add(g);
            fish.push(g);
        }
        return { fish, cx, cy, cz };
    }

    const schools = mode === "home"
        ? [
            makeSchool(0xff9a4d, 16, 0, -9, -8, 10, 6, 0.85),
            makeSchool(0x4de1ff, 18, 0, -23, -9, 11, 7, 0.8),
            makeSchool(0xb57bff, 14, 0, -38, -10, 10, 7, 1.0),
            makeSchool(0xffe26a, 12, 0, -53, -9, 9, 6, 1.1)
        ]
        : [
            makeSchool(0xff9a4d, 9, 0, -2, -12, 12, 6, 0.8),
            makeSchool(0x4de1ff, 8, 0, -9, -14, 12, 7, 0.9)
        ];

    /* ---------- home only: chopsticks, leviathan, seabed ---------- */
    let chopsticks = null, leviathan = null, eyes = [];
    if (mode === "home") {
        chopsticks = new THREE.Group();
        const wood = new THREE.MeshStandardMaterial({ color: 0xe0a35e, roughness: 0.5, metalness: 0.05, emissive: 0x2a1604, emissiveIntensity: 0.6 });
        const stickGeo = new THREE.CylinderGeometry(0.07, 0.16, 11, 24);
        const a = new THREE.Mesh(stickGeo, wood);
        const b = new THREE.Mesh(stickGeo, wood);
        a.rotation.z = 0.2; a.position.x = -0.55;
        b.rotation.z = -0.1; b.position.x = 0.55;
        chopsticks.add(a, b);
        scene.add(chopsticks);

        leviathan = new THREE.Group();
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x04101c, roughness: 0.9 });
        const body = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), bodyMat);
        body.scale.set(16, 5.5, 6);
        leviathan.add(body);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff3b3b, transparent: true, opacity: 0, fog: false });
        [[9.4, 4.4], [12.2, 3.4]].forEach(([x, z]) => {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), eyeMat);
            eye.position.set(x, 1.4, z);
            eyes.push(eye);
            leviathan.add(eye);
        });
        leviathan.position.set(-6, -DEPTH - 2, -30);
        scene.add(leviathan);

        const rockMat = new THREE.MeshStandardMaterial({ color: 0x0b2b3d, roughness: 1, flatShading: true });
        for (let i = 0; i < 30; i++) {
            const r = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), rockMat);
            r.position.set((Math.random() - 0.5) * 50, -DEPTH - 9 + Math.random() * 2, -4 - Math.random() * 30);
            r.scale.set(1 + Math.random() * 3, 0.8 + Math.random() * 3, 1 + Math.random() * 3);
            r.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
            scene.add(r);
        }
    }

    /* ---------- sizing ---------- */
    function resize() {
        const w = innerWidth, h = innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resize();
    addEventListener("resize", resize);

    /* ---------- input ---------- */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    addEventListener("pointermove", e => {
        mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
        mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });

    const meter = document.querySelector(".depth-meter b");
    const meterFill = document.querySelector(".depth-fill");

    const smoothstep = t => t * t * (3 - 2 * t);
    let progress = 0, smooth = 0;
    const tmp = new THREE.Color();

    /* ---------- loop ---------- */
    let last = performance.now(), time = 0;
    function frame(now) {
        requestAnimationFrame(frame);
        if (document.hidden) { last = now; return; }

        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (!reduced) time += dt;

        const max = document.documentElement.scrollHeight - innerHeight;
        progress = max > 0 ? Math.min(Math.max(scrollY / max, 0), 1) : 0;
        smooth += (progress - smooth) * (1 - Math.exp(-dt * 5));

        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;

        /* colour of the water */
        const depthMix = mode === "home" ? smoothstep(Math.min(smooth * 1.05, 1)) : smooth * 0.3;
        tmp.copy(colors.top).lerp(colors.bottom, depthMix);
        fogColor.copy(tmp);
        scene.fog.density = mode === "home" ? 0.026 + smooth * 0.016 : 0.032;

        /* camera */
        const camY = -smooth * DEPTH;
        const camX = mode === "home" ? Math.sin(smooth * 7) * 1.6 + mouse.x * 0.9 : mouse.x * 0.6;
        camera.position.set(camX, camY - mouse.y * 0.4, 8);
        camera.lookAt(camX * 0.3, camY - (mode === "home" ? 1.4 : 0.3), 0);

        /* lights */
        const dim = mode === "home" ? smooth : 0.1;
        sun.intensity = 1.25 * (1 - dim * 0.75);
        hemi.intensity = 0.95 - dim * 0.45;
        lamp.position.set(camX, camY + 1, 12);
        lamp.intensity = mode === "home" ? smoothstep(smooth) * 260 : 0;

        /* shafts fade out with depth */
        const rayOpacity = Math.max(0, 0.1 * (1 - smooth * 3));
        rays.forEach((r, i) => {
            r.material.opacity = rayOpacity * (0.6 + 0.4 * Math.sin(time * 0.5 + i * 1.7));
            r.position.y = camY + 4;
        });

        /* bubbles */
        const p = bubbleGeo.attributes.position;
        for (let i = 0; i < BUBBLES; i++) {
            let y = p.array[i * 3 + 1] + bubbleSpeed[i] * dt * 1.2 * (reduced ? 0 : 1);
            if (y > yTop) y = yBottom;
            p.array[i * 3 + 1] = y;
            p.array[i * 3] += Math.sin(time * 0.8 + i) * 0.002;
        }
        p.needsUpdate = true;

        /* fish */
        schools.forEach((school, si) => {
            school.fish.forEach(f => {
                const d = f.userData;
                const t = time * d.sp * d.dir + d.ph;
                const x = school.cx + Math.cos(t) * d.rx;
                const z = school.cz + Math.sin(t) * d.rz;
                f.position.set(x, school.cy + d.oy + Math.sin(time * 0.9 + d.ph) * 0.5, z);
                const vx = -Math.sin(t) * d.rx * d.dir;
                const vz = Math.cos(t) * d.rz * d.dir;
                f.rotation.y = Math.atan2(-vz, vx);
                f.children[1].rotation.y = Math.sin(time * 7 + d.ph * 4) * 0.45;
            });
        });

        if (mode === "home") {
            chopsticks.position.set(innerWidth > 900 ? 5.2 : 0, -smooth * 18 + Math.sin(time * 0.8) * 0.3, -3);
            chopsticks.rotation.y = time * 0.35 + smooth * 9;
            chopsticks.rotation.z = 0.5 + Math.sin(time * 0.5) * 0.05;
            chopsticks.rotation.x = smooth * 2;
            chopsticks.visible = smooth < 0.4;

            leviathan.position.x = -6 + Math.sin(time * 0.1) * 5;
            const eyeGlow = smoothstep(Math.max(0, (smooth - 0.78) / 0.2));
            eyes.forEach(e => e.material.opacity = eyeGlow * (0.75 + 0.25 * Math.sin(time * 2)));
        }

        /* depth readout */
        if (meter) {
            meter.textContent = `${Math.round(smooth * MAX_METERS).toLocaleString()} m`;
            meterFill.style.height = `${smooth * 100}%`;
        }

        renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);

})();
