/**
 * FloatingLines.js
 * Vanilla Three.js implementation of the shader-based background.
 * Ported from bg-ui.txt (React component).
 */

class FloatingLines {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.options = {
            enabledWaves: options.enabledWaves || ['top', 'middle', 'bottom'],
            lineCount: options.lineCount || 5, // Can be array [top, mid, bot]
            lineDistance: options.lineDistance || 5,
            animationSpeed: options.animationSpeed || 1,
            interactive: options.interactive !== undefined ? options.interactive : true,
            bendRadius: options.bendRadius || 5.0,
            bendStrength: options.bendStrength || -0.5,
            parallax: options.parallax !== undefined ? options.parallax : true,
            parallaxStrength: options.parallaxStrength || 0.2,
            linesGradient: options.linesGradient || ['#367D8A', '#133336', '#FFFFFF'], // Default Teal/White
            ...options
        };

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.camera.position.z = 1;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.targetMouse = new THREE.Vector2(-1000, -1000);
        this.currentMouse = new THREE.Vector2(-1000, -1000);
        this.bendInfluence = 0;
        this.targetInfluence = 0;
        this.parallaxOffset = new THREE.Vector2(0, 0);

        this.setupUniforms();
        this.setupMaterial();

        this.geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        window.addEventListener('resize', () => this.onResize());
        if (this.options.interactive) {
            window.addEventListener('pointermove', (e) => this.onPointerMove(e));
            window.addEventListener('pointerleave', () => this.onPointerLeave());
        }

