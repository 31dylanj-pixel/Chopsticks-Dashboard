/* ==========================================================
   Chopsticks Hub - Three.js ocean (v3.2 rewrite)
   - data-scene="home"   : camera dives from the surface to the abyss as you scroll
   - otherwise (ambient) : calm shallow water behind the page
   Everything is procedural (no image files). Disabled by
   Settings -> Animated background, and the page falls back to the
   CSS gradient when WebGL or the CDN is unavailable.
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
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "default" });
    } catch (error) {
        canvas.remove();
        return;
    }
    document.body.classList.add("has-ocean");

    let dead = false;
    canvas.addEventListener("webglcontextlost", event => {
        event.preventDefault();
        dead = true;
        canvas.remove();
        document.body.classList.remove("has-ocean");
    });

    const HOME = mode === "home";
    const DEPTH = HOME ? 70 : 14;
    const MAX_METERS = 3000;
    const SURFACE_Y = 6;
    const FLOOR_Y = -DEPTH - 7;

    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    const fogColor = new THREE.Color();
    scene.fog = new THREE.FogExp2(fogColor, 0.03);
    scene.background = fogColor;

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 260);
    camera.position.set(0, 0, 8);

    const timeU = { value: 0 };

    /* ---------- lights ---------- */
    const hemi = new THREE.HemisphereLight(0x9fdcff, 0x0a2233, 0.9);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xdff6ff, 1.1);
    sun.position.set(6, 30, 12);
    scene.add(sun);
    const lamp = new THREE.PointLight(0x9fe8ff, 0, 0, 2);
    scene.add(lamp);

    /* ---------- theme palette ---------- */
    const palette = {
        dark:  { top: new THREE.Color(0x0b5f8f), bottom: new THREE.Color(0x010409) },
        light: { top: new THREE.Color(0x7fd0f0), bottom: new THREE.Color(0x1d6ea3) }
    };
    let colors = palette.dark;
    const readTheme = () => {
        colors = document.documentElement.classList.contains("light-theme") ? palette.light : palette.dark;
    };
    readTheme();
    document.addEventListener("themechange", readTheme);

    /* ---------- small helpers ---------- */
    function spriteTexture(draw, w = 64, h = 64) {
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        draw(c.getContext("2d"), w, h);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }
    const rand = (a, b) => a + Math.random() * (b - a);
    const smoothstep = t => t * t * (3 - 2 * t);

    /* ---------- water backdrop (light from above, dark below) ---------- */
    const backdropMat = new THREE.ShaderMaterial({
        uniforms: {
            uTop: { value: new THREE.Color() },
            uBottom: { value: new THREE.Color() },
            uGlowCol: { value: new THREE.Color(0xbfeeff) },
            uGlow: { value: 1 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
        fragmentShader: `
            uniform vec3 uTop; uniform vec3 uBottom; uniform vec3 uGlowCol; uniform float uGlow;
            varying vec2 vUv;
            void main() {
                float g = smoothstep(0.0, 1.0, vUv.y);
                vec3 c = mix(uBottom, uTop, pow(g, 1.4));
                float d = distance(vUv * vec2(1.4, 1.0), vec2(0.7, 1.08));
                c += uGlowCol * uGlow * smoothstep(0.85, 0.0, d) * 0.28;
                gl_FragColor = vec4(c, 1.0);
                #include <colorspace_fragment>
            }`,
        depthWrite: false, depthTest: false, fog: false
    });
    const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), backdropMat);
    backdrop.scale.set(300, 180, 1);
    backdrop.renderOrder = -10;
    backdrop.frustumCulled = false;
    scene.add(backdrop);

    /* ---------- rippling surface seen from below ---------- */
    const surfaceMat = new THREE.ShaderMaterial({
        uniforms: { uTime: timeU, uOpacity: { value: 1 }, uColor: { value: new THREE.Color(0xd8f6ff) } },
        vertexShader: `
            varying vec3 vW;
            void main() {
                vec4 w = modelMatrix * vec4(position, 1.0);
                vW = w.xyz;
                gl_Position = projectionMatrix * viewMatrix * w;
            }`,
        fragmentShader: `
            uniform float uTime; uniform float uOpacity; uniform vec3 uColor;
            varying vec3 vW;
            float ripple(vec2 p) {
                float v = sin(p.x * 0.9 + uTime * 0.8) * sin(p.y * 0.7 - uTime * 0.6);
                v += 0.5 * sin(p.x * 1.7 - uTime * 1.1 + p.y * 0.8);
                v += 0.35 * sin(p.y * 2.3 + uTime * 1.3 - p.x * 0.5);
                return v;
            }
            void main() {
                vec2 p = vW.xz * 0.55;
                float r = 0.5 * ripple(p) + 0.5 * ripple(p * 1.7 + vec2(5.0, 3.0));
                float lines = pow(max(0.0, 1.0 - abs(r) * 0.6), 6.0);
                float dist = length(vW - cameraPosition);
                float fade = exp(-dist * 0.028) * smoothstep(120.0, 20.0, dist);
                float a = uOpacity * fade * (0.18 + 0.82 * lines);
                gl_FragColor = vec4(uColor, a);
                #include <colorspace_fragment>
            }`,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide, fog: false
    });
    const surface = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), surfaceMat);
    surface.rotation.x = Math.PI / 2;
    surface.position.set(0, SURFACE_Y, -60);
    surface.frustumCulled = false;
    scene.add(surface);

    /* ---------- soft god rays ---------- */
    const rayTexture = spriteTexture((g, w, h) => {
        const hg = g.createLinearGradient(0, 0, w, 0);
        hg.addColorStop(0, "rgba(255,255,255,0)");
        hg.addColorStop(0.5, "rgba(255,255,255,1)");
        hg.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = hg; g.fillRect(0, 0, w, h);
        g.globalCompositeOperation = "destination-in";
        const vg = g.createLinearGradient(0, 0, 0, h);
        vg.addColorStop(0, "rgba(255,255,255,1)");
        vg.addColorStop(0.55, "rgba(255,255,255,0.35)");
        vg.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = vg; g.fillRect(0, 0, w, h);
    }, 64, 256);

    const rays = [];
    for (let i = 0; i < 7; i++) {
        const mat = new THREE.MeshBasicMaterial({
            map: rayTexture, color: 0xcff1ff, transparent: true, opacity: 0.05,
            depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false
        });
        const w = rand(5, 11);
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 70), mat);
        m.userData = { x: -34 + i * 11 + rand(-3, 3), ph: rand(0, 6.28), base: rand(0.7, 1) };
        m.position.z = -rand(14, 30);
        m.rotation.z = -0.22 + rand(-0.05, 0.05);
        scene.add(m);
        rays.push(m);
    }

    /* ---------- marine snow + bubbles (kept in a box that follows the camera) ---------- */
    const BOX = { x: 24, y: 15, zNear: 10, zFar: 30 };
    const rig = new THREE.Group();
    scene.add(rig);

    const snowTex = spriteTexture(g => {
        const grad = g.createRadialGradient(32, 32, 0, 32, 32, 30);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
    });
    const bubbleTex = spriteTexture(g => {
        const grad = g.createRadialGradient(32, 32, 6, 32, 32, 30);
        grad.addColorStop(0, "rgba(210,240,255,0)");
        grad.addColorStop(0.72, "rgba(210,240,255,0.10)");
        grad.addColorStop(0.9, "rgba(235,250,255,0.75)");
        grad.addColorStop(1, "rgba(235,250,255,0)");
        g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
        g.fillStyle = "rgba(255,255,255,0.9)";
        g.beginPath(); g.ellipse(23, 22, 5, 3, -0.7, 0, Math.PI * 2); g.fill();
    });

    function makeCloud(count, texture, size, opacity) {
        const pos = new Float32Array(count * 3);
        const data = [];
        for (let i = 0; i < count; i++) {
            pos[i * 3]     = rand(-BOX.x, BOX.x);
            pos[i * 3 + 1] = rand(-BOX.y, BOX.y);
            pos[i * 3 + 2] = rand(-BOX.zFar, BOX.zNear);
            data.push({ v: rand(0.4, 1), ph: rand(0, 6.28) });
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const pts = new THREE.Points(geo, new THREE.PointsMaterial({
            map: texture, size, sizeAttenuation: true, transparent: true,
            opacity, depthWrite: false, color: 0xffffff
        }));
        pts.frustumCulled = false;
        rig.add(pts);
        return { pts, pos, data, count };
    }
    const snow = makeCloud(HOME ? 900 : 260, snowTex, 0.16, 0.5);
    const bubbles = makeCloud(HOME ? 50 : 22, bubbleTex, 0.5, 0.75);

    function stepCloud(cloud, dt, riseSpeed, wobble) {
        const p = cloud.pos;
        for (let i = 0; i < cloud.count; i++) {
            const d = cloud.data[i];
            let y = p[i * 3 + 1] + riseSpeed * d.v * dt;
            if (y > BOX.y) y -= BOX.y * 2;
            if (y < -BOX.y) y += BOX.y * 2;
            p[i * 3 + 1] = y;
            p[i * 3] += Math.sin(timeU.value * 0.6 + d.ph) * wobble * dt;
        }
        cloud.pts.geometry.attributes.position.needsUpdate = true;
    }

    /* ---------- fish ---------- */
    function mergeGeometries(list) {
        const geos = list.map(g => (g.index ? g.toNonIndexed() : g));
        let total = 0;
        geos.forEach(g => total += g.attributes.position.count);
        const pos = new Float32Array(total * 3), nor = new Float32Array(total * 3), col = new Float32Array(total * 3);
        let o = 0;
        geos.forEach(g => {
            pos.set(g.attributes.position.array, o * 3);
            nor.set(g.attributes.normal.array, o * 3);
            col.set(g.attributes.color.array, o * 3);
            o += g.attributes.position.count;
        });
        const out = new THREE.BufferGeometry();
        out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
        out.setAttribute("color", new THREE.BufferAttribute(col, 3));
        return out;
    }

    function paint(geo, fn) {
        const p = geo.attributes.position;
        const arr = new Float32Array(p.count * 3);
        const c = new THREE.Color();
        for (let i = 0; i < p.count; i++) {
            fn(c, p.getX(i), p.getY(i), p.getZ(i));
            arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b;
        }
        geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
        return geo;
    }

    /* A fish with a tapered body, forked tail, dorsal and side fins.
       Nose points to +x. Dark back, pale belly (countershading). */
    function buildFishGeometry(hex) {
        const base = new THREE.Color(hex);
        const back = base.clone().multiplyScalar(0.5);
        const belly = base.clone().lerp(new THREE.Color(0xffffff), 0.6);
        const fin = base.clone().multiplyScalar(0.8);

        const body = new THREE.SphereGeometry(1, 28, 18);
        const bp = body.attributes.position;
        for (let i = 0; i < bp.count; i++) {
            const x = bp.getX(i), y = bp.getY(i), z = bp.getZ(i);
            const t = (x + 1) / 2;
            const k = 0.38 + 0.62 * Math.pow(t, 0.7);
            bp.setXYZ(i, x, y * 0.46 * k, z * 0.2 * k);
        }
        body.computeVertexNormals();
        paint(body, (c, x, y) => {
            const w = smoothstep(Math.min(Math.max((y / 0.35 + 0.3) / 0.8, 0), 1));
            c.copy(belly).lerp(back, w);
        });

        const tailShape = new THREE.Shape();
        tailShape.moveTo(0, 0.05);
        tailShape.lineTo(-0.75, 0.55);
        tailShape.quadraticCurveTo(-0.5, 0, -0.75, -0.55);
        tailShape.lineTo(0, -0.05);
        tailShape.closePath();
        const tail = new THREE.ShapeGeometry(tailShape);
        tail.translate(-0.92, 0, 0);
        paint(tail, c => c.copy(fin));

        const dorsalShape = new THREE.Shape();
        dorsalShape.moveTo(0.35, 0);
        dorsalShape.quadraticCurveTo(0.05, 0.1, -0.2, 0.52);
        dorsalShape.lineTo(-0.5, 0);
        dorsalShape.closePath();
        const dorsal = new THREE.ShapeGeometry(dorsalShape);
        dorsal.translate(0, 0.27, 0);
        paint(dorsal, c => c.copy(fin));

        const pecShape = new THREE.Shape();
        pecShape.moveTo(0, 0);
        pecShape.lineTo(-0.38, -0.2);
        pecShape.lineTo(-0.05, 0.03);
        pecShape.closePath();
        const pecL = new THREE.ShapeGeometry(pecShape);
        pecL.rotateX(Math.PI / 2);
        pecL.translate(0.35, -0.12, 0.1);
        paint(pecL, c => c.copy(fin));
        const pecR = pecL.clone();
        pecR.scale(1, 1, -1);

        return mergeGeometries([body, tail, dorsal, pecL, pecR]);
    }

    const dummy = new THREE.Object3D();
    dummy.rotation.order = "YZX";

    function makeSchool({ color, count, cx, cy, cz, rx, rz, scale, speed = 1 }) {
        const geo = buildFishGeometry(color);
        const phase = new Float32Array(count);
        const fish = [];
        for (let i = 0; i < count; i++) {
            phase[i] = rand(0, 6.28);
            fish.push({
                ph: rand(0, 6.28),
                sp: rand(0.11, 0.17) * speed,
                rx: rx * rand(0.75, 1.25),
                rz: rz * rand(0.75, 1.25),
                oy: rand(-2.2, 2.2),
                s: scale * rand(0.8, 1.2),
                dir: Math.random() < 0.15 ? -1 : 1
            });
        }
        geo.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 1));

        const mat = new THREE.MeshStandardMaterial({
            vertexColors: true, roughness: 0.38, metalness: 0.3, side: THREE.DoubleSide
        });
        mat.onBeforeCompile = shader => {
            shader.uniforms.uTime = timeU;
            shader.vertexShader = shader.vertexShader
                .replace("#include <common>", "#include <common>\nattribute float aPhase;\nuniform float uTime;")
                .replace("#include <begin_vertex>", `#include <begin_vertex>
                    float swimA = clamp((0.55 - transformed.x) / 2.2, 0.0, 1.0);
                    transformed.z += sin(uTime * 6.5 + aPhase - transformed.x * 3.0) * 0.22 * swimA * swimA;`);
        };
        const mesh = new THREE.InstancedMesh(geo, mat, count);
        mesh.frustumCulled = false;
        scene.add(mesh);
        return { mesh, fish, cx, cy, cz, seed: rand(0, 6.28) };
    }

    const schools = HOME
        ? [
            makeSchool({ color: 0xf0a23c, count: 18, cx: 0,  cy: -9,  cz: -9,  rx: 11, rz: 6, scale: 0.42 }),
            makeSchool({ color: 0xb9c8d4, count: 26, cx: 2,  cy: -24, cz: -10, rx: 12, rz: 7, scale: 0.4 }),
            makeSchool({ color: 0x4f7fc0, count: 10, cx: -2, cy: -40, cz: -10, rx: 10, rz: 7, scale: 0.85, speed: 0.8 }),
            makeSchool({ color: 0x7a5ca8, count: 8,  cx: 0,  cy: -55, cz: -9,  rx: 9,  rz: 6, scale: 0.95, speed: 0.7 })
        ]
        : [
            makeSchool({ color: 0xf0a23c, count: 10, cx: 0, cy: -2, cz: -12, rx: 12, rz: 6, scale: 0.4 }),
            makeSchool({ color: 0xb9c8d4, count: 14, cx: 0, cy: -8, cz: -14, rx: 12, rz: 7, scale: 0.38 })
        ];

    /* ---------- home only: seabed, rocks, kelp, chopsticks, leviathan ---------- */
    let chopsticks = null, leviathan = null;
    const eyes = [];

    const floorH = (x, z) =>
        Math.sin(x * 0.13) * Math.cos(z * 0.11) * 0.9 +
        Math.sin(x * 0.31 + z * 0.17) * 0.35 +
        Math.sin(z * 0.43 - x * 0.21) * 0.15;

    if (HOME) {
        /* seabed */
        const floorGeo = new THREE.PlaneGeometry(150, 100, 90, 60);
        floorGeo.rotateX(-Math.PI / 2);
        const fp = floorGeo.attributes.position;
        const fc = new Float32Array(fp.count * 3);
        const sand = new THREE.Color(0x6e6c58), silt = new THREE.Color(0x2b3a40), tint = new THREE.Color();
        for (let i = 0; i < fp.count; i++) {
            const x = fp.getX(i), z = fp.getZ(i);
            const h = floorH(x, z);
            fp.setY(i, h);
            tint.copy(silt).lerp(sand, Math.min(Math.max((h + 0.8) / 1.8, 0), 1));
            fc[i * 3] = tint.r; fc[i * 3 + 1] = tint.g; fc[i * 3 + 2] = tint.b;
        }
        floorGeo.setAttribute("color", new THREE.BufferAttribute(fc, 3));
        floorGeo.computeVertexNormals();
        const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }));
        floor.position.set(0, FLOOR_Y, -30);
        scene.add(floor);

        /* rocks: displaced icospheres, not floating polyhedra */
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x33454e, roughness: 0.95 });
        for (let i = 0; i < 24; i++) {
            const g = new THREE.IcosahedronGeometry(1, 2);
            const rp = g.attributes.position;
            const seed = rand(0, 100);
            for (let v = 0; v < rp.count; v++) {
                const x = rp.getX(v), y = rp.getY(v), z = rp.getZ(v);
                const n = 1 + 0.28 * Math.sin(x * 3.1 + seed) * Math.cos(y * 2.7 + seed * 1.3) + 0.15 * Math.sin(z * 5.3 + seed);
                rp.setXYZ(v, x * n, y * n, z * n);
            }
            g.computeVertexNormals();
            const r = new THREE.Mesh(g, rockMat);
            const x = rand(-28, 28), z = rand(-34, -2);
            const s = rand(0.8, 3.2);
            r.scale.set(s * rand(1, 1.6), s * rand(0.5, 0.9), s * rand(1, 1.4));
            r.position.set(x, FLOOR_Y + floorH(x, z + 30) - 0.2, z);
            r.rotation.y = rand(0, 6.28);
            scene.add(r);
        }

        /* kelp swaying in the current */
        const KELP = 90;
        const kelpGeo = new THREE.PlaneGeometry(0.55, 9, 1, 10);
        kelpGeo.translate(0, 4.5, 0);
        const kPhase = new Float32Array(KELP);
        const kelpMat = new THREE.MeshStandardMaterial({
            color: 0x2e5a3c, roughness: 0.8, side: THREE.DoubleSide, emissive: 0x06150c, emissiveIntensity: 0.6
        });
        kelpMat.onBeforeCompile = shader => {
            shader.uniforms.uTime = timeU;
            shader.vertexShader = shader.vertexShader
                .replace("#include <common>", "#include <common>\nattribute float aPhase;\nuniform float uTime;")
                .replace("#include <begin_vertex>", `#include <begin_vertex>
                    float kh = clamp(transformed.y / 9.0, 0.0, 1.0);
                    transformed.x += sin(uTime * 0.7 + aPhase + transformed.y * 0.45) * 0.7 * kh * kh;
                    transformed.z += cos(uTime * 0.5 + aPhase * 1.3 + transformed.y * 0.3) * 0.35 * kh * kh;`);
        };
        const kelp = new THREE.InstancedMesh(kelpGeo, kelpMat, KELP);
        const d = new THREE.Object3D();
        for (let i = 0; i < KELP; i++) {
            const cluster = Math.floor(i / 6);
            const cxk = ((cluster * 37) % 50) - 25, czk = -4 - ((cluster * 53) % 30);
            const x = cxk + rand(-1.5, 1.5), z = czk + rand(-1.5, 1.5);
            d.position.set(x, FLOOR_Y + floorH(x, z + 30) - 0.2, z);
            d.rotation.set(0, rand(0, 3.14), 0);
            d.scale.set(1, rand(0.55, 1.3), 1);
            d.updateMatrix();
            kelp.setMatrixAt(i, d.matrix);
            kPhase[i] = rand(0, 6.28);
        }
        kelpGeo.setAttribute("aPhase", new THREE.InstancedBufferAttribute(kPhase, 1));
        kelp.frustumCulled = false;
        scene.add(kelp);

        /* chopsticks near the surface */
        chopsticks = new THREE.Group();
        const wood = new THREE.MeshStandardMaterial({ color: 0xb9814a, roughness: 0.45, metalness: 0.05 });
        const lacquer = new THREE.MeshStandardMaterial({ color: 0x7d1d1d, roughness: 0.3, metalness: 0.2 });
        const stickGeo = new THREE.CylinderGeometry(0.15, 0.07, 11, 20);
        const bandGeo = new THREE.CylinderGeometry(0.157, 0.148, 1.8, 20);
        [[-0.55, 0.2], [0.55, -0.1]].forEach(([x, rz]) => {
            const stick = new THREE.Group();
            const s = new THREE.Mesh(stickGeo, wood);
            const b = new THREE.Mesh(bandGeo, lacquer);
            b.position.y = 4.4;
            stick.add(s, b);
            stick.position.x = x;
            stick.rotation.z = rz;
            chopsticks.add(stick);
        });
        scene.add(chopsticks);

        /* something large, far away in the dark */
        leviathan = new THREE.Group();
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x050d16, roughness: 0.9 });
        const lb = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), bodyMat);
        lb.scale.set(16, 5.5, 6);
        leviathan.add(lb);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff3b3b, transparent: true, opacity: 0, fog: false });
        [[9.4, 4.4], [12.2, 3.4]].forEach(([x, z]) => {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), eyeMat);
            eye.position.set(x, 1.4, z);
            eyes.push(eye);
            leviathan.add(eye);
        });
        leviathan.position.set(-6, FLOOR_Y + 5, -34);
        scene.add(leviathan);
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

    let progress = 0, smooth = 0;
    const tmp = new THREE.Color();
    const white = new THREE.Color(0xffffff);

    /* ---------- loop ---------- */
    let last = performance.now(), time = 0;
    function frame(now) {
        if (dead) return;
        requestAnimationFrame(frame);
        if (document.hidden) { last = now; return; }

        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (!reduced) time += dt;
        timeU.value = time;

        const max = document.documentElement.scrollHeight - innerHeight;
        progress = max > 0 ? Math.min(Math.max(scrollY / max, 0), 1) : 0;
        smooth += (progress - smooth) * (1 - Math.exp(-dt * 5));

        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;

        /* colour of the water */
        const depthMix = HOME ? smoothstep(Math.min(smooth * 1.05, 1)) : smooth * 0.3;
        tmp.copy(colors.top).lerp(colors.bottom, depthMix);
        fogColor.copy(tmp);
        scene.fog.density = HOME ? 0.024 + smooth * 0.02 : 0.03;

        /* camera */
        const camY = -smooth * DEPTH;
        const camX = HOME ? Math.sin(smooth * 7) * 1.6 + mouse.x * 0.9 : mouse.x * 0.6;
        camera.position.set(camX, camY - mouse.y * 0.4, 8);
        camera.lookAt(camX * 0.3, camY - (HOME ? 1.4 : 0.3), 0);

        /* backdrop follows the view */
        backdrop.position.set(camera.position.x, camY, -80);
        backdropMat.uniforms.uTop.value.copy(tmp).lerp(white, 0.2 * (1 - depthMix));
        backdropMat.uniforms.uBottom.value.copy(tmp).multiplyScalar(0.62);
        backdropMat.uniforms.uGlow.value = HOME ? Math.pow(1 - depthMix, 1.5) : 0.7;

        /* surface light fades as you sink */
        const surfVis = HOME ? Math.max(0, 1 - smooth * 3.5) : 0.9;
        surfaceMat.uniforms.uOpacity.value = surfVis * 0.9;
        surface.visible = surfVis > 0.01;

        /* lights */
        const dim = HOME ? smooth : 0.1;
        sun.intensity = 1.15 * (1 - dim * 0.8);
        hemi.intensity = 0.95 - dim * 0.5;
        lamp.position.set(camX, camY + 1, 12);
        lamp.intensity = HOME ? smoothstep(smooth) * 240 : 0;

        /* god rays: soft, swaying, gone below the sunlit zone */
        const rayVis = HOME ? Math.max(0, 1 - smooth * 3.2) : 0.8;
        rays.forEach((r, i) => {
            const u = r.userData;
            r.material.opacity = 0.075 * rayVis * u.base * (0.65 + 0.35 * Math.sin(time * 0.45 + u.ph));
            r.position.x = camera.position.x * 0.5 + u.x + Math.sin(time * 0.12 + u.ph) * 2;
            r.position.y = camY + 18;
            r.visible = rayVis > 0.01;
        });

        /* particles */
        rig.position.set(camera.position.x, camY, 0);
        if (!reduced) {
            stepCloud(snow, dt, -0.18, 0.12);
            stepCloud(bubbles, dt, 1.1, 0.35);
        }

        /* fish */
        schools.forEach(school => {
            school.fish.forEach((f, i) => {
                const t = time * f.sp * f.dir + f.ph;
                const sway = Math.sin(time * 0.11 + school.seed) * 3;
                const x = school.cx + sway + Math.cos(t) * f.rx;
                const z = school.cz + Math.sin(t) * f.rz;
                const y = school.cy + f.oy + Math.sin(time * 0.45 + f.ph * 2) * 0.7;
                const vx = -Math.sin(t) * f.rx * f.dir;
                const vz = Math.cos(t) * f.rz * f.dir;
                dummy.position.set(x, y, z);
                dummy.rotation.set(0, Math.atan2(-vz, vx), Math.cos(time * 0.45 + f.ph * 2) * 0.1);
                dummy.scale.setScalar(f.s);
                dummy.updateMatrix();
                school.mesh.setMatrixAt(i, dummy.matrix);
            });
            school.mesh.instanceMatrix.needsUpdate = true;
        });

        if (HOME) {
            chopsticks.position.set(innerWidth > 900 ? 5.4 : 0, -smooth * 18 + Math.sin(time * 0.8) * 0.25, -3);
            chopsticks.rotation.y = time * 0.3 + smooth * 9;
            chopsticks.rotation.z = 0.5 + Math.sin(time * 0.5) * 0.04;
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
