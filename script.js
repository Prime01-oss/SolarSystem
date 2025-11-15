// scripts.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

"use strict";

const SolarSystem3D = {
    // --- Configuration ---
    texturePath: 'assets/textures/',
    
    // Upgraded dataset with real physics data
    planetData: {
        sun: {
            title: "The Sun",
            description: "The star at the center of our Solar System. Its energy is the source of all life on Earth.",
            diameter: "1,392,684 km", mass: "1.989 × 10^30 kg", period: "27 Earth days (equator)", distance: "0 AU",
            radius: 10,
            texture: 'sun.jpg',
            isLight: true,
            atmosphereColor: 0xffffee, 
            atmosphereScale: 50.5      
        },
        mercury: {
            title: "Mercury",
            description: "The smallest planet in our solar system and nearest to the Sun.",
            diameter: "4,879 km", mass: "3.285 × 10^23 kg", period: "88 Earth days", distance: "0.39 AU",
            radius: 0.38,
            texture: 'mercury.jpg',
            bumpTexture: 'mercury_bump.jpg', bumpScale: 0.01,
            orbitalRadius: 20,
            eccentricity: 0.205,
            orbitalPeriod: 0.01,
            rotationSpeed: 0.01,
            axialTilt: 0.03,
            orbitalInclination: 7.00
        },
        venus: {
            title: "Venus",
            description: "The second planet from the Sun, known for its thick, toxic atmosphere.",
            diameter: "12,104 km", mass: "4.867 × 10^24 kg", period: "225 Earth days", distance: "0.72 AU",
            radius: 0.95,
            texture: 'venus.jpg',
            bumpTexture: 'venus_bump.jpg', bumpScale: 0.01,
            cloudTexture: 'venus_clouds.jpg',
            atmosphereColor: 0xffa500,
            orbitalRadius: 30,
            eccentricity: 0.007,
            orbitalPeriod: 0.005,
            rotationSpeed: 0.008,
            axialTilt: 177.4,
            orbitalInclination: 3.39
        },
        earth: {
            title: "Earth",
            description: "Our home planet, the only place known to harbor life.",
            diameter: "12,742 km", mass: "5.972 × 10^24 kg", period: "365 Earth days", distance: "1 AU",
            radius: 1,
            texture: 'earth.jpg',
            nightTexture: 'earth_night.jpg',
            bumpTexture: 'earth_bump.jpg', bumpScale: 0.05,
            specularTexture: 'earth_specular.png',
            cloudTexture: 'earth_clouds.png',
            atmosphereColor: 0x4d96ff,
            orbitalRadius: 45,
            eccentricity: 0.017,
            orbitalPeriod: 0.003,
            rotationSpeed: 0.01,
            axialTilt: 23.44,
            orbitalInclination: 0.00
        },
        moon: {
            title: "The Moon",
            description: "Earth's only natural satellite.",
            diameter: "3,474 km", mass: "7.342 × 10^22 kg", period: "27 Earth days", distance: "0.00257 AU (from Earth)",
            radius: 0.27,
            texture: 'moon.jpg',
            bumpTexture: 'moon_bump.jpg', bumpScale: 0.01,
            orbitalRadius: 3, 
            orbitalPeriod: 0.05,
            rotationSpeed: 0.01,
            axialTilt: 1.54,
            parent: 'earth'
        },
        mars: {
            title: "Mars",
            description: "The 'Red Planet', known for its distinctive reddish hue and potential for past life.",
            diameter: "6,779 km", mass: "6.39 × 10^23 kg", period: "687 Earth days", distance: "1.52 AU",
            radius: 0.53,
            texture: 'mars.jpg',
            bumpTexture: 'mars_bump.jpg', bumpScale: 0.05,
            atmosphereColor: 0xff8c00,
            orbitalRadius: 60,
            eccentricity: 0.093,
            orbitalPeriod: 0.0016,
            rotationSpeed: 0.01,
            axialTilt: 25.19,
            orbitalInclination: 1.85
        },
        jupiter: {
            title: "Jupiter",
            description: "The largest planet in our solar system, a gas giant with a distinctive Great Red Spot.",
            diameter: "139,820 km", mass: "1.898 × 10^27 kg", period: "11.86 Earth years", distance: "5.2 AU",
            radius: 4,
            texture: 'jupiter.jpg',
            orbitalRadius: 120,
            eccentricity: 0.048,
            orbitalPeriod: 0.00025,
            rotationSpeed: 0.01,
            axialTilt: 3.13,
            orbitalInclination: 1.30
        },
        saturn: {
            title: "Saturn",
            description: "Famous for its magnificent ring system, Saturn is the sixth planet from the Sun.",
            diameter: "116,460 km", mass: "5.683 × 10^26 kg", period: "29.4 Earth days", distance: "9.58 AU",
            radius: 3.5,
            texture: 'saturn.jpg',
            bumpTexture: 'saturn_bump.jpg', 
            orbitalRadius: 180,
            eccentricity: 0.056,
            orbitalPeriod: 0.0001,
            rotationSpeed: 0.01,
            axialTilt: 26.73,
            orbitalInclination: 2.49,
            hasRings: true 
        },
        uranus: {
            title: "Uranus",
            description: "An ice giant, Uranus rotates on its side, making it unique among the planets.",
            diameter: "50,724 km", mass: "8.681 × 10^25 kg", period: "84 Earth years", distance: "19.2 AU",
            radius: 2,
            texture: 'uranus.jpg',
            orbitalRadius: 240,
            eccentricity: 0.046,
            orbitalPeriod: 0.00003,
            rotationSpeed: 0.008,
            axialTilt: 97.77,
            orbitalInclination: 0.77
        },
        neptune: {
            title: "Neptune",
            description: "The farthest known planet in our solar system, another ice giant with powerful storms.",
            diameter: "49,244 km", mass: "1.024 × 10^26 kg", period: "165 Earth years", distance: "30.1 AU",
            radius: 1.9,
            texture: 'neptune.jpg',
            orbitalRadius: 300,
            eccentricity: 0.010,
            orbitalPeriod: 0.000018,
            rotationSpeed: 0.008,
            axialTilt: 28.32,
            orbitalInclination: 1.77
        }
    },

    // --- Three.js Variables ---
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    raycaster: null,
    mouse: new THREE.Vector2(),
    textureLoader: null,
    focusLight: null, 
    labelRenderer: null, 
    clock: null, 

    // --- DOM Elements ---
    domElements: {
        canvas: null,
        loadingScreen: null,
        popup: null,
        closeButton: null,
        pauseButton: null, 
        popupTitle: null,
        popupDescription: null,
        popupDiameter: null,
        popupMass: null,
        popupPeriod: null,
        popupDistance: null,
        labelsContainer: null, 
    },

    // --- State Variables ---
    planets: [], 
    sunMesh: null,
    isPopupOpen: false,
    isAnimationPaused: false, 
    currentFocusedObject: null,
    originalCameraPosition: new THREE.Vector3(),
    originalControlsTarget: new THREE.Vector3(),

    /**
     * Initializes the 3D solar system.
     */
    init() {
        this.domElements.canvas = document.getElementById('solarSystemCanvas');
        this.domElements.loadingScreen = document.getElementById('loading-screen');
        this.domElements.popup = document.getElementById('details-popup');
        this.domElements.closeButton = document.getElementById('close-popup');
        this.domElements.pauseButton = document.getElementById('pause-button'); 
        this.domElements.popupTitle = document.getElementById('popup-title');
        this.domElements.popupDescription = document.getElementById('popup-description');
        this.domElements.popupDiameter = document.getElementById('popup-diameter');
        this.domElements.popupMass = document.getElementById('popup-mass');
        this.domElements.popupPeriod = document.getElementById('popup-period');
        this.domElements.popupDistance = document.getElementById('popup-distance');
        this.domElements.labelsContainer = document.getElementById('labels-container'); 

        this.clock = new THREE.Clock(); 
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLabelRenderer(); 
        this.setupLighting(); 
        this.setupFocusLight(); 
        this.setupControls();
        this.setupRaycasting();
        
        this.textureLoader = new THREE.TextureLoader();
        this.loadTexturesAndCreateCelestialBodies();
        
        this.bindEvents();
        window.addEventListener('resize', () => this.onWindowResize());

        this.animate(); // Start the animation loop
    },

    /**
     * Sets up the Three.js scene.
     */
    setupScene() {
        this.scene = new THREE.Scene();
    },

    /**
     * Sets up the camera.
     */
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
        this.camera.position.set(0, 100, 200); 
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.originalCameraPosition.copy(this.camera.position);
    },

    /**
     * Sets up the WebGL renderer.
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.domElements.canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0; 
    },
    
    /**
     * Sets up the CSS2D renderer for labels.
     */
    setupLabelRenderer() {
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        
        // --- THIS IS THE FIX ---
        // We *get* the div from the HTML, not create a new one.
        this.labelRenderer.domElement = document.getElementById('labels-container');
        // Manually set the size for the renderer
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    },

    /**
     * A simpler, more balanced lighting setup.
     */
    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
        this.scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xffffff, 6.0, 0, 0); 
        this.scene.add(sunLight);
    },

    /**
     * Creates a "headlight" attached to the camera for focused view.
     */
    setupFocusLight() {
        this.focusLight = new THREE.PointLight(0xffffff, 1.0); 
        this.focusLight.visible = false; 
        this.camera.add(this.focusLight); 
        this.scene.add(this.camera); 
    },

    /**
     * Sets up orbit controls for camera interaction.
     */
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; 
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 1; 
        this.controls.maxDistance = 1500;
        this.originalControlsTarget.copy(this.controls.target);
    },

    /**
     * Sets up raycasting for object interaction (clicks).
     */
    setupRaycasting() {
        this.raycaster = new THREE.Raycaster();
        window.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
        window.addEventListener('click', (event) => this.onClick(event), false);
    },

    /**
     * Loads textures and creates celestial body meshes.
     */
    loadTexturesAndCreateCelestialBodies() {
        const texturePromises = [];

        texturePromises.push(new Promise((resolve) => {
            this.textureLoader.load(this.texturePath + 'starfield.jpg', (texture) => {
                this.scene.background = texture;
                resolve();
            }, undefined, (err) => { console.error('Error loading starfield texture:', err); resolve(); });
        }));

        for (const id in this.planetData) {
            const data = this.planetData[id];
            
            if (data.texture) {
                texturePromises.push(new Promise((resolve) => {
                    this.textureLoader.load(this.texturePath + data.texture, (texture) => { data.map = texture; resolve(); }, 
                    undefined, (err) => { console.error(`Error loading texture for ${id}:`, err); data.map = null; resolve(); });
                }));
            }
            if (data.nightTexture) {
                texturePromises.push(new Promise((resolve) => {
                    this.textureLoader.load(this.texturePath + data.nightTexture, (texture) => { data.nightMap = texture; resolve(); },
                    undefined, (err) => { console.error(`Error loading night texture for ${id}:`, err); data.nightMap = null; resolve(); });
                }));
            }
            if (data.bumpTexture) {
                texturePromises.push(new Promise((resolve) => {
                    this.textureLoader.load(this.texturePath + data.bumpTexture, (texture) => { data.bumpMap = texture; resolve(); },
                    undefined, (err) => { console.error(`Error loading bump texture for ${id}:`, err); data.bumpMap = null; resolve(); });
                }));
            }
            if (data.specularTexture) {
                texturePromises.push(new Promise((resolve) => {
                    this.textureLoader.load(this.texturePath + data.specularTexture, (texture) => { data.specularMap = texture; resolve(); },
                    undefined, (err) => { console.error(`Error loading specular texture for ${id}:`, err); data.specularMap = null; resolve(); });
                }));
            }
            if (data.cloudTexture) {
                texturePromises.push(new Promise((resolve) => {
                    this.textureLoader.load(this.texturePath + data.cloudTexture, (texture) => { data.cloudMap = texture; resolve(); },
                    undefined, (err) => { console.error(`Error loading cloud texture for ${id}:`, err); data.cloudMap = null; resolve(); });
                }));
            }
            if (data.hasRings && id === 'saturn') {
                texturePromises.push(new Promise((resolve) => {
                    this.textureLoader.load(this.texturePath + 'saturn_ring.png', (texture) => { data.ringMap = texture; resolve(); },
                    undefined, (err) => { console.error('Error loading Saturn ring texture:', err); data.ringMap = null; resolve(); });
                }));
            }
        }
        
        texturePromises.push(new Promise((resolve) => {
            this.textureLoader.load(this.texturePath + 'glow.png', (texture) => { this.atmosphereGlowTexture = texture; resolve(); },
            undefined, (err) => { console.error('Error loading atmosphere glow texture:', err); this.atmosphereGlowTexture = null; resolve(); });
        }));


        Promise.allSettled(texturePromises)
            .then(() => {
                this.createCelestialBodies();
                this.domElements.loadingScreen.classList.add('hidden');
            });
    },

    /**
     * Creates all celestial bodies and their associated labels/pointers.
     */
    createCelestialBodies() {
        for (const id in this.planetData) {
            const data = this.planetData[id];
            const geometry = new THREE.SphereGeometry(data.radius, 64, 64); 
            let material;

            if (data.isLight) { // Sun
                material = new THREE.MeshBasicMaterial({
                    map: data.map,
                });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.userData = { id: id, data: data };
                this.scene.add(mesh);
                this.planets.push(mesh);
                this.sunMesh = mesh;
                
                if (data.atmosphereColor && this.atmosphereGlowTexture) {
                    const spriteMaterial = new THREE.SpriteMaterial({
                        map: this.atmosphereGlowTexture,
                        color: data.atmosphereColor,
                        transparent: true,
                        opacity: 0.8,
                        blending: THREE.AdditiveBlending
                    });
                    const atmosphereSprite = new THREE.Sprite(spriteMaterial);
                    const scale = data.radius * (data.atmosphereScale || 2.5);
                    atmosphereSprite.scale.set(scale, scale, 1.0);
                    mesh.add(atmosphereSprite);
                }

            } else { // Planets and Moons
                
                material = new THREE.MeshStandardMaterial({
                    map: data.map, 
                    emissiveMap: data.nightMap || null,
                    emissive: data.nightMap ? 0xffffff : 0x000000,
                    emissiveIntensity: data.nightMap ? 1.0 : 0, 
                    bumpMap: data.bumpMap || null,
                    bumpScale: data.bumpScale || 0.01,
                    specularMap: data.specularMap || null, 
                    shininess: data.specularMap ? 100 : 10,
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                mesh.userData = { id: id, data: data, orbitProgress: Math.random() }; 
                this.planets.push(mesh);
                
                mesh.rotation.x = THREE.MathUtils.degToRad(data.axialTilt || 0);

                // --- MODIFIED: Create Floating Label ---
                const labelDiv = document.createElement('div');
                labelDiv.className = 'planet-label';
                labelDiv.textContent = data.title;
                const label = new CSS2DObject(labelDiv);
                
                // --- MODIFIED: Position label OFF TO THE SIDE ---
                label.position.set(data.radius * 1.5, data.radius * 1.5, 0); 
                mesh.add(label);
                mesh.userData.label = label; // Save label reference for fading

                // --- NEW: Add click event listener to the label itself ---
                label.element.addEventListener('click', (event) => {
                    event.stopPropagation(); // Stop click from bubbling to the background
                    this.showDetails(mesh); 
                    this.focusCameraOnObject(mesh);
                });
                // --- END NEW ---

                // Add Clouds
                if (data.cloudMap) {
                    const cloudGeometry = new THREE.SphereGeometry(data.radius * 1.01, 64, 64);
                    const cloudMaterial = new THREE.MeshLambertMaterial({
                        map: data.cloudMap,
                        transparent: true,
                        opacity: 0.7
                    });
                    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
                    // --- NEW: FIX FOR EARTH CLICK ---
                    cloudMesh.raycast = () => {}; // Make clouds unclickable
                    mesh.add(cloudMesh);
                    mesh.userData.clouds = cloudMesh; // Save for animation
                }

                // Add Atmospheric Glow
                if (data.atmosphereColor && this.atmosphereGlowTexture) {
                    const spriteMaterial = new THREE.SpriteMaterial({
                        map: this.atmosphereGlowTexture,
                        color: data.atmosphereColor,
                        transparent: true,
                        opacity: 0.6,
                        blending: THREE.AdditiveBlending
                    });
                    const atmosphereSprite = new THREE.Sprite(spriteMaterial);
                    atmosphereSprite.scale.set(data.radius * 2.5, data.radius * 2.5, 1.0);
                    // --- NEW: FIX FOR EARTH CLICK ---
                    atmosphereSprite.raycast = () => {}; // Make atmosphere unclickable
                    mesh.add(atmosphereSprite);
                }

                // Handle orbital inclination
                const orbitContainer = new THREE.Group(); 
                
                if (data.parent) { // It's a moon
                    const parentMesh = this.planets.find(p => p.userData.id === data.parent);
                    if (parentMesh) {
                        const moonOrbit = new THREE.Group();
                        moonOrbit.add(mesh);
                        mesh.position.set(data.orbitalRadius, 0, 0); 
                        parentMesh.add(moonOrbit); 
                        mesh.userData.orbitGroup = moonOrbit; 
                    }
                } else { // It's a planet
                    const eccentricity = data.eccentricity || 0;
                    const orbitPath = this.createEllipticalPath(data.orbitalRadius, eccentricity);
                    
                    mesh.userData.orbitPath = orbitPath;
                    
                    const points = orbitPath.getPoints(100); 
                    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
                    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
                    orbitLine.rotation.x = Math.PI / 2; 
                    
                    orbitContainer.add(orbitLine);
                    orbitContainer.add(mesh);
                    
                    // Apply Orbital Inclination
                    orbitContainer.rotation.x = THREE.MathUtils.degToRad(data.orbitalInclination || 0);
                    
                    this.scene.add(orbitContainer); 
                }

                // Saturn's Rings
                if (data.hasRings && id === 'saturn' && data.ringMap) {
                    const ringGeometry = new THREE.RingGeometry(data.radius * 1.2, data.radius * 2, 64);
                    const ringMaterial = new THREE.MeshStandardMaterial({ 
                        map: data.ringMap,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.8
                    });
                    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                    rings.rotation.x = Math.PI / 2; 
                    rings.userData.isRing = true; 
                    rings.receiveShadow = true; 
                    rings.castShadow = true; 
                    mesh.add(rings); 
                }
            }
        }
    },
    
    createEllipticalPath(orbitalRadius, eccentricity) {
        const a = orbitalRadius; 
        const c = a * eccentricity; 
        const b = Math.sqrt(a*a - c*c); 
        const path = new THREE.EllipseCurve(-c, 0, a, b, 0, 2 * Math.PI, false, 0);
        return path;
    },

    bindEvents() {
        this.domElements.closeButton.addEventListener('click', () => this.closePopup());
        this.domElements.pauseButton.addEventListener('click', () => this.togglePause());
        this.controls.addEventListener('start', () => { });
    },

    togglePause() {
        this.isAnimationPaused = !this.isAnimationPaused;
        if (this.isAnimationPaused) {
            this.domElements.pauseButton.innerHTML = '►'; 
            this.domElements.pauseButton.setAttribute('aria-label', 'Play animation');
        } else {
            this.domElements.pauseButton.innerHTML = '∥'; 
            this.domElements.pauseButton.setAttribute('aria-label', 'Pause animation');
        }
    },

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight); 
    },

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },

    onClick(event) {
        // If the click was inside the popup, do nothing.
        // We check this *first* to avoid clicking "through" the popup.
        if (this.domElements.popup.contains(event.target)) { 
            return; 
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planets);

        if (intersects.length > 0) {
            let clickedObject = intersects[0].object;
            if (clickedObject.userData.isRing) {
                clickedObject = clickedObject.parent;
            }
            if (this.currentFocusedObject !== clickedObject) {
                this.showDetails(clickedObject); 
                this.focusCameraOnObject(clickedObject);
            }
        } else {
            // Clicked on empty space
            if (this.isPopupOpen) {
                this.closePopup();
            }
        }
    },

    showDetails(object) {
        const data = object.userData.data;
        this.domElements.popupTitle.textContent = data.title;
        this.domElements.popupDescription.textContent = data.description;
        this.domElements.popupDiameter.textContent = data.diameter;
        this.domElements.popupMass.textContent = data.mass;
        this.domElements.popupPeriod.textContent = data.period;
        this.domElements.popupDistance.textContent = data.distance;
        this.domElements.popup.classList.remove('hidden');
        this.isPopupOpen = true;
    },

    focusCameraOnObject(object) {
        this.currentFocusedObject = object;
        this.originalCameraPosition.copy(this.camera.position); 
        this.originalControlsTarget.copy(this.controls.target);

        this.focusLight.visible = true; // Turn on headlight

        const worldPosition = new THREE.Vector3();
        object.getWorldPosition(worldPosition);

        const offsetDistance = object.userData.data.radius * 5 + 10;
        const offset = new THREE.Vector3(0, offsetDistance / 2, offsetDistance);
        const cameraTargetPosition = worldPosition.clone().add(offset);
        
        new TWEEN.Tween(this.camera.position)
            .to(cameraTargetPosition, 1000) 
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        new TWEEN.Tween(this.controls.target)
            .to(worldPosition, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    },

    closePopup() {
        if (!this.isPopupOpen) return;
        this.domElements.popup.classList.add('hidden');
        this.isPopupOpen = false;
        this.currentFocusedObject = null;
        this.focusLight.visible = false; // Turn off headlight

        new TWEEN.Tween(this.camera.position)
            .to(this.originalCameraPosition, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        new TWEEN.Tween(this.controls.target)
            .to(this.originalControlsTarget, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    },

    /**
     * Helper function to convert 3D world space to 2D screen space
     */
    toScreenPosition(vector, camera) {
        const widthHalf = window.innerWidth / 2;
        const heightHalf = window.innerHeight / 2;
        
        vector.project(camera); // Project to Normalized Device Coordinates (NDC)
        
        const x = (vector.x * widthHalf) + widthHalf;
        const y = -(vector.y * heightHalf) + heightHalf;

        return { x, y };
    },

    /**
     * The main animation loop.
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime(); 

        this.controls.update(); 
        TWEEN.update(); 

        // --- FADE LABELS ON ZOOM ---
        const camPos = this.camera.position;
        this.planets.forEach(body => {
            // Only fade labels for planets/moons
            if (body.userData.label && !body.userData.data.isLight) {
                const planetPos = new THREE.Vector3();
                body.getWorldPosition(planetPos);
                const distance = camPos.distanceTo(planetPos);
                
                // Define fade distances
                const fadeStart = (body.userData.data.radius || 1) * 20 + 10;
                const fadeEnd = (body.userData.data.radius || 1) * 10 + 5;
                
                let opacity = 1;
                if (distance < fadeStart) {
                    opacity = (distance - fadeEnd) / (fadeStart - fadeEnd);
                    opacity = Math.max(0, Math.min(1, opacity)); // Clamp 0-1
                }

                // Fade the label
                body.userData.label.element.style.opacity = opacity;
            }
        });
        // --- END FADE LABELS ---


        // Update all celestial bodies
        this.planets.forEach(body => {
            const data = body.userData.data;

            // Animate clouds
            if (body.userData.clouds) {
                body.userData.clouds.rotation.y = elapsedTime * (data.rotationSpeed * 0.5); // Slower
            }

            // Check if the simulation is paused
            if (!this.isAnimationPaused) {
                
                // Self-rotation
                if (data.rotationSpeed) {
                    body.rotation.y += data.rotationSpeed;
                }

                // Elliptical orbit for planets
                if (body.userData.orbitPath) {
                    body.userData.orbitProgress += data.orbitalPeriod;
                    if (body.userData.orbitProgress > 1) {
                        body.userData.orbitProgress -= 1;
                    }
                    const newPos2D = body.userData.orbitPath.getPoint(body.userData.orbitProgress);
                    body.position.set(newPos2D.x, 0, newPos2D.y);

                // Circular orbit for moons
                } else if (data.orbitalPeriod && body.userData.orbitGroup) {
                    body.userData.orbitGroup.rotation.y += data.orbitalPeriod;
                }
            }
        });
        
        // If we are focused, keep the controls target updated
        if (this.currentFocusedObject) {
            const worldPosition = new THREE.Vector3();
            this.currentFocusedObject.getWorldPosition(worldPosition);
            this.controls.target.copy(worldPosition); 
        }

        // --- Use the simple renderer ---
        this.renderer.render(this.scene, this.camera);
        
        this.labelRenderer.render(this.scene, this.camera); // Render labels
    }
};


// Start the application
document.addEventListener('DOMContentLoaded', () => {
    SolarSystem3D.init();
});