        this.animate();
        setTimeout(() => this.onResize(), 100);
    }

    setupUniforms() {
        const hexToVec3 = (hex) => {
            const h = hex.replace('#', '');
            const r = parseInt(h.substring(0, 2), 16) / 255;
            const g = parseInt(h.substring(2, 4), 16) / 255;
            const b = parseInt(h.substring(4, 6), 16) / 255;
            return new THREE.Vector3(r, g, b);
        };

        const gradientVecs = this.options.linesGradient.map(hex => hexToVec3(hex));
        while (gradientVecs.length < 8) gradientVecs.push(new THREE.Vector3(1, 1, 1));

        this.uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector3(this.container.clientWidth, this.container.clientHeight, 1) },
            animationSpeed: { value: this.options.animationSpeed },
            enableTop: { value: this.options.enabledWaves.includes('top') },
            enableMiddle: { value: this.options.enabledWaves.includes('middle') },
            enableBottom: { value: this.options.enabledWaves.includes('bottom') },
            topLineCount: { value: Array.isArray(this.options.lineCount) ? this.options.lineCount[0] : this.options.lineCount },
            middleLineCount: { value: Array.isArray(this.options.lineCount) ? this.options.lineCount[1] : this.options.lineCount },
            bottomLineCount: { value: Array.isArray(this.options.lineCount) ? this.options.lineCount[2] : this.options.lineCount },
            topLineDistance: { value: (Array.isArray(this.options.lineDistance) ? this.options.lineDistance[0] : this.options.lineDistance) * 0.01 },
            middleLineDistance: { value: (Array.isArray(this.options.lineDistance) ? this.options.lineDistance[1] : this.options.lineDistance) * 0.01 },
            bottomLineDistance: { value: (Array.isArray(this.options.lineDistance) ? this.options.lineDistance[2] : this.options.lineDistance) * 0.01 },
            topWavePosition: { value: new THREE.Vector3(10.0, 0.5, -0.4) },
            middleWavePosition: { value: new THREE.Vector3(5.0, 0.0, 0.2) },
            bottomWavePosition: { value: new THREE.Vector3(2.0, -0.7, 0.4) },
            iMouse: { value: new THREE.Vector2(-1000, -1000) },
            interactive: { value: this.options.interactive },
            bendRadius: { value: this.options.bendRadius },
            bendStrength: { value: this.options.bendStrength },
            bendInfluence: { value: 0 },
            parallax: { value: this.options.parallax },
            parallaxStrength: { value: this.options.parallaxStrength },
            parallaxOffset: { value: new THREE.Vector2(0, 0) },
            lineGradient: { value: gradientVecs },
            lineGradientCount: { value: this.options.linesGradient.length }
        };
    }

    setupMaterial() {
        const vertexShader = `
            precision highp float;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            precision highp float;
            uniform float iTime;
            uniform vec3 iResolution;
            uniform float animationSpeed;
            uniform bool enableTop;
            uniform bool enableMiddle;
            uniform bool enableBottom;
            uniform int topLineCount;
            uniform int middleLineCount;
            uniform int bottomLineCount;
            uniform float topLineDistance;
            uniform float middleLineDistance;
            uniform float bottomLineDistance;
            uniform vec3 topWavePosition;
            uniform vec3 middleWavePosition;
            uniform vec3 bottomWavePosition;
            uniform vec2 iMouse;
            uniform bool interactive;
            uniform float bendRadius;
            uniform float bendStrength;
            uniform float bendInfluence;
            uniform bool parallax;
            uniform float parallaxStrength;
            uniform vec2 parallaxOffset;
            uniform vec3 lineGradient[8];
            uniform int lineGradientCount;

            mat2 rotate(float r) {
                return mat2(cos(r), sin(r), -sin(r), cos(r));
            }

            vec3 getLineColor(float t) {
                if (lineGradientCount <= 0) return vec3(1.0);
                if (lineGradientCount == 1) return lineGradient[0];
                float clampedT = clamp(t, 0.0, 0.9999);
                float scaled = clampedT * float(lineGradientCount - 1);
                int idx = int(floor(scaled));
                float f = fract(scaled);
                int idx2 = min(idx + 1, lineGradientCount - 1);
                
                vec3 c1 = vec3(1.0);
                vec3 c2 = vec3(1.0);
                
                if (idx == 0) c1 = lineGradient[0];
                else if (idx == 1) c1 = lineGradient[1];
                else if (idx == 2) c1 = lineGradient[2];
                else if (idx == 3) c1 = lineGradient[3];
                else if (idx == 4) c1 = lineGradient[4];
                else if (idx == 5) c1 = lineGradient[5];
                else if (idx == 6) c1 = lineGradient[6];
                else c1 = lineGradient[7];

                if (idx2 == 0) c2 = lineGradient[0];
                else if (idx2 == 1) c2 = lineGradient[1];
                else if (idx2 == 2) c2 = lineGradient[2];
                else if (idx2 == 3) c2 = lineGradient[3];
                else if (idx2 == 4) c2 = lineGradient[4];
                else if (idx2 == 5) c2 = lineGradient[5];
                else if (idx2 == 6) c2 = lineGradient[6];
                else c2 = lineGradient[7];

                return mix(c1, c2, f);
            }

            float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
                float time = iTime * animationSpeed;
                float x_offset = offset;
                float x_movement = time * 0.1;
                float amp = sin(offset + time * 0.2) * 0.3;
                float y = sin(uv.x + x_offset + x_movement) * amp;
                if (shouldBend) {
                    vec2 d = screenUv - mouseUv;
                    float influence = exp(-dot(d, d) * bendRadius);
                    y += (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
                }
                float m = uv.y - y;
                return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
            }

            void main() {
                vec2 fragCoord = gl_FragCoord.xy;
                vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
                baseUv.y *= -1.0;
                if (parallax) baseUv += parallaxOffset;
                vec2 mouseUv = vec2(0.0);
                if (interactive) {
                    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
                    mouseUv.y *= -1.0;
                }
                vec3 colSum = vec3(0.0);
                float weightSum = 0.0;
                
                if (enableBottom) {
                    for (int i = 0; i < 20; ++i) {
                        if (i < bottomLineCount) {
                            float fi = float(i);
                            float t = fi / max(float(bottomLineCount - 1), 1.0);
                            vec3 lineCol = getLineColor(t);
                            float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
                            vec2 ruv = baseUv * rotate(angle);
                            float w = wave(ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y), 1.5 + 0.2 * fi, baseUv, mouseUv, interactive) * 0.2;
                            colSum += lineCol * w;
                            weightSum += w;
                        }
                    }
                }
                if (enableMiddle) {
                    for (int i = 0; i < 20; ++i) {
                        if (i < middleLineCount) {
                            float fi = float(i);
                            float t = fi / max(float(middleLineCount - 1), 1.0);
                            vec3 lineCol = getLineColor(t);
                            float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
                            vec2 ruv = baseUv * rotate(angle);
                            float w = wave(ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y), 2.0 + 0.15 * fi, baseUv, mouseUv, interactive) * 0.2;
                            colSum += lineCol * w;
                            weightSum += w;
                        }
                    }
                }
                if (enableTop) {
                    for (int i = 0; i < 20; ++i) {
                        if (i < topLineCount) {
                            float fi = float(i);
                            float t = fi / max(float(topLineCount - 1), 1.0);
                            vec3 lineCol = getLineColor(t);
                            float angle = topWavePosition.z * log(length(baseUv) + 1.0);
                            vec2 ruv = baseUv * rotate(angle);
                            ruv.x *= -1.0;
                            float w = wave(ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y), 1.0 + 0.2 * fi, baseUv, mouseUv, interactive) * 0.1;
                            colSum += lineCol * w;
                            weightSum += w;
                        }
                    }
                }
                
                vec3 finalCol = weightSum > 0.0 ? colSum / weightSum : vec3(0.0);
                gl_FragColor = vec4(finalCol, min(weightSum * 5.0, 1.0));
            }
        `;

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader,
            fragmentShader,
            transparent: true,
            blending: THREE.NormalBlending
        });
    }

    onResize() {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        this.renderer.setSize(w, h);
        this.uniforms.iResolution.value.set(this.renderer.domElement.width, this.renderer.domElement.height, 1);
    }

    onPointerMove(e) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dpr = this.renderer.getPixelRatio();
        this.targetMouse.set(x * dpr, (rect.height - y) * dpr);
        this.targetInfluence = 1.0;

        if (this.options.parallax) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            this.parallaxOffset.set((x - centerX) / rect.width * this.options.parallaxStrength, -(y - centerY) / rect.height * this.options.parallaxStrength);
        }
    }

    onPointerLeave() {
        this.targetInfluence = 0.0;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.uniforms.iTime.value = this.clock.getElapsedTime();
        this.currentMouse.lerp(this.targetMouse, 0.05);
        this.uniforms.iMouse.value.copy(this.currentMouse);
        this.bendInfluence += (this.targetInfluence - this.bendInfluence) * 0.05;
        this.uniforms.bendInfluence.value = this.bendInfluence;
        this.uniforms.parallaxOffset.value.copy(this.parallaxOffset);
        this.renderer.render(this.scene, this.camera);
    }
}
