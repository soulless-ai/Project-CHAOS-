
Detector.webgl || Detector.addGetWebGLMessage();

let deviceSettings = {
	isWebGL: !1,
	isAndroid: null,
	isEarlyIE: null,
	isIE: null,
	isIEMobile: null,
	isiPod: null,
	isiPhone: null,
	isiPad: null,
	isiOS: null,
	isMobile: null,
	isTablet: null,
	isWinSafari: null,
	isMacSafari: null
};
function setupDeviceSettings() {
	let e = navigator.userAgent.toLowerCase();
	deviceSettings.isAndroid = -1 < e.indexOf("android"),
		deviceSettings.isiPod = null !== navigator.userAgent.match(/iPod/i),
		deviceSettings.isiPhone = null !== navigator.userAgent.match(/iPhone/i),
		deviceSettings.isiPad = null !== navigator.userAgent.match(/iPad/i),
		deviceSettings.isiOS = !!navigator.userAgent.match(/(iPad|iPhone|iPod)/i),
		deviceSettings.isIEMobile = null !== navigator.userAgent.match(/iemobile/i);
	let a = navigator.platform.toLowerCase();
	deviceSettings.isIEMobile || deviceSettings.isAndroid ||
		deviceSettings.isiPad || "ipad" === a || "iphone" === a ||
		"ipod" === a || "android" === a || "palm" === a || "windows phone" === a
		|| "blackberry" === a || "linux armv7l" === a ? (deviceSettings.isMobile = !0,
			$("body").addClass("isMobile")) : $("body").addClass("isDesktop"),
		Detector.webgl && (deviceSettings.isWebGL = !0),
		(deviceSettings.isAndroid || deviceSettings.isIEMobile)
		&& (deviceSettings.isWebGL = !1)
};

let container, camera, scene, renderer, stats, statsCreated,
	i, x, y, b, initMouseX, lastTouchX, lastTouchY, intersects,
	mouse = new THREE.Vector2,
	mouseX = 0,
	mouseY = 0,
	mouseXOnMouseDown = 0,
	mouseYOnMouseDown = 0,
	clientMouseX = 0,
	clientMouseY = 0,
	openingCameraZ = 1e3,
	targetCameraZ = 250,
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,
	toRAD = Math.PI / 180,
	radianLoop = 6.28319,
	openingRotationX = .45,
	targetRotationX = .45,
	targetRotationXOnMouseDown = .45,
	openingRotationY = 65 * toRAD,
	targetRotationY = 65 * toRAD,
	targetRotationYOnMouseDown = 90 * toRAD,
	isMouseDown = !1,
	isMouseMoved = !1,
	isGlobeRotated = !1,
	isGlobeEventsEnabled = !1,
	globeRaycaster = new THREE.Raycaster,
	intersection = null,
	isParticleHit = !1,
	isMediaHit = !1;
globeRaycaster.params.Points.threshold = .4;
let colorPrimary_Base = "#88a0a7",
	colorSecondary_Base = "#D4AF37",
	colorPrimary = "#88a0a7",
	colorSecondary = colorSecondary_Base,
	colorDarken = "#000000",
	colorBrighten = "#FFFFFF",
	colorBase = new THREE.Color(colorPrimary),
	colorBase50 = new THREE.Color(shadeBlend(.5, colorPrimary, colorDarken)),
	colorBase75 = new THREE.Color(shadeBlend(.75, colorPrimary, colorDarken)),
	colorBase85 = new THREE.Color(shadeBlend(.85, colorPrimary, colorDarken)),
	colorHighlight = new THREE.Color(colorSecondary);
function initWebgl() {
	setupDeviceSettings(),
		container = document.getElementById("interactive");
	let e = window.innerWidth,
		a = window.innerHeight;
	scene = new THREE.Scene,
		scene.fog = new THREE.Fog(0, 0, 400),
		camera = new THREE.PerspectiveCamera(45, e / a, 1, 2e3),
		camera.position.x = 0,
		camera.position.y = 0,
		camera.position.z = openingCameraZ,
		camera.rotation.x = 0,
		camera.rotation.y = 0,
		camera.rotation.z = 0;
	arrayExecuter.execute([
		{ fn: createGroup, vars: [stepComplete] },
		{ fn: createLights, vars: [stepComplete] },
		{ fn: createUniverse, vars: [stepComplete] },
		{ fn: createGlobe, vars: [stepComplete] },
		{ fn: createDots, vars: [stepComplete] },
		{ fn: createMedia, vars: [stepComplete] },
		{ fn: createArcsSnake, vars: [stepComplete] },
		{ fn: createArcsRocket, vars: [stepComplete] },
		{ fn: createArcsAll, vars: [stepComplete] },
		{ fn: createRings, vars: [stepComplete] },
		{ fn: createSpikes, vars: [stepComplete] },
		{ fn: createRingPulse, vars: [stepComplete] },
		{ fn: createRain, vars: [stepComplete] },
		{ fn: createMinimapBg, vars: [stepComplete] },
		{ fn: createGlitch, vars: [stepComplete] },
		{ fn: createPreloader, vars: [stepComplete] },
		{ fn: createStars, vars: null }
	]),
		renderer = new THREE.WebGLRenderer({ antialias: !0, alpha: !1 }),
		renderer.setSize(e, a),
		renderer.setClearColor(0, 1),
		container.appendChild(renderer.domElement),
		$("body").click(function () { soundIsOn || initAudio() }),
		animate()
}
let total_pics_num = 10,
	interval = 1000,
	time_out = 0.5,
	quantity = 0,
	timeout,
	opacity = 100;
function fade_to_next() {
		opacity--;
		let k = quantity + 1;
		let image_now = 'image_' + quantity;
		if (quantity == total_pics_num) k = 1;
		let image_next = 'image_' + k;
		document.getElementById(image_now).style.opacity = opacity/100;
		document.getElementById(image_now).style.filter = 'alpha(opacity='+ opacity +')';
		document.getElementById(image_next).style.opacity = (100-opacity)/100;
		document.getElementById(image_next).style.filter = 'alpha(opacity='+ (100-opacity) +')';
		timeout = setTimeout("fade_to_next()",time_out);
		if (opacity==1) {
			opacity = 100;
			clearTimeout(timeout);
		}
}
setInterval (
	function() {
		quantity++;
		if (quantity > total_pics_num) quantity=1;
		fade_to_next();
	}, interval
);
let preloaderAnimationIn,
	preloaderAnimationOut,
	preloaderSplitText,
	preloaderSplitTextWordTotal,
	introAnimation,
	preloaderAnimationInComplete = !1,
	preloaderArray = [],
	preloaderComplete = !1,
	preloaderLoaded = 0,
	preloaderTotal = 0,
	isIntroDone = !1;
function createPreloader(e) {
	TweenMax.set("#authors", {
		transformPerspective: 600,
		perspective: 300,
		transformStyle: "preserve-3d"
	}),
	TweenMax.set("#quote", {
		transformPerspective: 600,
		perspective: 300,
		transformStyle: "preserve-3d"
	}),
	TweenMax.set("#preloaderBar", {
		scaleX: 0,
		autoAlpha: 0,
		transformOrigin: "center center"
	}),
	TweenMax.set("#preloaderBarInner", {
		scaleX: 0,
		autoAlpha: 0,
		transformOrigin: "center center"
	}),
	TweenMax.set(".close line", {
		attr: { x1: 25, y1: 25, x2: 25, y2: 25 },
		stroke: "#FFFFFF",
		autoAlpha: 0
	}),
	TweenMax.set(".close circle", {
		drawSVG: "50% 50%",
		stroke: "#FFFFFF",
		autoAlpha: 0
	}),
	TweenMax.set(".overlay", { autoAlpha: 0 }),
	TweenMax.set(".cover, .overlay, .page", {
		transformPerspective: 800,
		perspective: 300,
		transformStyle: "preserve-3d",
		transformOrigin: "left center"
	}),
	changeTagline(),
	preloaderSplitText = new SplitText("#quote", { type: "words" }),
	preloaderSplitTextWordTotal = preloaderSplitText.words.length,
	preloaderAnimationIn = new TimelineMax({
		paused: !0,
		delay: .25,
		onComplete: function () {
			preloaderAnimationInComplete = !0,
			startPreloader()
		}
	}),
	preloaderAnimationIn.from("#authors", 1,
		{ z: generateRandomNumber(-200, -50), autoAlpha: 0, ease: Linear.easeNone }, 5),
	preloaderAnimationIn.fromTo("#preloaderInner", 1,
		{ autoAlpha: 0 },
		{ autoAlpha: 1, ease: Expo.easeOut }, 5);
	for (var a = 0; a < preloaderSplitTextWordTotal; a++) {
		preloaderAnimationIn.from(preloaderSplitText.words[a], 2,
			{
				z: generateRandomNumber(-200, -50),
				rotationX: 0, autoAlpha: 0, ease: Expo.easeOut
			},
			5 + 1 * Math.random());
	}
	preloaderAnimationIn.fromTo("#preloaderBar", 1,
		{ scaleX: .5, autoAlpha: 0 },
		{ scaleX: 1, autoAlpha: 1, ease: Expo.easeOut }, 7),
		TweenMax.staggerFromTo("#authors, #quote div", 3,
			{ color: "#FFFFFF" },
			{ color: "#FFFFFF", delay: 6 }, .1),
		preloaderAnimationIn.timeScale(1),
		preloaderAnimationIn.play(0),
		e && e()
}
function startPreloader() {
		preloaderArray.push("img/dot-inverted.png"),
		preloaderArray.push("img/earth-glow.jpg"),
		preloaderArray.push("img/ring_explosion.jpg"),
		preloaderArray.push("img/map.png"),
		preloaderArray.push("img/map_inverted.png"),
		preloaderArray.push("img/photo.png"),
		preloaderArray.push("img/universe.jpg"),
		preloaderArray.push("img/hex.jpg"),
		preloaderArray.push("img/mapDetails.png"),
		preloaderArray.push("img/mapLines.png"),
		preloaderArray.push("img/mapCircles.png"),
		preloaderArray.push("img/mapExtras1.png"),
		preloaderArray.push("img/mapExtras2.png"),
		preloaderArray.push("img/mapGradient1.png"),
		preloaderArray.push("img/mapGradient2.png"),
		preloaderTotal = preloaderArray.length;
	for (var e, a = 0; a < preloaderArray.length; a++) {
		e = new Image, e.src = preloaderArray[a], e.onload = function () { checkPreloader() }
	}
	TweenMax.fromTo("#preloaderBarInner", 3,
		{ backgroundColor: "#485fab" },
		{ backgroundColor: "#88a0a7", ease: Linear.easeNone }),
		TweenMax.staggerTo("#quote div, #authors", 2,
			{ color: "#88a0a7", immediateRender: !1, ease: Linear.easeNone }, .1)
}
function checkPreloader() {
	preloaderLoaded++;
	let e = preloaderLoaded / preloaderTotal;
	preloaderLoaded === preloaderTotal && (preloaderComplete = !0, preloaderAnimationInComplete),
		TweenMax.to("#preloaderBarInner", 1,
			{
				scaleX: e, autoAlpha: 1,
				transformOrigin: "center center",
				ease: Expo.easeOut,
				onComplete: function () {
					preloaderComplete && (finishPreloader(), initExperience())
				}
			})
}
function finishPreloader() {
	preloaderAnimationOut = new TimelineMax({ paused: !0, onComplete: function () { playIntro() } }),
		preloaderAnimationOut.to("#preloaderBar", 1,
			{
				scaleX: 0, autoAlpha: 0,
				ease: Expo.easeIn,
				immediateRender: !1,
				transformOrigin: "center center"
			}, 0),
		preloaderAnimationOut.to("#preloaderInner", 2, { autoAlpha: 0 });
	for (var e = 0; e < preloaderSplitTextWordTotal; e++) {
		preloaderAnimationOut.to(preloaderSplitText.words[e], 2,
			{
				z: generateRandomNumber(-200, -50),
				autoAlpha: 0,
				immediateRender: !1,
				ease: Expo.easeIn
			}, 1 * Math.random());
		preloaderAnimationOut.timeScale(1),
			preloaderAnimationOut.play(0)
	}
}
let arrayExecuter = new ArrayExecuter,
	stepComplete = arrayExecuter.stepComplete_instant.bind(arrayExecuter);
function initExperience() {
	document.getElementById("interactive").addEventListener("mousedown", onDocumentMouseDown, !1),
		document.getElementById("interactive").addEventListener("mousemove", onDocumentMouseMove, !1),
		document.getElementById("interactive").addEventListener("mouseup", onDocumentMouseUp, !1),
		document.getElementById("interactive").addEventListener("mouseleave", onDocumentMouseLeave, !1),
		document.getElementById("interactive").addEventListener("touchstart", onDocumentTouchStart, !1),
		document.getElementById("interactive").addEventListener("touchmove", onDocumentTouchMove, !1),
		document.getElementById("interactive").addEventListener("touchend", onDocumentTouchEnd, !1),
		document.getElementById("interactive").addEventListener("mousewheel", onMouseWheel, !1),
		document.addEventListener("gesturestart", function (a) { a.preventDefault() }),
		window.addEventListener("resize", onWindowResize, !1),
		onWindowResize(),
		initButtons()
}
function playIntro() {
	isGlobeRotated = !0,
		isGlobeEventsEnabled = !0,
		TweenMax.set("#ui svg", { rotation: -90, transformOrigin: "center center" }),
		TweenMax.set("#bracket-left", { drawSVG: "20% 30%" }),
		TweenMax.set("#bracket-right", { drawSVG: "70% 80%" }),
		introAnimation = new TimelineMax({
			paused: !0, force3D: !0,
			onComplete: function () { isIntroDone = !0 }
		}),
		introAnimation.fromTo("#preloader", 2,
			{ autoAlpha: 1 },
			{ autoAlpha: 0, ease: Linear.easeNone }, 0),
		introAnimation.staggerFromTo("#header .animate", 2,
			{ y: -75 },
			{ y: 0, ease: Expo.easeInOut }, -.1, 1),
		introAnimation.fromTo("#nav-left a", 2,
			{ x: 100, autoAlpha: 0 },
			{ x: 0, autoAlpha: 1, ease: Expo.easeInOut }, .1, 2),
		introAnimation.fromTo("#nav-right a", 2,
			{ x: -100, autoAlpha: 0 },
			{ x: 0, autoAlpha: 1, ease: Expo.easeInOut }, .1, 2),
		introAnimation.staggerFromTo("#arcMode .optionitem", 2,
			{ x: -150, autoAlpha: 0 },
			{ x: 0, autoAlpha: 1, ease: Expo.easeOut }, -.1, 1.5),
		introAnimation.staggerFromTo("#colorMode .optionitem", 2,
			{ x: 150, autoAlpha: 0 },
			{ x: 0, autoAlpha: 1, ease: Expo.easeOut }, .1, 1.5),
		introAnimation.fromTo(".category", 2,
			{ autoAlpha: 0 },
			{ autoAlpha: 1 }, 2),
		introAnimation.fromTo("#minimapBackground", 1,
			{ autoAlpha: 0 },
			{ autoAlpha: 1 }, 1),
		introAnimation.fromTo("#minimap", 2,
			{ autoAlpha: 0 },
			{ autoAlpha: 1 }, 2),
		introAnimation.fromTo("#palette", 2,
			{ y: 50, autoAlpha: 0 },
			{ y: 0, autoAlpha: 1, ease: Expo.easeOut }, 1.25),
		introAnimation.fromTo("#soundButton", 2,
			{ x: -50, autoAlpha: 0 },
			{ x: 0, autoAlpha: 1, ease: Expo.easeOut }, 1.75),
		introAnimation.fromTo("#rotationMode", 2,
			{ x: 50, autoAlpha: 0 },
			{ x: 0, autoAlpha: 1, ease: Expo.easeOut }, 1.75),
		introAnimation.timeScale(1),
		introAnimation.play();

	let e = new TimelineMax({ paused: !0, delay: 3 });
	e.fromTo(minimapSpiral, 1,
		{ pixi: { alpha: 0 } },
		{ pixi: { alpha: 1 }, ease: Linear.easeNone }, 0),
		e.fromTo(minimapDetails, 1,
			{ pixi: { alpha: 0 } },
			{ pixi: { alpha: 1 }, ease: Linear.easeNone }, 0),
		e.fromTo(minimapLines, 1,
			{ pixi: { alpha: 0 } },
			{ pixi: { alpha: 1 }, ease: Linear.easeNone }, 0),
		e.to(minimapDetails, 1,
			{ pixi: { tint: colorPrimary } }, 3),
		e.fromTo(minimapLines, 2,
			{ pixi: { tint: 16777215 } },
			{ pixi: { tint: colorPrimary }, ease: Linear.easeNone }, 0),
		e.fromTo(minimapMaskGradient, 2,
			{ pixi: { scaleX: 0 } },
			{ pixi: { scaleX: 1.25 }, ease: Expo.easeOut }, 0),
		e.fromTo(minimapSpiral, 2,
			{ pixi: { rotation: 90 } },
			{ pixi: { rotation: 450 }, ease: Expo.easeOut }, 0),
		e.fromTo(minimapSpiral, .1,
			{ pixi: { alpha: 0 } },
			{ pixi: { alpha: 1 }, immediateRender: !1, ease: Linear.easeNone }, 0),
		e.fromTo(minimapSpiral, .75,
			{ pixi: { alpha: 1 } },
			{ pixi: { alpha: 0 }, immediateRender: !1, ease: Linear.easeNone }, .2),
		e.fromTo(minimapMaskGradient, 2,
			{ pixi: { alpha: 1 } },
			{ pixi: { alpha: 0 }, ease: Linear.easeNone }, .5),
		e.fromTo(minimapBlipsGroup, .65,
			{ pixi: { scale: 0 } },
			{ pixi: { scale: 1 }, ease: Expo.easeOut }, 0),
		e.fromTo(minimapBlipArray, .75,
			{ pixi: { alpha: 1 } },
			{ pixi: { alpha: 0 }, ease: Linear.easeNone }, .5),
		e.fromTo(minimapSpikesGroup, .75,
			{ pixi: { scale: 0 } },
			{ pixi: { scale: 1 }, ease: Expo.easeOut }, 0),
		e.fromTo(minimapXArray, .75,
			{ pixi: { scaleY: 1 } },
			{ pixi: { scaleY: 0 }, ease: Circ.easeInOut }, .1),
		e.fromTo(minimapExtras1, 3,
			{ pixi: { rotation: 0 } },
			{ pixi: { rotation: -360 }, ease: Expo.easeOut }, 0),
		e.fromTo(minimapExtras1, .1,
			{ pixi: { alpha: 0 } },
			{ pixi: { alpha: 1 }, ease: Linear.easeNone }, 0),
		e.fromTo(minimapExtras1, 1,
			{ pixi: { alpha: 1, tint: 16777215 } },
			{ pixi: { alpha: 0, tint: colorPrimary }, immediateRender: !1, ease: Linear.easeNone }, .2),
		e.fromTo(minimapExtras2, 1.5,
			{ pixi: { scale: .5 } },
			{ pixi: { scale: 1.1 }, ease: Expo.easeOut }, 0),
		e.fromTo(minimapExtras2, .1,
			{ pixi: { alpha: 0 } },
			{ pixi: { alpha: .5 }, ease: Linear.easeNone }, 0),
		e.fromTo(minimapExtras2, 1,
			{ pixi: { alpha: .5, tint: 16777215 } },
			{ pixi: { alpha: 0, tint: colorPrimary }, immediateRender: !1, ease: Linear.easeNone }, .2),
		e.fromTo(minimapXArray, 1,
			{ pixi: { tint: 16777215 } },
			{ pixi: { tint: colorPrimary }, ease: Linear.easeNone }, 0),
		e.fromTo(minimapBlipArray, 1,
			{ pixi: { tint: 16777215 } },
			{ pixi: { tint: colorPrimary }, ease: Linear.easeNone }, 0),
		e.timeScale(1.5), e.play();

	let a = new TimelineMax({ paused: !0, delay: 5 });
	a.fromTo("#tutorial", 1,
		{ autoAlpha: 0 },
		{ autoAlpha: 1, immediateRender: !1, ease: Linear.easeNone }, 0),
		a.fromTo("#tutorial", 2,
			{ scrambleText: { text: " " } },
			{
				scrambleText: { text: "THESE ARE BOOK LOCATIONS", chars: "0123456789!@#$%^&*()" },
				ease: Expo.easeInOut
			}, 0),
		a.fromTo("#tutorial", 1,
			{ autoAlpha: 0 },
			{ autoAlpha: 1, immediateRender: !1, ease: Linear.easeNone }, 3),
		a.fromTo("#tutorial", 2,
			{ scrambleText: { text: " " } },
			{
				scrambleText: { text: "ZOOM IN TO SEE LOCATIONS WITH PHOTOS", chars: "0123456789!@#$%^&*()" },
				ease: Expo.easeInOut
			}, 3),
		a.fromTo("#tutorial", 1,
			{ autoAlpha: 0 },
			{ autoAlpha: 1, immediateRender: !1, ease: Linear.easeNone }, 6),
		a.fromTo("#tutorial", 2,
			{ scrambleText: { text: " " } },
			{
				scrambleText: { text: "PLAY WITH THE OPTIONS BELOW", chars: "0123456789!@#$%^&*()" },
				ease: Expo.easeInOut
			}, 6),
		a.fromTo("#tutorial", 1,
			{ autoAlpha: 1 },
			{ autoAlpha: 0, immediateRender: !1, ease: Linear.easeNone }, 9),
		a.timeScale(1),
		a.play(),
		setArcAnimation("snake"),
		showGlobe()
}
let rotationObject, earthObject;
function createGroup(e) {
	rotationObject = new THREE.Group,
		rotationObject.name = "rotationObject",
		rotationObject.rotation.x = openingRotationX,
		rotationObject.rotation.y = openingRotationY,
		scene.add(rotationObject),
		earthObject = new THREE.Group,
		earthObject.name = "earthObject",
		earthObject.rotation.y = -90 * toRAD,
		rotationObject.add(earthObject),
		e && e()
}
let lightShield1, lightShield2, lightShield3,
	lightShieldIntensity = 1.25,
	lightShieldDistance = 400,
	lightShieldDecay = 2,
	lightsCreated = !1;
function createLights(e) {
	lightShield1 =
		new THREE.PointLight(colorBase, lightShieldIntensity, lightShieldDistance, lightShieldDecay),
		lightShield1.position.x = -50,
		lightShield1.position.y = 150,
		lightShield1.position.z = 75,
		lightShield1.name = "lightShield1",
		scene.add(lightShield1),
		lightShield2 =
		new THREE.PointLight(colorBase, lightShieldIntensity, lightShieldDistance, lightShieldDecay),
		lightShield2.position.x = 100,
		lightShield2.position.y = 50,
		lightShield2.position.z = 50,
		lightShield2.name = "lightShield2",
		scene.add(lightShield2),
		lightShield3 =
		new THREE.PointLight(colorBase, lightShieldIntensity, lightShieldDistance, lightShieldDecay),
		lightShield3.position.x = 0,
		lightShield3.position.y = -300,
		lightShield3.position.z = 50,
		lightShield3.name = "lightShield3",
		scene.add(lightShield3), lightsCreated = !0, e && e()
}

let ringsObject, ringsOuterMaterial, ringsInnerMaterial, ringsCreated = !1;
function createRings(e) {
	ringsObject = new THREE.Group,
		ringsObject.name = "ringsObject",
		scene.add(ringsObject);
	let a = new THREE.RingGeometry(200, 195, 128),
		t = new THREE.RingGeometry(100, 98, 128);
	ringsOuterMaterial = new THREE.MeshBasicMaterial({
		color: colorBase75,
		transparent: !0,
		blending: THREE.AdditiveBlending,
		side: THREE.DoubleSide,
		fog: !0,
		depthWrite: !1
	}),
		ringsInnerMaterial = new THREE.MeshBasicMaterial({
			color: colorBase50,
			transparent: !0,
			blending: THREE.AdditiveBlending,
			side: THREE.DoubleSide,
			fog: !0,
			depthWrite: !1
		});
	let i = new THREE.Mesh(a, ringsOuterMaterial);
	i.rotation.x = 90 * toRAD;
	let o = i.clone();
	i.position.y = 90,
		o.position.y = -90,
		ringsObject.add(i),
		ringsObject.add(o);
	let n = new THREE.Mesh(t, ringsInnerMaterial);
	n.rotation.x = 90 * toRAD;
	let r = n.clone();
	n.position.y = 100,
		r.position.y = -100,
		ringsObject.add(n),
		ringsObject.add(r),
		ringsCreated = !0,
		e && e()
}
function renderRings() {
	ringsObject.rotation.x = ringsObject.rotation.x += .25 * (targetTiltX - ringsObject.rotation.x),
		ringsObject.rotation.z = ringsObject.rotation.z -= .25 * (targetTiltY + ringsObject.rotation.z)
}

let universeBgObject, universeBgTexture,
	universeBgMaterial, universeBgGeometry,
	universeBgMesh, universeCreated = !1;
function createUniverse(e) {
	universeBgTexture = new THREE.TextureLoader().load("img/universe.jpg"),
		universeBgTexture.anisotropy = 16,
		universeBgGeometry = new THREE.PlaneGeometry(1500, 750, 1, 1),
		universeBgMaterial = new THREE.MeshBasicMaterial({
			map: universeBgTexture,
			blending: THREE.AdditiveBlending,
			color: colorBase,
			transparent: !0,
			opacity: 0,
			fog: !1,
			side: THREE.DoubleSide,
			depthWrite: !1,
			depthTest: !1
		}),
		universeBgMesh = new THREE.Mesh(universeBgGeometry, universeBgMaterial),
		universeBgMesh.position.z = -400,
		universeBgMesh.name = "universeBgMesh",
		scene.add(universeBgMesh),
		universeCreated = !0,
		e && e()
}

let globeBufferGeometry, globeTexture,
	globeInnerMaterial, globeOuterMaterial,
	globeInnerMesh, globeOuterMesh,
	globeShieldGeometry, globeShieldMaterial,
	globeShieldMesh, globeCloud,
	globeCloudBufferGeometry, globeCloudColors,
	globeCloudMaterial, globeGlowTexture,
	globeGlowMaterial, globeGlowBufferGeometry,
	globeGlowMesh,
	globeRadius = 65,
	globeMaxZoom = 90,
	globeMinZoom = 300,
	globeExtraDistance = .05,
	globeCloudVerticesArray = [],
	globeGlowSize = 200,
	globeGlowPositionZ = 0,
	globeCreated = !1;
function createGlobe(e) {
	globeBufferGeometry = new THREE.SphereBufferGeometry(globeRadius, 64, 64),
		globeTexture = new THREE.TextureLoader().load("img/map.png"),
		globeTexture.anisotropy = 16,
		globeInnerMaterial = new THREE.MeshBasicMaterial({
			map: globeTexture,
			color: colorBase75,
			transparent: !0,
			blending: THREE.AdditiveBlending,
			side: THREE.BackSide,
			fog: !0,
			depthWrite: !1,
			depthTest: !1
		}),
		globeInnerMaterial.needsUpdate = !0,
		globeInnerMesh = new THREE.Mesh(globeBufferGeometry, globeInnerMaterial),
		earthObject.add(globeInnerMesh),
		globeOuterMaterial = new THREE.MeshBasicMaterial({
			map: globeTexture,
			color: colorBase,
			transparent: !0,
			blending: THREE.AdditiveBlending,
			side: THREE.FrontSide,
			fog: !0,
			depthWrite: !1,
			depthTest: !1
		}),
		globeOuterMaterial.needsUpdate = !0,
		globeOuterMesh = new THREE.Mesh(globeBufferGeometry, globeOuterMaterial),
		earthObject.add(globeOuterMesh),
		globeShieldMaterial = new THREE.MeshPhongMaterial({
			color: colorBase75,
			transparent: !0,
			blending: THREE.AdditiveBlending,
			side: THREE.FrontSide,
			opacity: 0,
			fog: !1,
			depthWrite: !1, depthTest: !1
		}),
		globeShieldMesh = new THREE.Mesh(globeBufferGeometry, globeShieldMaterial),
		globeShieldMesh.name = "globeShieldMesh",
		scene.add(globeShieldMesh);
	let a = new Image;
	a.src = "img/map_inverted.png",
		a.onload = function () {
			let e = document.createElement("canvas");
			e.width = a.width,
				e.height = a.height;
			let t = e.getContext("2d");
			t.drawImage(a, 0, 0, a.width, a.height);
			for (var o = t.getImageData(0, 0, e.width, e.height), n = 0; n < o.data.length; n += 4) {
				let r = n / 4 % e.width,
					s = (n / 4 - r) / e.width;
				if (1 == n / 4 % 2 && 1 == s % 2) {
					let l = o.data[n]; if (0 === l) {
						let d = (s / (e.height / 180) - 90) / -1, A = r / (e.width / 360) - 180,
							p = latLongToVector3(d, A, globeRadius, -.1);
						globeCloudVerticesArray.push(p)
					}
				}
			}
			globeCloudBufferGeometry = new THREE.BufferGeometry;
			for (var m = new Float32Array(3 * globeCloudVerticesArray.length), n = 0; n < globeCloudVerticesArray.length; n++) {
				m[3 * n] = globeCloudVerticesArray[n].x,
					m[3 * n + 1] = globeCloudVerticesArray[n].y,
					m[3 * n + 2] = globeCloudVerticesArray[n].z;
			}
			globeCloudBufferGeometry.addAttribute("position", new THREE.BufferAttribute(m, 3)),
				globeCloudMaterial = new THREE.PointsMaterial({
					size: .75,
					fog: !0,
					vertexColors: THREE.VertexColors,
					depthWrite: !1
				});
			for (var u = new Float32Array(3 * globeCloudVerticesArray.length), c = [], n = 0; n < globeCloudVerticesArray.length; n++) {
				let S = .01 * generateRandomNumber(80, 90),
					g = shadeBlend(S, colorPrimary_Base, colorDarken);
				c[n] = new THREE.Color(g)
			}
			for (var n = 0; n < globeCloudVerticesArray.length; n++) {
				u[3 * n] = c[n].r,
					u[3 * n + 1] = c[n].g,
					u[3 * n + 2] = c[n].b
			}
			globeCloudBufferGeometry.addAttribute("color", new THREE.BufferAttribute(u, 3)),
				globeCloudBufferGeometry.colorsNeedUpdate = !0,
				globeCloud = new THREE.Points(globeCloudBufferGeometry, globeCloudMaterial),
				globeCloud.sortParticles = !0,
				globeCloud.name = "globeCloud",
				earthObject.add(globeCloud)
		},
		globeGlowSize = 200,
		globeGlowTexture = new THREE.TextureLoader().load("img/earth-glow.jpg"),
		globeGlowTexture.anisotropy = 2,
		globeGlowTexture.wrapS = globeGlowTexture.wrapT = THREE.RepeatWrapping,
		globeGlowTexture.magFilter = THREE.NearestFilter,
		globeGlowTexture.minFilter = THREE.NearestMipMapNearestFilter,
		globeGlowBufferGeometry = new THREE.PlaneBufferGeometry(globeGlowSize, globeGlowSize, 1, 1),
		globeGlowMaterial = new THREE.MeshBasicMaterial({
			map: globeGlowTexture,
			color: colorBase,
			transparent: !0,
			opacity: 0,
			fog: !1,
			blending: THREE.AdditiveBlending,
			depthWrite: !1
		}),
		globeGlowMesh = new THREE.Mesh(globeGlowBufferGeometry, globeGlowMaterial),
		globeGlowMesh.name = "globeGlowMesh",
		scene.add(globeGlowMesh),
		globeCreated = !0,
		e && e();
}
function renderGlobe() {
	if (isGlobeEventsEnabled) {
		targetCameraZ < globeMaxZoom && (targetCameraZ = globeMaxZoom),
			targetCameraZ > globeMinZoom && (targetCameraZ = globeMinZoom),
			camera.position.z = camera.position.z += .01 * (targetCameraZ - camera.position.z);
		let e = camera.position.z;
		if (e < 200 && e > globeMaxZoom) {
			globeGlowPositionZ = 0 + 22 * ((200 - e) / 110)
		} else {
			globeGlowPositionZ = 0;
		}
		globeCloud.sortParticles = !0,
		globeGlowMesh.position.set(0, 0, globeGlowPositionZ)
	}
}
function showGlobe() {
	TweenMax.fromTo(universeBgMaterial, 4,
		{ opacity: 0 },
		{ opacity: 1, delay: 1, ease: Linear.easeNone }),
		TweenMax.fromTo(globeShieldMaterial, 3,
			{ opacity: 0 },
			{ opacity: .65, delay: 1, ease: Linear.easeNone }),
		TweenMax.fromTo(globeGlowMaterial, 3,
			{ opacity: 0 },
			{ opacity: 1, delay: 1, ease: Linear.easeNone }),
		TweenMax.fromTo(starsZoomObject.position, 6,
			{ z: 0 },
			{ z: 325, ease: Circ.easeInOut, onComplete: function () { starsZoomObject.visible = !1 } })
}
let dotObject, dotTexture,
	dotMaterial, dotHoverTexture,
	dotHoverMaterial, dotSpikesBufferGeometry,
	dotSpikesMaterial, dotSpikesMesh,
	dotSpikeHoverGeometry, dotSpikeHoverMaterial,
	dotSpikeHover,
	dotSpritesArray = [],
	dotDetailsArray = [],
	dotSpritesHoverArray = [],
	dotSpikesVerticesArray = [],
	dotSpikesCloudVerticesArray = [],
	dotsCreated = !1;
function createDots(e) {
	for (dotObject = new THREE.Group, dotObject.name = "dotObject", earthObject.add(dotObject),
		dotTexture = new THREE.TextureLoader().load("img/dot-inverted.png"),
		dotMaterial = new THREE.MeshBasicMaterial({
			map: dotTexture,
			color: colorHighlight,
			transparent: !0,
			blending: THREE.AdditiveBlending,
			side: THREE.DoubleSide,
			fog: !0,
			depthWrite: !1
		}),
		g = 0; g < dataMap.length; g++) {
		let a = dataMap[g][1],
			t = dataMap[g][2],
			o = dataMap[g][3],
			n = new THREE.PlaneBufferGeometry(1, 1, 1),
			r = new THREE.Mesh(n, dotMaterial);
		r.userData = { id: g };
		let s = .1;
		2 === a && (s += .05);
		var l = latLongToVector3(t, o, globeRadius, globeExtraDistance + s);
		r.position.set(l.x, l.y, l.z),
			r.lookAt(new THREE.Vector3(0, 0, 0));
		let d = 2; 2 === a && (d = 3),
			r.scale.set(d, d, d),
			dotDetailsArray.push({
				position: new THREE.Vector3(r.position.x, r.position.y, r.position.z),
				type: a
			}),
			dotSpritesArray.push(r),
			dotObject.add(r);
		var A = new THREE.MeshBasicMaterial({
			map: dotTexture,
			color: colorHighlight,
			transparent: !0,
			blending: THREE.AdditiveBlending,
			side: THREE.DoubleSide,
			opacity: 0,
			depthWrite: !1
		}),
			p = new THREE.Mesh(n, A),
			l = latLongToVector3(t, o, globeRadius, globeExtraDistance + s);
		p.position.set(l.x, l.y, l.z), p.lookAt(new THREE.Vector3(0, 0, 0)),
			p.visible = !1, dotSpritesHoverArray.push(p),
			dotObject.add(p)
	}
	for (g = 0; g < dotDetailsArray.length; g++) {
		let m = new THREE.Vector3;
		m.x = dotSpritesArray[g].position.x,
			m.y = dotSpritesArray[g].position.y,
			m.z = dotSpritesArray[g].position.z;
		let u = m.clone(),
			c = .01 * (4 * Math.random());
		2 === dotDetailsArray[g].type && u.multiplyScalar(1.12),
			1 === dotDetailsArray[g].type && u.multiplyScalar(1.02 + c),
			0 === dotDetailsArray[g].type && u.multiplyScalar(1.02 + c),
			dotSpikesVerticesArray.push(m),
			dotSpikesVerticesArray.push(u),
			dotSpikesCloudVerticesArray.push(u)
	}
	for (var S = new Float32Array(3 * dotSpikesVerticesArray.length),
		g = 0; g < dotSpikesVerticesArray.length; g++) {
		S[3 * g] = dotSpikesVerticesArray[g].x,
			S[3 * g + 1] = dotSpikesVerticesArray[g].y, S[3 * g + 2] = dotSpikesVerticesArray[g].z;
	}
	dotSpikesMaterial = new THREE.LineBasicMaterial({
		linewidth: 1,
		color: colorHighlight,
		transparent: !0,
		blending: THREE.AdditiveBlending,
		fog: !0,
		depthWrite: !1
	}),
		dotSpikesBufferGeometry = new THREE.BufferGeometry,
		dotSpikesBufferGeometry.addAttribute("position", new THREE.BufferAttribute(S, 3)),
		dotSpikesMesh = new THREE.LineSegments(dotSpikesBufferGeometry, dotSpikesMaterial),
		dotObject.add(dotSpikesMesh);
	let U = [];
	for (g = 0; g < dotSpikesCloudVerticesArray.length; g++) {
		let m = new THREE.Vector3;
		m = dotSpikesCloudVerticesArray[g];
		let u = m.clone();
		u.multiplyScalar(1.0025),
			U.push(m),
			U.push(u)
	}
	for (var S = new Float32Array(3 * U.length), g = 0; g < U.length; g++) {
		S[3 * g] = U[g].x,
			S[3 * g + 1] = U[g].y,
			S[3 * g + 2] = U[g].z;
	}
	dotSpikesExtraMaterial = new THREE.LineBasicMaterial({
		linewidth: 1,
		color: 16777215,
		transparent: !0,
		blending: THREE.AdditiveBlending,
		fog: !0,
		depthWrite: !1
	}),
		dotSpikesExtraBufferGeometry = new THREE.BufferGeometry,
		dotSpikesExtraBufferGeometry.addAttribute("position", new THREE.BufferAttribute(S, 3)),
		dotSpikesExtraMesh = new THREE.LineSegments(dotSpikesExtraBufferGeometry, dotSpikesExtraMaterial),
		dotObject.add(dotSpikesExtraMesh),
		dotsCreated = !0, e && e()
}
function renderDots() {
	let e = camera.position.z,
		a = 0;
	if (e < 200 && e > globeMaxZoom) {
		a = 1.25 * ((200 - e) / 110)
	}
	for (i = 0; i < dotDetailsArray.length; i++) {
		let t = 2;
		2 === dotDetailsArray[i].type && (t = 3),
			dotSpritesArray[i].scale.set(t - a, t - a, 1)
	}
}
let mediaObject, mediaTexture,
	mediaMaterial, mediaCloud,
	mediaSpritesArray = [],
	mediaDetailsArray = [],
	mediaVerticesArray = [],
	mediaCreated = !1;
function createMedia(e) {
	for (mediaObject = new THREE.Group,
		mediaObject.name = "mediaObject",
		earthObject.add(mediaObject),
		l = 0; l < dataMedia.length; l++) {
		let a = dataMedia[l][0],
			t = dataMedia[l][2],
			o = dataMedia[l][3],
			n = .1 * (Math.floor(20 * Math.random()) + 1),
			r = latLongToVector3(t, o, globeRadius, globeExtraDistance + 8 + n);
		mediaVerticesArray.push(r),
			mediaDetailsArray.push({ position: new THREE.Vector3(r.x, r.y, r.z), type: a })
	}
	mediaTexture = new THREE.TextureLoader().load("img/photo.png"),
		mediaMaterial = new THREE.PointsMaterial({
			map: mediaTexture,
			size: 0,
			transparent: !0,
			blending: THREE.AdditiveBlending,
			color: 16777215, depthWrite: !1
		}),
		mediaMaterial.needsUpdate = !0;
	for (var s = new Float32Array(3 * mediaVerticesArray.length), l = 0; l < mediaVerticesArray.length; l++) {
		s[3 * l] = mediaVerticesArray[l].x, s[3 * l + 1] = mediaVerticesArray[l].y,
			s[3 * l + 2] = mediaVerticesArray[l].z;
	}
	mediaBufferGeometry = new THREE.BufferGeometry,
		mediaBufferGeometry.addAttribute("position", new THREE.BufferAttribute(s, 3)),
		mediaCloud = new THREE.Points(mediaBufferGeometry, mediaMaterial),
		mediaCloud.sortParticles = !0, mediaObject.add(mediaCloud),
		mediaCreated = !0,
		e && e()
}
function renderMedia() {
	let e = camera.position.z;
	if (e < 200 && e > globeMaxZoom) {
		mediaMaterial.size = 1.25 * ((200 - e) / 110),
			mediaMaterial.needsUpdate = !0
	}
}
let starsObject1, starsObject2,
	starsObjectZoom, starsCloud1,
	starsCloud2, starsMaterial,
	starsZoomObject, starZoomTexture,
	starsZoomMaterial, starsZoomBufferGeometry,
	starsCenter = new THREE.Vector3(0, 0, 0),
	starsTotal = 500,
	starsMaxDistance = 400,
	starsMinDistance = 100,
	starsVerticesArray = [],
	starsSize = 1,
	starsZoomTotal = 150,
	starsZoomMaxDistance = 200,
	starsZoomBuffer = 0,
	starsZoomVerticesArray = [],
	starsCreated = !1;
function createStars(e) {
	for (starsObject1 = new THREE.Group,
		starsObject1.name = "starsObject1",
		scene.add(starsObject1),
		starsObject2 = new THREE.Group,
		starsObject2.name = "starsObject2",
		scene.add(starsObject2),
		r = 0; r < starsTotal; r++) {
		let a = new THREE.Vector3;
		a.x = Math.random() * starsMaxDistance - 200,
			a.y = 150 * Math.random() - 75,
			a.z = Math.random() * starsMaxDistance - 200;
		let t = checkDistance(starsCenter, a),
			o = starsMinDistance;
		t < o && (a.x < o && (a.x = o), a.y < o && (a.y = o), a.z < o && (a.z = o)),
			starsVerticesArray.push(a)
	}
	starsMaterial = new THREE.PointsMaterial({
		size: starsSize,
		sizeAttenuation: !1,
		color: colorBase,
		fog: !0
	}),
		starsMaterial.needsUpdate = !0;
	for (var n = new Float32Array(3 * starsVerticesArray.length),
		r = 0; r < starsVerticesArray.length; r++) {
		n[3 * r] = starsVerticesArray[r].x,
			n[3 * r + 1] = starsVerticesArray[r].y,
			n[3 * r + 2] = starsVerticesArray[r].z;
	}
	for (starsBufferGeometry = new THREE.BufferGeometry,
		starsBufferGeometry.addAttribute("position", new THREE.BufferAttribute(n, 3)),
		starsCloud1 = new THREE.Points(starsBufferGeometry, starsMaterial),
		starsCloud1.sortParticles = !0,
		starsObject1.add(starsCloud1),
		starsCloud2 = new THREE.Points(starsBufferGeometry, starsMaterial),
		starsCloud2.sortParticles = !0,
		starsObject2.add(starsCloud2),
		starsObject2.rotation.x = 180 * toRAD,
		starsZoomObject = new THREE.Group,
		starsZoomObject.name = "starsObjectZoom",
		scene.add(starsZoomObject),
		starZoomTexture = new THREE.TextureLoader().load("img/star.jpg"),
		r = 0; r < starsZoomTotal; r++) {
		let a = new THREE.Vector3;
		a.x = Math.random() * starsZoomMaxDistance - 100,
			a.y = Math.random() * starsZoomMaxDistance - 100,
			a.z = starsZoomBuffer + 500 * Math.random(),
			starsZoomVerticesArray.push(a)
	}
	starsZoomMaterial = new THREE.PointsMaterial({
		map: starZoomTexture,
		transparent: !0,
		blending: THREE.AdditiveBlending,
		size: 5,
		color: colorBase,
		fog: !0
	});
	for (var n = new Float32Array(3 * starsZoomVerticesArray.length),
		r = 0; r < starsZoomVerticesArray.length; r++) {
		n[3 * r] = starsZoomVerticesArray[r].x,
			n[3 * r + 1] = starsZoomVerticesArray[r].y,
			n[3 * r + 2] = starsZoomVerticesArray[r].z;
	}
	starsZoomBufferGeometry = new THREE.BufferGeometry,
		starsZoomBufferGeometry.addAttribute("position", new THREE.BufferAttribute(n, 3)),
		starsZoomCloud = new THREE.Points(starsZoomBufferGeometry, starsZoomMaterial),
		starsZoomCloud.sortParticles = !0,
		starsZoomObject.add(starsZoomCloud),
		starsCreated = !0, e && e()
}
function renderStars() {
	starsObject1.rotation.y += 25e-5,
		starsObject2.rotation.y += 25e-5
}
let arcRocketObject, arcRocketBufferGeometry,
	arcRocketShaderUniforms, arcRocketShaderMaterial,
	arcRocketMesh, arcRocketAnimation,
	lineBufferSpeed = .025,
	lineBufferDivisions = 25,
	snakeBufferSpeed = 3 * (lineBufferSpeed * lineBufferDivisions),
	arcRocketDetailsArray = [],
	arcRocketVerticesArray = [],
	arcRocketCreated = !1;
function createArcsRocket(e) {
	for (arcRocketObject = new THREE.Group,
		arcRocketObject.name = "arcsRocket",
		c = 0; c < dataMap.length - 1; c++) {
		let a = latLongToVector3(dataMap[0][2], dataMap[0][3], globeRadius, globeExtraDistance),
			t = latLongToVector3(dataMap[c + 1][2], dataMap[c + 1][3], globeRadius, globeExtraDistance),
			o = 1 + .006 * checkDistance(a, t),
			n = new THREE.Vector3;
		n.addVectors(a, t),
			n.normalize().multiplyScalar(globeRadius * o);
		let r = 1 + .006 * checkDistance(a, n),
			s = new THREE.Vector3;
		s.addVectors(a, n),
			s.normalize().multiplyScalar(globeRadius * r);
		let l = new THREE.Vector3;
		l.addVectors(n, t),
			l.normalize().multiplyScalar(globeRadius * r);
		for (var d = new THREE.CubicBezierCurve3(a, s, l, t),
			A = d.getPoints(lineBufferDivisions),
			p = 0; p < lineBufferDivisions; p++) {
			arcRocketVerticesArray.push(A[p]),
				arcRocketDetailsArray.push({ alpha: 0 }),
				arcRocketVerticesArray.push(A[p + 1]),
				arcRocketDetailsArray.push({ alpha: 0 })
		}
	}
	arcRocketBufferGeometry = new THREE.BufferGeometry,
		arcRocketShaderUniforms = {
			color: { value: colorHighlight },
			fogColor: { type: "c", value: scene.fog.color },
			fogNear: { type: "f", value: scene.fog.near },
			fogFar: { type: "f", value: scene.fog.far }
		},
		arcRocketShaderMaterial = new THREE.ShaderMaterial({
			uniforms: arcRocketShaderUniforms,
			vertexShader: document.getElementById("line_vertexshader").textContent,
			fragmentShader: document.getElementById("line_fragmentshader").textContent,
			blending: THREE.AdditiveBlending, depthTest: !1, fog: !0, transparent: !0
		});
	for (var m = new Float32Array(3 * arcRocketVerticesArray.length),
		u = new Float32Array(arcRocketVerticesArray.length),
		c = 0; c < arcRocketVerticesArray.length; c++) {
		m[3 * c] = arcRocketVerticesArray[c].x,
			m[3 * c + 1] = arcRocketVerticesArray[c].y,
			m[3 * c + 2] = arcRocketVerticesArray[c].z, u[c] = 0;
	}
	arcRocketBufferGeometry.addAttribute("position", new THREE.BufferAttribute(m, 3)),
		arcRocketBufferGeometry.addAttribute("alpha", new THREE.BufferAttribute(u, 1)),
		arcRocketMesh = new THREE.LineSegments(arcRocketBufferGeometry, arcRocketShaderMaterial),
		arcRocketObject.add(arcRocketMesh),
		arcRocketObject.visible = !1,
		arcRocketCreated = !0,
		arcRocketAnimation = new TimelineMax({
			paused: !0,
			repeat: -1,
			onUpdate: function () { renderArcsRocket() }
		}),
		arcRocketAnimation.staggerTo(arcRocketDetailsArray, .25, { alpha: 0 }, .025, 2),
		arcRocketAnimation.staggerFromTo(arcRocketDetailsArray, .25, { alpha: 0 }, { alpha: 1 }, .025, 0),
		arcRocketAnimation.timeScale(2),
		e && e()
}
function renderArcsRocket() {
	if (arcRocketCreated) {
		for (var e, a = arcRocketBufferGeometry.attributes,
			t = 0; t < arcRocketDetailsArray.length; t++) {
			e = arcRocketDetailsArray[t],
				a.alpha.array[t] = e.alpha; a.alpha.needsUpdate = !0
		}
	}
}
let arcSnakeObject, arcSnakeBufferGeometry,
	arcSnakeShaderUniforms, arcSnakeShaderMaterial,
	arcSnakeMesh, arcSnakeAnimation,
	arcSnakeDetailsArray = [],
	arcSnakeVerticesArray = [],
	arcSnakeCreated = !1;
function createArcsSnake(e) {
	for (arcSnakeObject = new THREE.Group, arcSnakeObject.name = "arcsSnake",
		c = 0; c < dataMap.length - 1; c++) {
		let a = latLongToVector3(dataMap[c][2], dataMap[c][3], globeRadius, globeExtraDistance),
			t = latLongToVector3(dataMap[c + 1][2], dataMap[c + 1][3], globeRadius, globeExtraDistance),
			o = 1 + .0065 * checkDistance(a, t),
			n = new THREE.Vector3;
		n.addVectors(a, t),
			n.normalize().multiplyScalar(globeRadius * o);
		let r = 1 + .0065 * checkDistance(a, n),
			s = new THREE.Vector3;
		s.addVectors(a, n),
			s.normalize().multiplyScalar(globeRadius * r);
		let l = new THREE.Vector3;
		l.addVectors(n, t), l.normalize().multiplyScalar(globeRadius * r);
		for (var d = new THREE.CubicBezierCurve3(a, s, l, t), A = d.getPoints(lineBufferDivisions),
			p = 0; p < lineBufferDivisions; p++) {
			arcSnakeVerticesArray.push(A[p]), arcSnakeDetailsArray.push({ alpha: 0 })
		}
	}
	arcSnakeBufferGeometry = new THREE.BufferGeometry,
		arcSnakeShaderUniforms = {
			color: { value: colorHighlight },
			fogColor: { type: "c", value: scene.fog.color },
			fogNear: { type: "f", value: scene.fog.near },
			fogFar: { type: "f", value: scene.fog.far }
		},
		arcSnakeShaderMaterial = new THREE.ShaderMaterial({
			uniforms: arcSnakeShaderUniforms,
			vertexShader: document.getElementById("line_vertexshader").textContent,
			fragmentShader: document.getElementById("line_fragmentshader").textContent,
			blending: THREE.AdditiveBlending,
			depthTest: !1,
			fog: !0,
			transparent: !0
		});
	for (var m = new Float32Array(3 * arcSnakeVerticesArray.length),
		u = new Float32Array(arcSnakeVerticesArray.length),
		c = 0; c < arcSnakeVerticesArray.length; c++) {
		m[3 * c] = arcSnakeVerticesArray[c].x,
			m[3 * c + 1] = arcSnakeVerticesArray[c].y,
			m[3 * c + 2] = arcSnakeVerticesArray[c].z,
			u[c] = 0;
	}
	for (arcSnakeBufferGeometry.addAttribute("position", new THREE.BufferAttribute(m, 3)),
		arcSnakeBufferGeometry.addAttribute("alpha", new THREE.BufferAttribute(u, 1)),
		arcSnakeMesh = new THREE.Line(arcSnakeBufferGeometry, arcSnakeShaderMaterial),
		arcSnakeObject.add(arcSnakeMesh),
		earthObject.add(arcSnakeObject),
		arcSnakeCreated = !0,
		arcSnakeAnimation = new TimelineMax({
			paused: !0,
			delay: 2,
			repeat: -1,
			onUpdate: function () { renderArcsSnake() }
		}),
		c = 0; c < dotSpritesHoverArray.length; c++) {
		let S = dotSpritesHoverArray[c];
		arcSnakeAnimation.fromTo(S.scale, 1,
			{ x: 2, y: 2 },
			{ x: 10, y: 10, ease: Expo.easeOut }, .025 * lineBufferDivisions * c),
			arcSnakeAnimation.fromTo(S.material, 1.5,
				{ opacity: 1 },
				{ opacity: 0 }, .025 * lineBufferDivisions * c),
			arcSnakeAnimation.fromTo(S, 1.5, {},
				{
					onStart: function () { this.target.visible = !0 },
					onComplete: function () { this.target.visible = !1 }
				}, .025 * lineBufferDivisions * c)
	}
	arcSnakeAnimation.staggerTo(arcSnakeDetailsArray, .25,
		{ alpha: 0 }, .025, 2),
		arcSnakeAnimation.staggerFromTo(arcSnakeDetailsArray, .25,
			{ alpha: 0 },
			{ alpha: 1 }, .025, 0),
		e && e()
}
function renderArcsSnake() {
	if (arcSnakeCreated) {
		for (var e, a = arcSnakeBufferGeometry.attributes,
			t = 0; t < arcSnakeDetailsArray.length; t++) {
			e = arcSnakeDetailsArray[t],
				a.alpha.array[t] = e.alpha;
		}
		a.alpha.needsUpdate = !0
	}
}
let arcAllObject, arcAllBufferGeometry,
	arcAllMaterial, arcAllMesh,
	arcAllAnimation, arcAllsVerticesArray = [],
	arcAllCreated = !1;
function createArcsAll(e) {
	for (arcAllObject = new THREE.Group,
		arcAllObject.name = "arcsAll", u = 0; u < dataMap.length - 1; u++) {
		let a = latLongToVector3(dataMap[0][2],
			dataMap[0][3], globeRadius,
			globeExtraDistance),
			t = latLongToVector3(dataMap[u + 1][2], dataMap[u + 1][3], globeRadius, globeExtraDistance),
			o = 1 + .005 * checkDistance(a, t),
			n = new THREE.Vector3;
		n.addVectors(a, t),
			n.normalize().multiplyScalar(globeRadius * o);
		let r = 1 + .005 * checkDistance(a, n),
			s = new THREE.Vector3;
		s.addVectors(a, n),
			s.normalize().multiplyScalar(globeRadius * r);
		let l = new THREE.Vector3;
		l.addVectors(n, t),
			l.normalize().multiplyScalar(globeRadius * r);
		for (var d = new THREE.CubicBezierCurve3(a, s, l, t),
			A = d.getPoints(lineBufferDivisions), p = 0; p < lineBufferDivisions; p++) {
			arcAllsVerticesArray.push(A[p]),
				arcAllsVerticesArray.push(A[p + 1])
		}
	}
	arcAllMaterial = new THREE.LineBasicMaterial({
		linewidth: 1,
		color: colorHighlight,
		transparent: !0,
		blending: THREE.AdditiveBlending,
		fog: !0, depthWrite: !1
	});
	for (var m = new Float32Array(3 * arcAllsVerticesArray.length),
		u = 0; u < arcAllsVerticesArray.length; u++) {
		m[3 * u] = arcAllsVerticesArray[u].x,
			m[3 * u + 1] = arcAllsVerticesArray[u].y,
			m[3 * u + 2] = arcAllsVerticesArray[u].z;
	}
	arcAllBufferGeometry = new THREE.BufferGeometry,
		arcAllBufferGeometry.addAttribute("position", new THREE.BufferAttribute(m, 3)),
		arcAllMesh = new THREE.LineSegments(arcAllBufferGeometry, arcAllMaterial),
		arcAllObject.add(arcAllMesh),
		arcAllObject.visible = !1,
		arcAllAnimation = new TimelineMax({ paused: !0 }),
		arcAllAnimation.fromTo(arcAllMesh.material, 2,
			{ opacity: 0 },
			{ opacity: 1 }, 0),
		arcAllAnimation.timeScale(1), arcAllCreated = !0,
		e && e()
}
let spikesObject, spikesBufferGeometry,
	spikesMaterial, spikesMesh,
	spikeRadius = 95,
	spikesVerticesArray = [],
	spikesCreated = !1;
function createSpikes(e) {
	spikesObject = new THREE.Group,
		spikesObject.name = "spikesObject",
		rotationObject.add(spikesObject);
	let a = new THREE.SphereGeometry(105, 8, 4);
	for (a.mergeVertices(), s = 0; s < a.vertices.length; s++) {
		let t = new THREE.Vector3;
		t.x = a.vertices[s].x,
			t.y = a.vertices[s].y,
			t.z = a.vertices[s].z,
			t.normalize(),
			t.multiplyScalar(105);
		let o = t.clone();
		o.multiplyScalar(1.03),
			spikesVerticesArray.push(t),
			spikesVerticesArray.push(o)
	}
	let n = 2 * Math.PI / 400;
	for (s = 0; s < 400; s++) {
		let t = new THREE.Vector3;
		t.x = spikeRadius * Math.cos(n * s),
			t.y = 0,
			t.z = spikeRadius * Math.sin(n * s),
			t.normalize(),
			t.multiplyScalar(spikeRadius);
		var o = t.clone();
		1 == s % 10 ? o.multiplyScalar(1.02) : o.multiplyScalar(1.01),
			spikesVerticesArray.push(t),
			spikesVerticesArray.push(o)
	}
	for (var r = new Float32Array(3 * spikesVerticesArray.length),
		s = 0; s < spikesVerticesArray.length; s++) {
		r[3 * s] = spikesVerticesArray[s].x,
			r[3 * s + 1] = spikesVerticesArray[s].y,
			r[3 * s + 2] = spikesVerticesArray[s].z;
	}
	spikesMaterial = new THREE.LineBasicMaterial({
		linewidth: 1,
		color: colorBase50,
		transparent: !0,
		blending: THREE.AdditiveBlending,
		side: THREE.DoubleSide,
		fog: !0, depthWrite: !1
	}),
		spikesBufferGeometry = new THREE.BufferGeometry,
		spikesBufferGeometry.addAttribute("position", new THREE.BufferAttribute(r, 3)),
		spikesMesh = new THREE.LineSegments(spikesBufferGeometry, spikesMaterial),
		spikesObject.add(spikesMesh),
		spikesCreated = !0,
		e && e()
}
let ringPulseObject, ringPulseBufferGeometry,
	ringPulsetShaderUniforms, ringPulseShaderMaterial,
	ringPulseMesh, ringExplosionTexture,
	ringExplosionMaterial, ringExplosionBufferGeometry,
	ringExplosionMesh, ringPointGeometry,
	ringPointMaterial, ringPointMesh,
	ringPulseTotal = 250,
	ringPulseTotalHalf = 125,
	ringPulseAngle = 2 * Math.PI / 250,
	ringPulseRadius = 90,
	ringPulseVerticesArray = [],
	ringExplosionSize = 100,
	ringPointRadius = 85,
	ringPointTotal = 250,
	ringPointAngle = 2 * Math.PI / 250,
	ringPointSize = .5,
	ringPulseCreated = !1;
function createRingPulse(e) {
	for (ringPulseObject = new THREE.Group, ringPulseObject.name = "ringPulse",
		r = 0; r < ringPulseTotal; r++) {
		let a = new THREE.Vector3;
		a.x = ringPulseRadius * Math.cos(ringPulseAngle * r),
			a.y = 0, a.z = ringPulseRadius * Math.sin(ringPulseAngle * r),
			a.normalize(),
			a.multiplyScalar(ringPulseRadius),
			ringPulseVerticesArray.push(a)
	}
	ringPulseBufferGeometry = new THREE.BufferGeometry,
		ringPulseShaderUniforms = {
			color: { value: colorBase },
			fogColor: { type: "c", value: scene.fog.color },
			fogNear: { type: "f", value: scene.fog.near },
			fogFar: { type: "f", value: scene.fog.far }
		},
		ringPulseShaderMaterial = new THREE.ShaderMaterial({
			uniforms: ringPulseShaderUniforms,
			vertexShader: document.getElementById("line_vertexshader").textContent,
			fragmentShader: document.getElementById("line_fragmentshader").textContent,
			blending: THREE.AdditiveBlending,
			depthTest: !1,
			fog: !0,
			transparent: !0
		});
	for (var t = new Float32Array(3 * ringPulseVerticesArray.length),
		o = new Float32Array(ringPulseVerticesArray.length),
		n = .5,
		r = 0; r < ringPulseVerticesArray.length; r++) {
		t[3 * r] = ringPulseVerticesArray[r].x,
			t[3 * r + 1] = ringPulseVerticesArray[r].y,
			t[3 * r + 2] = ringPulseVerticesArray[r].z;
		let s = 0,
			l = ringPulseTotalHalf / 2;
		r < ringPulseTotalHalf && (r < l ? s = r / l * n : s = 1 - r / l * n),
			o[r] = s
	}
	for (ringPulseBufferGeometry.addAttribute("position", new THREE.BufferAttribute(t, 3)),
		ringPulseBufferGeometry.addAttribute("alpha", new THREE.BufferAttribute(o, 1)),
		ringPulseMesh = new THREE.LineLoop(ringPulseBufferGeometry, ringPulseShaderMaterial),
		ringPulseObject.add(ringPulseMesh),
		rotationObject.add(ringPulseObject),
		ringExplosionTexture = new THREE.TextureLoader().load("img/ring_explosion.jpg"),
		ringExplosionBufferGeometry = new THREE.PlaneBufferGeometry(ringExplosionSize, ringExplosionSize, 1, 1),
		ringExplosionMaterial = new THREE.MeshBasicMaterial({
			map: ringExplosionTexture,
			color: colorBase85,
			transparent: !0,
			blending: THREE.AdditiveBlending,
			side: THREE.DoubleSide,
			depthWrite: !1
		}),
		ringExplosionMesh = new THREE.Mesh(ringExplosionBufferGeometry, ringExplosionMaterial),
		ringExplosionMesh.rotation.x = 90 * toRAD,
		ringExplosionMesh.name = "ringExplosionMesh",
		ringExplosionMesh.visible = !1,
		rotationObject.add(ringExplosionMesh),
		ringPointGeometry = new THREE.Geometry,
		r = 0; r < ringPointTotal; r++) {
		let a = new THREE.Vector3;
		a.x = ringPointRadius * Math.cos(ringPointAngle * r),
			a.y = 0,
			a.z = ringPointRadius * Math.sin(ringPointAngle * r),
			ringPointGeometry.vertices.push(a)
	}
	ringPointMaterial = new THREE.PointsMaterial({
		size: ringPointSize,
		color: colorBase75,
		transparent: !0,
		blending: THREE.AdditiveBlending,
		side: THREE.DoubleSide,
		depthWrite: !1
	}),
		ringPointMesh = new THREE.Points(ringPointGeometry, ringPointMaterial),
		ringPointMesh.sortParticles = !0,
		rotationObject.add(ringPointMesh),
		ringPulseCreated = !0,
		e && e()
}
function renderRingPulse() { ringPulseObject.rotation.y += .025 }
let gyroscopeObject, gyroscopeGeometry,
	gyroscopeMaterial, gyroscopeMesh1,
	gyroscopeMesh2, gyroscopeMesh3,
	gyroscopeMesh4,
	gyroscopeRingSize = 90,
	gyroscopeRingThickness = 89,
	gyroscopeCreated = !1;
function createGyroscope(e) {
	gyroscopeObject = new THREE.Object3D,
		rotationObject.add(gyroscopeObject),
		gyroscopeGeometry = new THREE.RingGeometry(
			gyroscopeRingSize,
			gyroscopeRingThickness, 128),
		gyroscopeMaterial = new THREE.MeshBasicMaterial({
			color: colorHighlight,
			opacity: .25,
			transparent: !0,
			blending: THREE.AdditiveBlending,
			side: THREE.DoubleSide,
			fog: !0, depthWrite: !1
		}),
		gyroscopeMaterial.needsUpdate = !0,
		gyroscopeMesh1 = new THREE.Mesh(gyroscopeGeometry,
			new THREE.MeshBasicMaterial({
				color: colorBase,
				opacity: 0,
				transparent: !0,
				blending: THREE.AdditiveBlending,
				side: THREE.DoubleSide,
				fog: !0,
				depthWrite: !1
			})),
		gyroscopeMesh2 = new THREE.Mesh(gyroscopeGeometry,
			new THREE.MeshBasicMaterial({
				color: colorBase,
				opacity: 0,
				transparent: !0,
				blending: THREE.AdditiveBlending,
				side: THREE.DoubleSide,
				fog: !0, depthWrite: !1
			})),
		gyroscopeMesh3 = new THREE.Mesh(gyroscopeGeometry,
			new THREE.MeshBasicMaterial({
				color: colorBase,
				opacity: 0,
				transparent: !0,
				blending: THREE.AdditiveBlending,
				side: THREE.DoubleSide,
				fog: !0, depthWrite: !1
			})),
		gyroscopeMesh4 = new THREE.Mesh(gyroscopeGeometry,
			new THREE.MeshBasicMaterial({
				color: colorBase,
				opacity: 0,
				transparent: !0,
				blending: THREE.AdditiveBlending,
				side: THREE.DoubleSide,
				fog: !0,
				depthWrite: !1
			}));
	let a = new THREE.Object3D,
		t = new THREE.Object3D,
		i = new THREE.Object3D,
		o = new THREE.Object3D;
	a.rotation.x = 90 * toRAD,
		t.rotation.x = 90 * toRAD,
		i.rotation.x = 90 * toRAD,
		o.rotation.x = 90 * toRAD,
		a.rotation.y = 0 * toRAD,
		t.rotation.y = 0 * toRAD,
		i.rotation.y = 180 * toRAD,
		o.rotation.y = 0 * toRAD,
		a.rotation.z = 0 * toRAD,
		t.rotation.z = 90 * toRAD,
		i.rotation.z = 0 * toRAD,
		o.rotation.z = 270 * toRAD,
		a.add(gyroscopeMesh1),
		t.add(gyroscopeMesh2),
		i.add(gyroscopeMesh3),
		o.add(gyroscopeMesh4),
		gyroscopeObject.add(a),
		gyroscopeObject.add(t),
		gyroscopeObject.add(i),
		gyroscopeObject.add(o),
		gyroscopeCreated = !0,
		e && e()
}
function renderGyroscope() { }
let rainObject, rainCloud,
	rainGeometry, rainShaderMaterial,
	rainShaderUniforms,
	rainSize = 5,
	rainParticlesTotal = 50,
	rainRingRadius = 40,
	rainBuffer = 50,
	rainMaxDistance = 100,
	rainFadeDistance = 15,
	rainVelocityFactor = .0016,
	rainDetails = [],
	rainCreated = !1;
function createRain(e) {
	rainObject = new THREE.Group,
		rainObject.name = "rainObject",
		scene.add(rainObject),
		rainGeometry = new THREE.BufferGeometry,
		rainShaderUniforms = {
			color: { value: colorBase },
			texture: { value: new THREE.TextureLoader().load("img/dot-inverted.png") }
		},
		rainShaderMaterial = new THREE.ShaderMaterial({
			uniforms: rainShaderUniforms,
			vertexShader: document.getElementById("particle_vertexshader").textContent,
			fragmentShader: document.getElementById("particle_fragmentshader").textContent,
			transparent: !0,
			blending: THREE.AdditiveBlending,
			depthTest: !1
		});
	for (var a = new Float32Array(150), t = new Float32Array(150),
		o = new Float32Array(rainParticlesTotal), n = 2 * Math.PI / rainParticlesTotal,
		r = 0, s = 0; r < rainParticlesTotal; r++, s += 3) {
		let l = Math.random() * rainRingRadius,
			d = new THREE.Vector3;
		d.x = l * Math.cos(n * r),
			d.y = Math.random() * rainMaxDistance,
			d.z = l * Math.sin(n * r);
		let A = 150,
			p = Math.random() * rainSize, m = 1 * Math.random(),
			u = (rainMaxDistance - d.y) / rainMaxDistance;
		d.y += rainBuffer;
		let c = rainBuffer;
		0 == r % 2 && (d.y = -d.y, c = -c, A = -A),
			a[s + 0] = d.x,
			a[s + 1] = d.y,
			a[s + 2] = d.z,
			o[r] = p, t[r] = 1,
			rainDetails.push({
				origin: new THREE.Vector3(d.x, c, d.z),
				current: new THREE.Vector3(d.x, d.y, d.z),
				destination: new THREE.Vector3(d.x, A, d.z),
				size: p, alpha: m, velocity: (1 - u) * 2
			})
	}
	rainGeometry.addAttribute("position", new THREE.BufferAttribute(a, 3)),
		rainGeometry.addAttribute("size", new THREE.BufferAttribute(o, 1)),
		rainGeometry.addAttribute("alpha", new THREE.BufferAttribute(t, 1)),
		rainCloud = new THREE.Points(rainGeometry, rainShaderMaterial),
		rainObject.add(rainCloud),
		rainCreated = !0, e && e()
}
function renderRain() {
	rainObject.rotation.y += rainObject.rotation.z + .0075;
	for (var e, a = rainGeometry.attributes, t = 0, o = 0;
		t < rainDetails.length; t++, o += 3) {
		e = rainDetails[t],
			e.velocity += rainVelocityFactor,
			0 < e.current.y ? (e.current.y > e.destination.y &&
				(e.current.y = rainBuffer, e.velocity = 0),
				e.current.y += e.velocity) : 0 > e.current.y &&
			(e.current.y < e.destination.y &&
				(e.current.y = e.origin.y, e.velocity = 0),
				e.current.y -= e.velocity),
			a.position.array[o + 1] = e.current.y,
			0 < e.current.y ? e.alpha = (e.current.y - rainBuffer) /
				(e.origin.y - rainBuffer + rainFadeDistance) : 0 > e.current.y &&
			(e.alpha = (e.current.y + rainBuffer) /
				(e.origin.y + rainBuffer - rainFadeDistance)),
			1 < e.alpha && (e.alpha = 1),
			a.alpha.array[t] = e.alpha,
			a.size.array[t] = e.size * e.alpha;
	}
	a.position.needsUpdate = !0,
		a.alpha.needsUpdate = !0,
		a.size.needsUpdate = !0
}
let rendererPixi, stagePixi,
	minimapVizGroup, minimapDetails,
	minimapMaskGradient, minimapLines,
	minimapExtras1, minimapExtras2,
	minimapSpiral, minimapSpikesGroup,
	minimapBlipsGroup, minimapXArray,
	minimapBlipArray, minimapBgCreated = !1;
function createMinimapBg(e) {
	rendererPixi = new PIXI.autoDetectRenderer(1e3, 320, { transparent: !0, antialias: !0 }),
		stagePixi = new PIXI.Stage,
		$("#minimapBackground").append(rendererPixi.view),
		minimapVizGroup = new PIXI.Container,
		stagePixi.addChild(minimapVizGroup),
		minimapDetails = new PIXI.Sprite.fromImage("img/mapDetails.png"),
		minimapVizGroup.addChild(minimapDetails),
		minimapDetails.position.x = 0,
		minimapDetails.position.y = 0,
		minimapDetails.width = 1e3,
		minimapDetails.height = 320,
		minimapDetails.tint = 3394815,
		minimapMaskGradient = new PIXI.Sprite.fromImage("img/mapGradient2.png"),
		minimapVizGroup.addChild(minimapMaskGradient),
		minimapMaskGradient.position.x = 500,
		minimapMaskGradient.position.y = 160,
		minimapMaskGradient.width = 1e3,
		minimapMaskGradient.height = 320,
		minimapMaskGradient.pivot.x = 500,
		minimapMaskGradient.pivot.y = 160,
		minimapMaskGradient.scale.x = 0,
		minimapLines = new PIXI.Sprite.fromImage("img/mapLines.png"),
		minimapVizGroup.addChild(minimapLines),
		minimapLines.position.x = 0,
		minimapLines.position.y = 0,
		minimapLines.width = 1e3,
		minimapLines.height = 320,
		minimapLines.tint = 16777215,
		minimapLines.mask = minimapMaskGradient,
		minimapExtras1 = new PIXI.Sprite.fromImage("img/mapExtras1.png"),
		minimapVizGroup.addChild(minimapExtras1),
		minimapExtras1.pivot.x = 160,
		minimapExtras1.pivot.y = 160,
		minimapExtras1.position.x = 500,
		minimapExtras1.position.y = 160,
		minimapExtras1.alpha = 0,
		minimapExtras2 = new PIXI.Sprite.fromImage("img/mapExtras2.png"),
		minimapVizGroup.addChild(minimapExtras2),
		minimapExtras2.pivot.x = 160,
		minimapExtras2.pivot.y = 160,
		minimapExtras2.position.x = 500,
		minimapExtras2.position.y = 160,
		minimapExtras2.alpha = 0,
		minimapMaskCircle = new PIXI.Sprite.fromImage("img/mapCircles.png"),
		minimapVizGroup.addChild(minimapMaskCircle),
		minimapMaskCircle.position.x = 0,
		minimapMaskCircle.position.y = 0,
		minimapMaskCircle.width = 1e3,
		minimapMaskCircle.height = 320,
		minimapSpiral = new PIXI.Sprite.fromImage("img/mapGradient1.png"),
		minimapVizGroup.addChild(minimapSpiral),
		minimapSpiral.position.x = 500,
		minimapSpiral.position.y = 160,
		minimapSpiral.width = 1e3,
		minimapSpiral.height = 320,
		minimapSpiral.pivot.x = 500,
		minimapSpiral.pivot.y = 160,
		minimapSpiral.scale.x = .05,
		minimapSpiral.alpha = 0,
		minimapSpiral.mask = minimapMaskCircle,
		minimapSpikesGroup = new PIXI.Container,
		minimapVizGroup.addChild(minimapSpikesGroup),
		minimapSpikesGroup.width = 320,
		minimapSpikesGroup.height = 320,
		minimapSpikesGroup.x = 500,
		minimapSpikesGroup.y = 160,
		minimapSpikesGroup.scale.x = 0,
		minimapSpikesGroup.scale.y = 0;
	let a = new PIXI.Graphics;
	minimapSpikesGroup.addChild(a),
		a.beginFill(16777215, 1),
		a.drawRect(0, 0, 1, 35),
		a.endFill(),
		a.pivot.x = .5,
		a.pivot.y = 35,
		a.rotation = 45 * toRAD,
		a.position.x = -90,
		a.position.y = 90;
	let t = new PIXI.Graphics;
	minimapSpikesGroup.addChild(t),
		t.beginFill(16777215, 1),
		t.drawRect(0, 0, 1, 35),
		t.endFill(),
		t.pivot.x = .5,
		t.pivot.y = 35,
		t.rotation = 135 * toRAD,
		t.position.x = -90,
		t.position.y = -90;
	let i = new PIXI.Graphics;
	minimapSpikesGroup.addChild(i),
		i.beginFill(16777215, 1),
		i.drawRect(0, 0, 1, 35),
		i.endFill(),
		i.pivot.x = .5,
		i.pivot.y = 35,
		i.rotation = 225 * toRAD,
		i.position.x = 90,
		i.position.y = -90;
	let o = new PIXI.Graphics;
	minimapSpikesGroup.addChild(o),
		o.beginFill(16777215, 1),
		o.drawRect(0, 0, 1, 35),
		o.endFill(),
		o.pivot.x = .5,
		o.pivot.y = 35,
		o.rotation = 315 * toRAD,
		o.position.x = 90,
		o.position.y = 90,
		minimapBlipsGroup = new PIXI.Container,
		minimapVizGroup.addChild(minimapBlipsGroup),
		minimapBlipsGroup.width = 320,
		minimapBlipsGroup.height = 320,
		minimapBlipsGroup.x = 500,
		minimapBlipsGroup.y = 160,
		minimapBlipsGroup.scale.x = 0,
		minimapBlipsGroup.scale.y = 0;
	let n = new PIXI.Graphics;
	n.beginFill(16777215),
		n.drawCircle(0, 0, 1),
		n.endFill(),
		n.position.x = -95,
		n.position.y = -95,
		minimapBlipsGroup.addChild(n);
	let r = new PIXI.Graphics;
	r.beginFill(16777215),
		r.drawCircle(0, 0, 1),
		r.endFill(),
		r.position.x = 95,
		r.position.y = -95,
		minimapBlipsGroup.addChild(r);
	let s = new PIXI.Graphics;
	s.beginFill(16777215),
		s.drawCircle(0, 0, 1),
		s.endFill(),
		s.position.x = -95,
		s.position.y = 95,
		minimapBlipsGroup.addChild(s);
	let l = new PIXI.Graphics;
	l.beginFill(16777215),
		l.drawCircle(0, 0, 1),
		l.endFill(),
		l.position.x = 95,
		l.position.y = 95,
		minimapBlipsGroup.addChild(l),
		minimapXArray = [a, t, i, o],
		minimapBlipArray = [n, r, s, l],
		minimapBgCreated = !0,
		e && e()
}
function renderMinimapBg() { rendererPixi.render(stagePixi) }
function checkDistance(e, a) {
	return Math.sqrt((a.x - e.x) * (a.x - e.x) + (a.y - e.y) * (a.y - e.y) + (a.z - e.z) * (a.z - e.z))
}
function latLongToVector3(e, a, t, i) {
	let o = e * Math.PI / 180,
		n = (a - 180) * Math.PI / 180,
		r = -(t + i) * Math.cos(o) * Math.cos(n),
		s = (t + i) * Math.sin(o),
		l = (t + i) * Math.cos(o) * Math.sin(n);
	return new THREE.Vector3(r, s, l)
}
function animate() { requestAnimationFrame(animate), render() }
let cameraDirection = "left",
	cameraTarget = "auto",
	rotationSpeed = { value: .001 },
	dragSpeed = .1,
	dragZone = 50,
	dragSpeedSlowZone = 90 + dragZone;
function render() {
	if (preloaderComplete) {
		if (renderer.render(scene, camera), isGlobeEventsEnabled &&
			(targetCameraZ < globeMaxZoom && (targetCameraZ = globeMaxZoom),
				targetCameraZ > globeMinZoom && (targetCameraZ = globeMinZoom),
				camera.position.z = camera.position.z += .01 * (targetCameraZ - camera.position.z)),
			targetCameraZ < dragSpeedSlowZone && (dragSpeed = .025),
			isGlobeRotated && (targetRotationX > 75 * toRAD && (targetRotationX = 75 * toRAD),
				targetRotationX < -75 * toRAD && (targetRotationX = -75 * toRAD),
				rotationObject.rotation.x = rotationObject.rotation.x +=
				(targetRotationX - rotationObject.rotation.x) * dragSpeed,
				rotationObject.rotation.y = rotationObject.rotation.y +=
				(targetRotationY - rotationObject.rotation.y) * dragSpeed),
			"auto" == cameraTarget && isGlobeRotated)
			if (isMouseDown || isParticleHit || isMediaHit);
			else "left" === cameraDirection ? targetRotationY += rotationSpeed.value : "right" ===
				cameraDirection ? targetRotationY -= rotationSpeed.value : void 0;
		globeCreated && renderGlobe(),
			dotsCreated && renderDots(),
			mediaCreated && renderMedia(),
			starsCreated && renderStars(),
			ringPulseCreated && renderRingPulse(),
			gyroscopeCreated && renderGyroscope(),
			rainCreated && renderRain(),
			ringsCreated && renderRings(),
			minimapBgCreated && renderMinimapBg(),
			"cycle" == colorTypeCurrent && setColors("cycle"),
			checkHover()
	}
}
let currentLocationTitle = "";
function checkHover() {
	if (isMouseMoved) {
		globeRaycaster.setFromCamera(mouse, camera);
		var e = globeRaycaster.intersectObjects(dotSpritesArray, !0),
			a = 0 < e.length ? e[0] : null;
		if (0 < e.length) {
			let t = dataMap[a.object.userData.id][4],
				i = dotSpritesHoverArray[a.object.userData.id];
			isParticleHit && t == currentLocationTitle ||
				(currentLocationTitle = t,
					isParticleHit = !0,
					showTooltip(),
					!TweenMax.isTweening(i.scale) &&
					(TweenMax.fromTo(i.scale, 1,
						{ x: 2, y: 2 },
						{ x: 10, y: 10, ease: Expo.easeOut }
					),
						TweenMax.fromTo(i.material, 1.5,
							{ opacity: 1 },
							{
								opacity: 0, onStart: function () { i.visible = !0 },
								onComplete: function () { i.visible = !1 }
							}
						)
					)
				)
		} else currentLocationTitle = "", isParticleHit = !1,
			isMediaHit || hideTooltip();
		var e = globeRaycaster.intersectObject(mediaCloud, !0),
			a = 0 < e.length ? e[0] : null;
		if (0 < e.length) {
			let t = "<b>" + dataMedia[a.index][0] + "</b> - " + dataMedia[a.index][4];
			currentLocationTitle = t,
				isMediaHit || (isMediaHit = !0),
				showTooltip()
		} else currentLocationTitle = "", isMediaHit = !1, isParticleHit || hideTooltip()
	}
}
var isTooltipVisible = !1;
function showTooltip() {
	container.style.cursor = "pointer",
		$("#tooltip").html("<div class=\"label\">" + currentLocationTitle + "</div>"),
		isTooltipVisible ||
		(isTooltipVisible = !0, clientMouseX > window.innerWidth - 250 ?
			(TweenMax.fromTo("#tooltip", 1,
				{ x: -100, autoAlpha: 0 },
				{ x: 0, autoAlpha: 1, display: "inline-block", ease: Expo.easeOut, delay: .1 }),
				document.getElementById("tooltip").style.textAlign = "right") :
			(TweenMax.fromTo("#tooltip", 1,
				{ x: 100, autoAlpha: 0 },
				{ x: 0, autoAlpha: 1, display: "inline-block", ease: Expo.easeOut, delay: .1 }),
				document.getElementById("tooltip").style.textAlign = "left"))
}
function hideTooltip() {
	isTooltipVisible = !1,
		container.style.cursor = isMouseDown ? "move" : "move",
		TweenMax.set("#tooltip", { autoAlpha: 0, display: "none" })
}
function checkClick() {
	globeRaycaster.setFromCamera(mouse, camera);
	var e = globeRaycaster.intersectObjects(dotSpritesArray, !0),
		a = 0 < e.length ? e[0] : null;
	if (0 < e.length) {
		let t = dataMap[a.object.userData.id][1], i = "";
		0 === t && (i = "E-BOOK"),
			1 === t && (i = "PAPERBACK"),
			2 === t && (i = "HARDCOVER"),
			TweenMax.killTweensOf("#location", !1);
		let o = new TimelineMax({ paused: !0 });
		o.fromTo("#location", .5,
			{ autoAlpha: 0 },
			{ autoAlpha: 1, display: "block", immediateRender: !1, ease: Linear.easeNone }, 0),
			o.fromTo("#location .title", 1, 
				{ scrambleText: { text: " " } },
				{
					scrambleText: {
						text: dataMap[a.object.userData.id][4],
						chars: "0123456789!@#$%^&*()"
					},
					ease: Expo.easeInOut
				}, 0),
			o.fromTo("#location .booktype", 1,
				{ scrambleText: { text: " " } },
				{
					scrambleText: {
						text: i,
						chars: "0123456789!@#$%^&*()"
					},
					ease: Expo.easeInOut
				}, 0),
			o.fromTo("#location", 1,
				{ autoAlpha: 1 },
				{ autoAlpha: 0, immediateRender: !1, ease: Linear.easeNone }, 1),
			o.play(0)
	}
	var e = globeRaycaster.intersectObject(mediaCloud, !0),
		a = 0 < e.length ? e[0] : null;
	if (0 < e.length) {
		var n = dataMedia[a.index][5];
		a.index, window.open(n, "_blank")
	}
}
function changeTagline() {
	let e = [
		["George Bernard Shaw", "You see things and say ‘Why?’, but I dream things and say ‘Why not?’"],
		["Winston Churchill", "Success is going from failure to failure without losing your enthusiasm."],
		["Walt Disney", "All our dreams can come true, if we have the courage to pursue them."],
		["Thomas Edison", "I have not failed. I’ve just found 10.000 ways that won’t work."],
		["Soichiro Honda", "uccess is 99% failure."],
		["Albert Einstein", "In the middle of difficulty lies opportunity."],
		["Bernhard Berenson", "Miracles happen to those who believe in them."],
		["Anonymous", "Behind the cloud, the sun is still shining."],
		["Alexander Solzhenitsyn", "A man is happy so long as he chooses to be happy."],
		["Ralph Waldo Emerson", "Go confidently in the direction of your dreams. Live the life you’ve imagined."],
		["Irish toast", "May the most you wish for be the least you get."],
		["Samuel Johnson", "Great works are performed, not by strength, but by perseverance"],
		["Thomas Edison", "Genius is one percent inspiration, and ninety-nine percent perspiration."],
		["Benjamin Disrael", "Nurture your mind with great thoughts; to believe in the heroic makes heroes."],
		["Jonathan Swift", "May you live all the days of your life!"],
		["Oscar Wilde", "I prefer the folly of enthusiasm to the wisdom of indifference."],
		["Mark Twain", "Twenty years from now, you’ll be more disappointed by the things that you didn’t do than by the ones you did do."]
	],
		a = e.length - 1, t = generateRandomNumber(0, a);
	$("#authors").html(""),
		$("#authors").html("#" + e[t][0]),
		$("#quote").html(""),
		$("#quote").html("\"" + e[t][1] + "\"")
}

function initButtons() {
	let a = !1; $("#minimap").mousedown(function () {
		setRotation("manual"), a = !0
	}).mousemove(function (t) {
		if (a) {
			let e = $(this).offset().top - $(window).scrollTop(),
				i = $(this).offset().left - $(window).scrollLeft(),
				o = Math.round(t.clientX - i),
				n = Math.round(t.clientY - e),
				r = o / $(this).width(),
				s = n / $(this).height(),
				l = 75, d = 180,
				A = Math.round(rotationObject.rotation.x / radianLoop) * radianLoop,
				p = Math.round(rotationObject.rotation.y / radianLoop) * radianLoop;
			targetRotationX = A + -(s * (2 * l) - (l + 15)) * toRAD,
				targetRotationY = p - (r * (2 * d) - d) * toRAD
		}
	}).mouseleave(function () { a = !1 }).mouseup(function (t) {
		a = !1,
			setRotation("manual");
		let e = $(this).offset().top - $(window).scrollTop(),
			i = $(this).offset().left - $(window).scrollLeft(),
			o = Math.round(t.clientX - i),
			n = Math.round(t.clientY - e),
			r = o / $(this).width(),
			s = n / $(this).height(),
			l = 75,
			d = 180,
			A = Math.round(rotationObject.rotation.x / radianLoop) * radianLoop,
			p = Math.round(rotationObject.rotation.y / radianLoop) * radianLoop;
		targetRotationX = A + -(s * (2 * l) - (l + 15)) * toRAD,
			targetRotationY = p - (r * (2 * d) - d) * toRAD
	}),
		$("#palette").click(function () { setColors("random") }),
		deviceSettings.isMobile || ($(".close").hover
			(function () {
				TweenMax.to(".close .line1", .5, {
					attr: { x1: 15, y1: 15, x2: 35, y2: 35 },
					stroke: colorSecondary,
					ease: Expo.easeOut
				}),
					TweenMax.to(".close .line2", .5, {
						attr: { x1: 15, y1: 35, x2: 35, y2: 15 },
						stroke: colorSecondary,
						ease: Expo.easeOut
					}),
					TweenMax.fromTo(".close circle", .5, {
						drawSVG: "50% 50%",
						stroke: colorSecondary
					}, {
						drawSVG: "35% 65%",
						stroke: colorPrimary,
						display: "block",
						ease: Expo.easeOut
					}),
					TweenMax.fromTo(".close circle", .25,
						{ autoAlpha: 0 },
						{ autoAlpha: 1, ease: Linear.easeNone })
			},
				function () {
					TweenMax.to(".close .line1", .5, {
						attr: { x1: 0, y1: 0, x2: 50, y2: 50 },
						stroke: colorPrimary,
						ease: Expo.easeOut
					}),
						TweenMax.to(".close .line2", .5, {
							attr: { x1: 0, y1: 50, x2: 50, y2: 0 },
							stroke: colorPrimary,
							ease: Expo.easeOut
						}),
						TweenMax.to(".close circle", .5, {
							drawSVG: "50% 50%",
							stroke: colorSecondary,
							autoAlpha: 0,
							ease: Expo.easeOut
						}),
						TweenMax.to(".close circle", .5, {
							autoAlpha: 0, ease:
								Linear.easeNone
						})
				}),
			$("#nav-left a").hover(function () {
				let e = $(this).attr("data-id");
				TweenMax.fromTo(this, 1,
					{ scrambleText: { text: " " }, autoAlpha: 0 },
					{
						scrambleText: { text: e, chars: "0123456789!@#$%^&*()", revealDelay: .1 },
						autoAlpha: 1
					})
			}, function () { }),
			$("#nav-right a").hover(function () {
				let e = $(this).attr("data-id");
				TweenMax.fromTo(this, 1,
					{ scrambleText: { text: " " }, autoAlpha: 0 },
					{
						scrambleText: { text: e, chars: "0123456789!@#$%^&*()", revealDelay: .1, rightToLeft: !0 },
						autoAlpha: 1
					})
			}, function () { }),
			$(document).keydown(function (a) {
				let e = a.keyCode || a.which,
					t = { left: 37, up: 38, right: 39, down: 40, blue: 66, invert: 73, random: 82 },
					i = 20 * toRAD;
				e === t.left ? (targetRotationY -= i, cameraDirection = "right") :
					e === t.right ? (targetRotationY += i, cameraDirection = "left") :
						e === t.up ? targetCameraZ -= 20 : e === t.down ? targetCameraZ += 20 :
							e === t.blue ? setColors("blue") : e === t.invert ? setColors("invert") :
								e === t.random ? setColors("random") : void 0
			}))
}
function resetAnimations() {
	if (lineStepStarted = 0, lineStepCompleted = 0, scene.getObjectByName("arcsRocket")) {
		for (var e = arcRocketBufferGeometry.attributes, a = 0;
			a < arcRocketDetailsArray.length; a++) {
			e.alpha.array[a] = 0; e.alpha.needsUpdate = !0,
				arcRocketAnimation.pause(0),
				arcRocketObject.visible = !1,
				earthObject.remove(arcRocketObject)
		}
	}
	if (scene.getObjectByName("arcsSnake")) {
		for (var e = arcSnakeBufferGeometry.attributes, a = 0;
			a < arcSnakeDetailsArray.length; a++) {
			e.alpha.array[a] = 0;
		}
		e.alpha.needsUpdate = !0,
			arcSnakeAnimation.pause(0),
			arcSnakeObject.visible = !1,
			earthObject.remove(arcSnakeObject)
	}
	scene.getObjectByName("arcsAll") && (arcAllAnimation.pause(0),
		arcAllObject.visible = !1, earthObject.remove(arcAllObject))
}
function setRotation(e) {
	$("#rotationMode a").removeClass("active");
	"toggle" === e && ("auto" === cameraTarget ? e = "manual" :
		"manual" === cameraTarget ? e = "auto" : void 0);
	cameraTarget = e;
	"auto" === cameraTarget ? $("#rotationMode a.auto").addClass("active") :
		"manual" === cameraTarget ? $("#rotationMode a.manual").addClass("active") : void 0
}
function toggleRotation() { "auto" == cameraTarget ? setRotation("manual") : setRotation("auto") }
let currentAnimationType = "";
function setArcAnimation(e) {
	switch (arcRocketCreated || createArcsRocket(),
	arcSnakeCreated || createArcsSnake(),
	arcAllCreated || createArcsAll(),
	currentAnimationType === e && (e = "off"),
	currentAnimationType = e,
	resetAnimations(),
	$("#arcMode a").removeClass("active"), e) {
		case "rocket": earthObject.add(arcRocketObject),
			arcRocketObject.visible = !0,
			arcRocketAnimation.play(0),
			$("#arcMode a.rocket").addClass("active");
			break;
		case "snake": earthObject.add(arcSnakeObject),
			arcSnakeObject.visible = !0,
			arcSnakeAnimation.play(0),
			$("#arcMode a.snake").addClass("active");
			break;
		case "all": arcAllAnimation.play(0),
			earthObject.add(arcAllObject),
			arcAllObject.visible = !0,
			$("#arcMode a.all").addClass("active");
			break;
		case "off":
	}isIntroDone && generateGlitch()
}
let colorTypeCurrent = "";
function setColors(e) {
	switch (colorTypeCurrent = e, $("#colorMode a").removeClass("active"), e) {
		case "off": colorPrimary = "#FFFFFF",
			colorSecondary = "#FFFFFF",
			$("#colorMode a.off").addClass("active");
			break;
		case "blue": colorPrimary = colorPrimary_Base,
			colorSecondary = colorSecondary_Base,
			$("#colorMode a.blue").addClass("active");
			break;
		case "invert": "#FFFFFF" === colorPrimary && "#FFFFFF" === colorSecondary &&
			(colorPrimary = colorPrimary_Base, colorSecondary = colorSecondary_Base);
			let a = colorPrimary,
				t = colorSecondary;
			colorPrimary = t,
				colorSecondary = a,
				$("#colorMode a.invert").addClass("active");
			break;
		case "random":
			colorPrimary = "#000000".replace(/0/g, function () {
				return (~~(16 * Math.random())).toString(16)
			}),
				colorSecondary = "#000000".replace(/0/g, function () {
					return (~~(16 * Math.random())).toString(16)
				}),
				$("#colorMode a.random").addClass("active");
			break;
		case "cycle": let o = 5e-5 * Date.now();
			h = 360 * (1 + o) % 360 / 360;
			let n = new THREE.Color(colorPrimary);
			colorPrimary = n.setHSL(h, .5, .5),
				colorPrimary = "#" + colorPrimary.getHexString();
			let r = new THREE.Color(colorSecondary);
			colorSecondary = r.setHSL(h, .5, .5),
				colorSecondary = "#" + colorSecondary.getHexString(),
				$("#colorMode a.cycle").addClass("active");
	}
	if (colorBase = new THREE.Color(colorPrimary),
		colorBase50 = new THREE.Color(shadeBlend(.5, colorPrimary, colorDarken)),
		colorBase75 = new THREE.Color(shadeBlend(.75, colorPrimary, colorDarken)),
		colorBase85 = new THREE.Color(shadeBlend(.85, colorPrimary, colorDarken)),
		colorHighlight = new THREE.Color(colorSecondary),
		scene.getObjectByName("rain") &&
		(rainCloud.material.uniforms.color.value = new THREE.Color(colorPrimary),
			rainCloud.material.uniforms.needsUpdate = !0), lightsCreated &&
		(lightShield1.color = colorBase, lightShield2.color = colorBase,
			lightShield3.color = colorBase, lightShield1.needsUpdate = !0,
			lightShield2.needsUpdate = !0, lightShield3.needsUpdate = !0),
		ringsCreated && (ringsOuterMaterial.color = colorBase75,
			ringsInnerMaterial.color = colorBase50, ringsOuterMaterial.needsUpdate = !0,
			ringsInnerMaterial.needsUpdate = !0),
		universeCreated && (universeBgMaterial.color = colorBase, universeBgMaterial.needsUpdate = !0),
		globeCreated) {
		globeInnerMaterial.color = colorBase75,
			globeOuterMaterial.color = colorBase,
			globeShieldMaterial.color = colorBase75,
			globeGlowMaterial.color = colorBase,
			globeInnerMaterial.needsUpdate = !0,
			globeOuterMaterial.needsUpdate = !0,
			globeShieldMaterial.needsUpdate = !0,
			globeGlowMaterial.needsUpdate = !0;
		for (var s = new Float32Array(3 * globeCloudVerticesArray.length),
			l = [], d = 0; d < globeCloudVerticesArray.length; d++) {
			let A = .01 * generateRandomNumber(85, 90),
				p = shadeBlend(A, colorPrimary, colorDarken);
			l[d] = new THREE.Color(p)
		}
		for (var d = 0; d < globeCloudVerticesArray.length; d++) {
			s[3 * d] = l[d].r,
				s[3 * d + 1] = l[d].g,
				s[3 * d + 2] = l[d].b;
		}
		globeCloudBufferGeometry.addAttribute("color", new THREE.BufferAttribute(s, 3)),
			globeCloudBufferGeometry.colorsNeedUpdate = !0
	}
	if (dotsCreated) {
		dotMaterial.color = colorHighlight,
			dotSpikesMaterial.color = colorHighlight,
			dotMaterial.needsUpdate = !0,
			dotSpikesMaterial.needsUpdate = !0;
		for (var d = 0; d < dotSpritesHoverArray.length; d++) {
			dotSpritesHoverArray[d].material.color = colorHighlight,
				dotSpritesHoverArray[d].material.needsUpdate = !0
		}
	}
	starsCreated && (starsMaterial.color = colorBase50, starsMaterial.needsUpdate = !0),
		arcRocketCreated && (arcRocketMesh.material.uniforms.color.value =
			colorHighlight, arcRocketMesh.material.uniforms.needsUpdate = !0),
		arcSnakeCreated && (arcSnakeMesh.material.uniforms.color.value =
			colorHighlight, arcSnakeMesh.material.uniforms.needsUpdate = !0),
		arcAllCreated && (arcAllMaterial.color = colorHighlight, arcAllMaterial.needsUpdate = !0),
		spikesCreated && (spikesMaterial.color = colorBase75, spikesMaterial.needsUpdate = !0),
		ringPulseCreated && (ringPulseMesh.material.uniforms.color.value =
			colorBase, ringPulseMesh.material.uniforms.needsUpdate =
			!0, ringExplosionMaterial.color =
			colorBase85, ringExplosionMaterial.needsUpdate =
			!0, ringPointMaterial.color =
			colorBase75, ringPointMaterial.needsUpdate = !0),
		gyroscopeCreated && (gyroscopeMesh1.material.color = colorBase, gyroscopeMesh2.material.color = colorBase,
			gyroscopeMesh3.material.color = colorBase,
			gyroscopeMesh4.material.color = colorBase,
			gyroscopeMesh1.material.needsUpdate = !0,
			gyroscopeMesh2.material.needsUpdate = !0,
			gyroscopeMesh3.material.needsUpdate = !0,
			gyroscopeMesh4.material.needsUpdate = !0),
		rainCreated && (rainCloud.material.uniforms.color.value = colorBase,
			rainCloud.material.uniforms.needsUpdate = !0),
		1 == $("#customCSS").length && $("#customCSS").remove();
	let m = hexToRgb(colorPrimary),
		u = "<style id=\"customCSS\"> body, a:link, a:visited { color: " + colorPrimary +
			";} .settings a { border-color: rgba(" + m.r + ", " + m.g + ", " + m.b +
			", .15);} .settings a.active { background-color: " + colorPrimary +
			";} #rotationMode a { color: " + shadeBlend(.5, colorPrimary, colorDarken) +
			";} #rotationMode a.active { color: " + colorPrimary +
			";} .svg-stop { stop-color: " + colorPrimary +
			";} .pulseDot { background-color: " + colorPrimary +
			";} .pulseTrail { background-color: " + colorPrimary +
			";} #tooltip { background-color: " + colorPrimary +
			";} #soundButton .bar:after { background-color: " + colorPrimary +
			";} #soundButton .bar:after { background-color: " + colorPrimary +
			";} #paletteHighlight { background-color: " + colorSecondary +
			";} #paletteBase { background-color: " + colorPrimary +
			";} #paletteBase50 { background-color: " + shadeBlend(.5, colorPrimary, colorDarken) +
			";} #paletteBase75 { background-color: " + shadeBlend(.75, colorPrimary, colorDarken) +
			";} #paletteBase85 { background-color: " + shadeBlend(.85, colorPrimary, colorDarken) +
			";} #location { color: " + colorSecondary +
			";} </style>";
	$("head").append(u),
		$("#minimap svg path, .svg-fill").css("fill", colorPrimary),
		$(".close .line1, .close .line2, .close .bracket_x, .close .circle_x, .svg-ring, .cross, .pulseCircle circle").css("stroke", colorPrimary),
		isIntroDone && "cycle" != colorTypeCurrent && generateGlitch()
}
let statNumber = 0;
function changeStat() {
	let e = ["48", "36", "6"],
		a = ["COUNTRIES", "U.S. STATES", "CONTINENTS"],
		t = e.length - 1;
	TweenMax.set("#nav-stats", { transformPerspective: 800 });
	let i = new TimelineMax({
		paused: !0,
		force3D: !0,
		repeat: -1,
		delay: 1,
		repeatDelay: 0
	});
	i.to("#nav-stats", 1.5, {
		scaleX: .7,
		scaleY: .7,
		autoAlpha: 0,
		rotationY: -90,
		ease: Expo.easeIn,
		immediateRender: !1
	}, 0),
		i.fromTo("#nav-stats", 3, {
			scaleX: 0,
			scaleY: 0,
			autoAlpha: 0,
			rotationY: 180
		}, {
			scaleX: 1,
			scaleY: 1,
			autoAlpha: 1,
			rotationY: 0,
			ease: Expo.easeOut,
			immediateRender: !1,
			onStart: function () {
				statNumber++,
					statNumber > t && (statNumber = 0),
					$("#nav-stats .number").html(""),
					$("#nav-stats .number").html(e[statNumber]),
					$("#nav-stats .description").html(""),
					$("#nav-stats .description").html(a[statNumber])
			},
			onComplete: function () {
				$("#nav-stats").removeAttr("style")
			}
		}, 1.5),
		i.timeScale(1),
		i.play()
}
let isInfoVisible = !1,
	infoSection = "";
function toggleInfo(e) {
	if (TweenMax.set("#overlayRing svg", { rotation: -90, transformOrigin: "center center" }),
		TweenMax.set(".close .circles", { rotation: -180, transformOrigin: "center center" }),
		isInfoVisible) {
		isInfoVisible = !1;
		let a = new TimelineMax({ paused: !0 });
		a.to("#overlay", .5,
			{ autoAlpha: 0, ease: Linear.easeNone }, 0),
			a.staggerTo("#overlayRing .svg-ring", .5,
				{ drawSVG: "50% 50%", ease: Expo.easeInOut }, .25, 0),
			a.play(0)
	} else {
		infoSection = e,
			isInfoVisible = !0;
		var a = new TimelineMax({ paused: !0 });
		a.fromTo("#overlay", .5,
			{ autoAlpha: 0 },
			{ autoAlpha: 1, display: "block", ease: Linear.easeNone }, 0),
			a.staggerFromTo("#overlayRing .svg-ring", 2,
				{ drawSVG: "50% 50%" },
				{ drawSVG: "0 100%", ease: Expo.easeInOut }, .25, 0),
			a.fromTo("#" + e, 1,
				{ autoAlpha: 0 },
				{ autoAlpha: 1, display: "block", ease: Linear.easeNone }, .5),
			a.fromTo("#overlayRing", 1,
				{ autoAlpha: 0 },
				{ autoAlpha: 1, ease: Expo.easeOut }, .5),
			a.staggerFromTo("#" + e + " .animate", 1,
				{ y: 50, autoAlpha: 0 },
				{ y: 0, autoAlpha: 1, ease: Expo.easeOut }, .1, 1),
			a.fromTo(".close .line1", 1, {
				attr: { x1: 25, y1: 25, x2: 25, y2: 25 },
				stroke: "#FFFFFF",
				autoAlpha: 0
			}, {
				attr: { x1: 0, y1: 0, x2: 50, y2: 50 },
				stroke: colorPrimary,
				autoAlpha: 1,
				ease: Expo.easeInOut
			}, 1),
			a.fromTo(".close .line2", 1, {
				attr: { x1: 25, y1: 25, x2: 25, y2: 25 },
				stroke: "#FFFFFF",
				autoAlpha: 0
			}, {
				attr: { x1: 0, y1: 50, x2: 50, y2: 0 },
				stroke: colorPrimary,
				autoAlpha: 1,
				ease: Expo.easeInOut
			}, 1),
			a.play(0), generateGlitch()
	}
}
function getDifference(e, a) { return Math.abs(e - a) }
function checkIsBlack(e) { return !(e[0] != e[1] || e[1] != e[2] || 0 !== e[2]) }
function shadeBlend(e, a, i) {
	let o = 0 > e ? -1 * e : e,
		n = Math.round,
		r = parseInt;
	if (7 < a.length) {
		let s = a.split(","),
			l = (i ? i : 0 > e ? "rgb(0,0,0)" : "rgb(255,255,255)").split(","),
			d = r(s[0].slice(4)),
			A = r(s[1]),
			p = r(s[2]);
		return "rgb(" + (n((r(l[0].slice(4)) - d) * o) + d) + "," +
			(n((r(l[1]) - A) * o) + A) + "," + (n((r(l[2]) - p) * o) + p) + ")"
	}
	let s = r(a.slice(1), 16),
		l = r((i ? i : 0 > e ? "#000000" : "#FFFFFF").slice(1), 16),
		m = s >> 16,
		u = 255 & s >> 8,
		c = 255 & s; return "#" + (16777216 + 65536 * (n(((l >> 16) - m) * o) + m) +
			256 * (n(((255 & l >> 8) - u) * o) + u) + (n(((255 & l) - c) * o) + c)).toString(16).slice(1)
}
function hexToRgb(e) {
	let a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
	return a ? { r: parseInt(a[1], 16), g: parseInt(a[2], 16), b: parseInt(a[3], 16) } : null
}
let cometTotal = 15,
	cometRotation = 24;
function createGlitch(e) {
	TweenMax.set(".cross", { autoAlpha: 0 }),
		TweenMax.set("#pulseCircle1", { rotation: -180, transformOrigin: "center center" }),
		$("#pulseComets").html("");
	for (var a = 0; a < cometTotal; a++) {
		$("#pulseComets").prepend("<div class=\"pulseComet\" id=\"pulseComet" +
			a + "\"><div class=\"pulseTrail\"></div><div class=\"pulseDot\"></div></div>"),
			TweenMax.set("#pulseComet" + a, { rotation: a * cometRotation, transformOrigin: "center bottom" });
	}
	e && e()
}
function generateExplosion() {
	console.log("EXPLOSION WOW OVERPOWERIN");
	let e = new TimelineMax({ paused: !0 });
	e.fromTo(ringExplosionMesh.scale, 1,
		{ x: 1, y: 1 },
		{ x: 3, y: 3, ease: Quint.easeOut }, 0),
		e.fromTo(ringExplosionMesh.material, .25,
			{ opacity: 0 },
			{
				opacity: 1,
				ease: Linear.easeNone,
				onStart: function () { ringExplosionMesh.visible = !0 }
			}, 0),
		e.fromTo(ringExplosionMesh.material, .75,
			{ opacity: 1 },
			{
				opacity: 0,
				immediateRender: !1,
				ease: Linear.easeNone,
				onComplete: function () { ringExplosionMesh.visible = !1 }
			}, .25),
		e.timeScale(1), e.play(0)
}
function generateGlitch() {
	if (minimapBgCreated) {
		let e = new TimelineMax({ paused: !0 });
		e.to(minimapDetails, 2,
			{ pixi: { tint: colorPrimary } }, 0),
			e.fromTo(minimapLines, 2,
				{ pixi: { tint: 16777215 } },
				{ pixi: { tint: colorPrimary }, ease: Circ.easeOut }, 0),
			e.fromTo(minimapMaskGradient, 2,
				{ pixi: { scaleX: 0 } },
				{ pixi: { scaleX: 1.25 }, ease: Expo.easeOut }, 0),
			e.fromTo(minimapSpiral, 2, { pixi: { rotation: 90 } },
				{ pixi: { rotation: 450 }, ease: Expo.easeOut }, 0),
			e.fromTo(minimapSpiral, .1, { pixi: { alpha: 0 } },
				{ pixi: { alpha: 1 }, immediateRender: !1, ease: Linear.easeNone }, 0),
			e.fromTo(minimapSpiral, .75,
				{ pixi: { alpha: 1 } },
				{ pixi: { alpha: 0 }, immediateRender: !1, ease: Linear.easeNone }, .2),
			e.fromTo(minimapMaskGradient, 2,
				{ pixi: { alpha: 1 } },
				{ pixi: { alpha: 0 }, ease: Linear.easeNone }, .5),
			e.fromTo(minimapBlipsGroup, .65,
				{ pixi: { scale: 0 } },
				{ pixi: { scale: 1 }, ease: Expo.easeOut }, 0),
			e.fromTo(minimapBlipArray, .75,
				{ pixi: { alpha: 1 } },
				{ pixi: { alpha: 0 }, ease: Linear.easeNone }, .5),
			e.fromTo(minimapSpikesGroup, .75,
				{ pixi: { scale: 0 } },
				{ pixi: { scale: 1 }, ease: Expo.easeOut }, 0),
			e.fromTo(minimapXArray, .75,
				{ pixi: { scaleY: 1 } },
				{ pixi: { scaleY: 0 }, ease: Circ.easeInOut }, .1),
			e.fromTo(minimapExtras1, 3,
				{ pixi: { rotation: 0 } },
				{ pixi: { rotation: -360 }, ease: Expo.easeOut }, 0),
			e.fromTo(minimapExtras1, .1,
				{ pixi: { alpha: 0 } },
				{ pixi: { alpha: 1 }, ease: Linear.easeNone }, 0),
			e.fromTo(minimapExtras1, 1,
				{ pixi: { alpha: 1, tint: 16777215 } },
				{ pixi: { alpha: 0, tint: colorPrimary }, immediateRender: !1, ease: Linear.easeNone }, .2),
			e.fromTo(minimapExtras2, 1.5,
				{ pixi: { scale: .5 } },
				{ pixi: { scale: 1.1 }, ease: Expo.easeOut }, 0),
			e.fromTo(minimapExtras2, .1,
				{ pixi: { alpha: 0 } },
				{ pixi: { alpha: .5 }, ease: Linear.easeNone }, 0),
			e.fromTo(minimapExtras2, 1,
				{ pixi: { alpha: .5, tint: 16777215 } },
				{
					pixi: { alpha: 0, tint: colorPrimary },
					immediateRender: !1, ease: Linear.easeNone
				}, .2),
			e.fromTo(minimapXArray, 1,
				{ pixi: { tint: 16777215 } },
				{ pixi: { tint: colorPrimary }, ease: Linear.easeNone }, 0),
			e.fromTo(minimapBlipArray, 1,
				{ pixi: { tint: 16777215 } },
				{ pixi: { tint: colorPrimary }, ease: Linear.easeNone }, 0),
			e.timeScale(1.5), e.play(0)
	}
	TweenMax.fromTo("#interactive", .25, {
		x: generateRandomNumber(-10, 10),
		y: generateRandomNumber(-10, 10)
	},
		{
			x: 0, y: 0,
			ease: RoughEase.ease.config({ strength: 2, points: 20 })
		});
		generateExplosion()
}
function generateRandomNumber(e, a) {
	let t = Math.floor(Math.random() * (a - e + 1)) + e;
	return t
}
function onWindowResize() {
	let e = window.innerWidth,
		a = window.innerHeight;
	camera.aspect = e / a,
		camera.updateProjectionMatrix(),
		renderer.setSize(e, a)
}
function onMouseWheel(e) {
	e.preventDefault(),
		targetCameraZ -= .05 * e.wheelDeltaY
}
function onDocumentMouseDown(e) {
	!1 === isGlobeEventsEnabled ||
		(e.preventDefault(), isMouseDown = !0, mouseXOnMouseDown = e.clientX -
			windowHalfX, mouseYOnMouseDown = e.clientY - windowHalfY, targetRotationXOnMouseDown =
			targetRotationX, targetRotationYOnMouseDown = targetRotationY, checkClick(), initMouseX = e.clientX)
}
let targetTiltX = 0,
	targetTiltY = 0;
function onDocumentMouseMove(e) {
	if (!1 !== isGlobeEventsEnabled) {
		isMouseMoved = !0,
			clientMouseX = e.clientX,
			clientMouseY = e.clientY,
			isParticleHit && (clientMouseX > window.innerWidth - 250 ?
				TweenMax.set("#tooltip", {
					left: "auto",
					right: window.innerWidth - clientMouseX + 35,
					top: clientMouseY
				}) :
				TweenMax.set("#tooltip", {
					right: "auto",
					left: clientMouseX + 35,
					top: clientMouseY
				})),
			isMediaHit && (clientMouseX > window.innerWidth - 250 ?
				TweenMax.set("#tooltip", {
					left: "auto",
					right: window.innerWidth - clientMouseX + 35,
					top: clientMouseY
				}) :
				TweenMax.set("#tooltip", {
					right: "auto",
					left: clientMouseX + 35,
					top: clientMouseY
				})),
			mouse.x = 2 * (e.clientX / window.innerWidth) - 1,
			mouse.y = 2 * -(e.clientY / window.innerHeight) + 1,
			isMouseDown && (isGlobeRotated = !0,
				mouseX = e.clientX - windowHalfX,
				mouseY = e.clientY - windowHalfY,
				targetRotationX = targetRotationXOnMouseDown + .0025 * (mouseY - mouseYOnMouseDown),
				targetRotationY = targetRotationYOnMouseDown + .0025 * (mouseX - mouseXOnMouseDown));
		let a = .5 * window.innerWidth,
			t = .5 * window.innerHeight;
		targetTiltY = .005 * ((e.clientX - a) / a),
			targetTiltX = .01 * ((e.clientY - t) / t)
	}
}
function onDocumentMouseUp(e) {
	!1 !== isGlobeEventsEnabled &&
		(e.preventDefault(), isMouseDown = !1,
			25 > Math.abs(initMouseX - e.clientX) ||
			(setRotation("off"),
				setCameraDirection(initMouseX, e.clientX)))
}
function onDocumentMouseLeave(e) {
	if (!1 !== isGlobeEventsEnabled && (e.preventDefault(), isMouseDown)) {
		if (isMouseDown = !1, 25 > Math.abs(initMouseX - e.clientX)) return;
		setRotation("off"), setCameraDirection(initMouseX, e.clientX)
	}
}
function setCameraDirection(e, a) { cameraDirection = e > a ? "right" : "left" }
let _touchZoomDistanceStart, _touchZoomDistanceEnd;
function onDocumentTouchStart(e) {
	if (!1 !== isGlobeEventsEnabled &&
		(1 == e.touches.length &&
			(e.preventDefault(),
				isMouseDown = !0,
				mouseXOnMouseDown = e.touches[0].pageX - windowHalfX,
				mouseYOnMouseDown = e.touches[0].pageY - windowHalfY,
				targetRotationXOnMouseDown = targetRotationX,
				targetRotationYOnMouseDown = targetRotationY),
			1 < e.touches.length)) {
		let a = e.touches[0].pageX - e.touches[1].pageX,
			t = e.touches[0].pageY - e.touches[1].pageY;
		_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(a * a + t * t)
	}
}
function onDocumentTouchMove(e) {
	if (!1 !== isGlobeEventsEnabled &&
		(1 == e.touches.length && (e.preventDefault(),
			isMouseDown && (isGlobeRotated = !0,
				mouseX = mouseX = e.touches[0].pageX - windowHalfX,
				mouseY = mouseY = e.touches[0].pageY - windowHalfY,
				140 > targetCameraZ ?
					(targetRotationX = targetRotationXOnMouseDown + .001 * (mouseY - mouseYOnMouseDown),
						targetRotationY = targetRotationYOnMouseDown + .001 * (mouseX - mouseXOnMouseDown)) :
					(targetRotationX = targetRotationXOnMouseDown + .01 * (mouseY - mouseYOnMouseDown),
						targetRotationY = targetRotationYOnMouseDown + .01 * (mouseX - mouseXOnMouseDown)))),
			1 < e.touches.length)) {
		let a = e.touches[0].pageX - e.touches[1].pageX,
			t = e.touches[0].pageY - e.touches[1].pageY;
		_touchZoomDistanceEnd = Math.sqrt(a * a + t * t);
		let i = _touchZoomDistanceStart / _touchZoomDistanceEnd;
		_touchZoomDistanceEnd > _touchZoomDistanceStart ?
			targetCameraZ -= 5 * i : targetCameraZ += 5 * i, _touchZoomDistanceStart = _touchZoomDistanceEnd
	}
}
function onDocumentTouchEnd(e) {
	_touchZoomDistanceStart = _touchZoomDistanceEnd = 0,
		setRotation("off"), onDocumentMouseUp(e)
}
var dataMap =
	[
	[0, 0, 33.58, -117.62, "Orange County, CA, USA"],
	[1, 0, 43.45, -80.56, "Waterloo, ON, Canada"],
	[2, 0, 59.94, 10.66, "Oslo, Norway"],
	[3, 0, 47.53, -121.85, "Snoqualmie, WA, USA"],
	[4, 0, 59.37, 24.71, "Jalaka, Estonia"],
	[5, 0, 45.24, 19.82, "Cernisevskog, Serbia"],
	[6, 0, 37.87, -122.27, "Berkeley, CA, USA"],
	[7, 0, 50.74, 3.59, "Ronse, Belgium"],
	[8, 0, 43.15, -79.24, "St. Catharines, ON, Canada"],
	[9, 0, 51.58, -.11, "London, United Kingdom"],
	[10, 0, 32.56, -92.05, "Monroe, LA, USA"],
	[11, 0, 52.11, 6.05, "Eerbeek, Netherlands"],
	[12, 0, 34.03, -84.75, "Acworth, GA, USA"],
	[13, 0, 37.69, -113.05, "Cedar City, UT, USA"],
	[14, 0, 57.72, 12.03, "G\xF6teborg, Sweden"],
	[15, 0, 45.52, -73.56, "Montreal, QC, Canada"],
	[16, 0, 37.78, -122.41, "San Francisco, CA, USA"],
	[17, 0, 48.86, 2.44, "Montreuil, France"],
	[18, 0, 53.07, -1.23, "Nottingham, United Kingdom"],
	[19, 0, 39.15, -86.54, "Bloomington, IN, USA"],
	[20, 0, 32.94, -97.08, "Grapevine, TX, USA"],
	[21, 0, 48.79, 9.79, "Schw\xC3\xA4bisch Gm\xC3\xBCnd, Germany"],
	[22, 0, 56.96, 23.6, "Jurmala, Latvia"],
	[23, 0, 33.64, -117.58, "RSM, CA, USA"],
	[24, 0, 39.77, -105.07, "Wheat Ridge, CO, USA"],
	[25, 0, 37.78, -122.43, "San Francisco, CA, USA"],
	[26, 0, 51.49, 4.28, "London, Netherlands"],
	[27, 0, -6.96, 107.55, "Bandung, Indonesia"],
	[28, 0, 52.33, 6.65, "Almelo, Netherlands"],
	[29, 0, 29.55, -98.38, "San Antonio, TX, USA"],
	[30, 0, 55.72, 12.51, "S\xF8borg, Denmark"],
	[31, 0, 40.67, -73.66, "Malverne, NY, USA"],
	[32, 0, 31.27, 121.48, "Shanghai, China"],
	[33, 0, 34.62, 135.59, "Osaka, Japan"],
	[34, 0, 41.48, -73.04, "Naugatuck, CT, USA"],
	[35, 0, -23.57, -46.62, "S\xE3o Paulo, Brazil"],
	[36, 0, 48.44, -123.34, "Victoria, BC, Canada"],
	[37, 0, 33.56, -117.24, "Murrieta, CA, USA"],
	[38, 0, 51.04, 3.75, "Gent, Belgium"],
	[39, 0, 37.78, -122.41, "San Francisco, CA, USA"],
	[40, 0, 59.27, 18.04, "Enskede, Sweden"],
	[41, 0, -33.41, 151.44, "Wamberal, ACT, Australia"],
	[42, 0, 33.77, -117.97, "Garden Grove, CA, USA"],
	[43, 0, -36.88, 174.8, "Remuera, AUK, New Zealand"],
	[44, 0, 39.95, -75.2, "Philadelphia, PA, USA"],
	[45, 0, 33.73, -117.76, "Irvine, CA, USA"],
	[46, 0, 37.75, -122.43, "San Francisco, CA, USA"],
	[47, 0, 35.74, -86.9, "Spring Hill, TN, USA"],
	[48, 0, 37.79, -122.39, "San Francisco, CA, USA"],
	[49, 0, 41.09, -73.59, "Stamford, CT, USA"],
	[50, 0, 41.04, -75.93, "Drums PA, USA"],
	[51, 0, 33.61, -112.14, "Phoenix, AZ, USA"],
	[52, 0, 45.27, 19.83, "Novi Sad, Serbia"],
	[53, 0, 46.73, -117.18, "Pullman, WA, USA"],
	[54, 0, 47.96, 21.72, "Nyiregyhaza, Hungary"],
	[55, 0, 36.52, -5.04, "M\xE1laga, Spain"],
	[56, 0, 47.69, 8.64, "Schaffhausen, Switzerland"],
	[57, 0, 32.66, -116.99, "Chula Vista, CA, USA"],
	[58, 0, 33.64, -117.75, "Irvine, CA, USA"],
	[59, 0, 32.76, -117.08, "San Diego, CA, USA"],
	[60, 0, 43.47, -110.78, "Jackson, WY, USA"],
	[61, 0, 41.69, -93.64, "Ankeny, IA, USA"],
	[62, 0, 52.53, 13.39, "Berlin, Germany"],
	[63, 0, 40.46, -79.96, "Pittsburgh, PA, USA"],
	[64, 0, 37.27, -121.84, "San Jose, CA, USA"],
	[65, 0, 50.46, 4.87, "Namur, Belgium"],
	[66, 0, 41.39, 2.14, "Barcelona, Spain"],
	[67, 0, 55.7, 12.55, "Copenhagen, Denmark"],
	[68, 0, 43.63, -79.47, "Toronto, ON, Canada"],
	[69, 0, 47.16, 27.58, "Romania, Romania"],
	[70, 0, -37.79, 144.87, "Maidstone, VIC, Australia"],
	[71, 0, 40.74, -73.99, "New York, NY, USA"],
	[72, 0, 38.76, -121.27, "Roseville, CA, USA"],
	[73, 0, 44.2, 28.62, "Constanta, Romania"],
	[74, 0, 33.27, -117.11, "Escondido, CA, USA"],
	[75, 0, 50.92, .47, "Battle, United Kingdom"],
	[76, 0, 37.32, -122.02, "Cupertino, CA, USA"],
	[77, 0, 40.96, -74.09, "Ridgewood, NJ, USA"],
	[78, 0, 40.78, -111.92, "Salt Lake City, UT, USA"],
	[79, 0, 45.87, -111.16, "Belgrade, MT, USA"],
	[80, 0, 37.73, -122.39, "San Francisco, CA, USA"],
	[81, 0, 39.95, -75.19, "Philadelphia, PA, USA"],
	[82, 0, 17.51, 78.31, "Hyderabad, India"],
	[83, 0, 24.8, -107.43, "Culiac\xE1n, Mexico"],
	[84, 0, 36.85, -76.29, "Norfolk, VA, USA"],
	[85, 0, 40.65, -73.94, "Brooklyn, NY, USA"],
	[86, 0, 33.9, -117.98, "La Mirada, LA, USA"],
	[87, 0, 50.78, -2.01, "Wimborne, United Kingdom"],
	[88, 0, 33.79, -118.09, "Long Beach, CA, USA"],
	[89, 0, 33.8, -84.41, "Atlanta, GA, USA"],
	[90, 0, 53.45, -2.35, "Manchester, United Kingdom"],
	[91, 0, 32.7, -117.03, "San Diego, CA, USA"],
	[92, 0, 53.33, -6.23, "Dublin, Ireland"],
	[93, 0, 55.66, 12.54, "K\xF8benhavn, Denmark"],
	[94, 0, 40.67, -73.96, "Brooklyn, NY, USA"],
	[95, 0, 59.34, 18.05, "Stockholm, Sweden"],
	[96, 0, 45.55, -122.62, "Portland, OR, USA"],
	[97, 0, 40.74, -73.98, "New York, NY, USA"],
	[98, 0, 37.74, -122.41, "San Francisco, CA, USA"],
	[99, 0, 51.03, -114.09, "Calgary, AB, Canada"],
	[100, 0, 36.61, -93.37, "Reeds Spring, MO, USA"],
	[101, 0, -26.14, 28.13, "Gauteng, South Africa"],
	[102, 0, 39.93, 32.91, "Ankara, Turkey"],
	[103, 0, 14.03, -87.23, "Tegucigalpa, Honduras"],
	[104, 0, 39.91, -86.01, "Indianapolis, IN, USA"],
	[105, 0, 53.45, 18.71, "Grudziadz, Poland"],
	[106, 0, 48.77, -122.4, "Bellingham, WA, USA"],
	[107, 0, 38.13, -83.89, "Owingsville, KY, USA"],
	[108, 0, 33.77, -118.38, "Rancho Palos Verdes, CA, USA"],
	[109, 0, 51.5, -.06, "London, United Kingdom"],
	[110, 0, 37.25, -121.84, "San Jose, CA, USA"],
	[111, 0, 40.66, -73.92, "Brooklyn, NY, USA"],
	[112, 0, 29.78, -95.84, "Katy, TX, USA"],
	[113, 0, 29.7, -95.78, "Katy, TX, USA"],
	[114, 0, 47.62, -122.05, "Sammamish, WA, USA"],
	[115, 0, -37.58, 143.81, "Delecombe, VIC, Australia"],
	[116, 0, 35.95, -86.57, "Smyrna, TN, USA"],
	[117, 0, 51.44, -.2, "London, United Kingdom"],
	[118, 0, 36.25, -5.96, "C\xC3\xA1diz, Spain"],
	[119, 0, 43.9, 12.84, "Pesaro, Italy"],
	[120, 0, 48.85, 2.37, "Paris, France"],
	[121, 0, 43.58, 1.35, "Tournefeuille, France"],
	[122, 0, 38.91, -77.03, "Washington, DC, USA"],
	[123, 0, 51.29, -116.95, "Golden, BC, Canada"],
	[124, 0, 43.21, -79.99, "Ancaster, ON, Canada"],
	[125, 0, 37.8, -122.42, "San Francisco, CA, USA"],
	[126, 0, 32.76, -117.08, "San Diego, CA, USA"],
	[127, 0, 50.44, 30.49, "Kiev, Ukraine"],
	[128, 0, 17.75, -66.06, "San Juan, PR, USA"],
	[129, 0, 37.84, -122.27, "Emeryville, CA, USA"],
	[130, 0, 39.68, -104.94, "Denver, CO, USA"],
	[131, 0, 33.1, -117.3, "Carlsbad, CA, USA"],
	[132, 0, 42.41, -71.07, "Medford, MA, USA"],
	[133, 0, 40.01, -105.22, "Boulder, CO, USA"],
	[134, 0, 37.76, -122.42, "San Francisco, CA, USA"],
	[135, 0, -34.53, -58.46, "Buenos Aires, Argentina"],
	[136, 0, 47.65, -122.33, "Wallingford, WA, USA"],
	[137, 0, 52.34, 16.88, "Lubon, Poland"],
	[138, 0, 34.08, -118.31, "Los Angeles, CA, USA"],
	[139, 0, 33.73, -117.89, "Santa Ana, CA, USA"],
	[140, 0, 50.81, -.35, "Worthing, United Kingdom"],
	[141, 0, 37.73, -121.94, "San Ramon, CA, USA"],
	[142, 0, 37.88, -122.52, "Mill Valley, CA, USA"],
	[143, 0, 25.98, -80.39, "Miramar, FL, USA"],
	[144, 0, 40.49, -3.9, "Madrid, Spain"],
	[145, 0, 43.5, -79.65, "Mississauga, ON, Canada"],
	[146, 0, 40.48, -111.87, "Draper, UT, USA"],
	[147, 0, 30.47, -97.79, "Austin, TX, USA"],
	[148, 0, 48.15, 17.11, "Bratislava, Slovakia"],
	[149, 0, 12.87, 121.77, "Escalante City, Philippines"],
	[150, 0, -19.94, -43.97, "Belo Horizonte, Brazil"],
	[151, 0, 40.84, -73.99, "Palisades Park, NJ, USA"],
	[152, 0, 35.16, -80.84, "Charlotte, NC, USA"],
	[153, 0, 28.59, -81.23, "Orlando, FL, USA"],
	[154, 0, 26.17, -80.18, "Oakland Park, FL, USA"],
	[155, 0, 43.91, 20.33, "Cacak, Serbia"],
	[156, 0, 39.85, -86.34, "Indianapolis, IN, USA"],
	[157, 0, 34.12, -83.82, "Braselton, GA, USA"],
	[158, 0, 37.77, -122.42, "San Francisco, CA, USA"],
	[159, 2, 37.89, -122.11, "Lafayette, CA, USA"],
	[160, 2, 39.87, -105.07, "Westminster, CO, USA"],
	[161, 2, 51.02, -114.14, "Calgary, AB, Canada"],
	[162, 2, 30.29, -97.7, "Austin, TX, USA"],
	[163, 2, 43.04, -87.9, "Milwaukee, WI, USA"],
	[164, 2, 41.35, -72.15, "Waterford, CT, USA"],
	[165, 2, 55.67, 12.51, "Frederiksberg, Denmark"],
	[166, 0, 51.49, 4.28, "London, Netherlands"],
	[167, 2, 34.02, -118.32, "Los Angeles, CA, USA"],
	[168, 2, 34.11, -118.14, "South Pasadena, CA, USA"],
	[169, 0, 34.02, -118.45, "Santa Monica, CA, USA"],
	[170, 2, 47.62, -122.05, "Sammamish, WA, USA"],
	[171, 2, 37.33, -121.96, "Santa Clara, CA, USA"],
	[172, 2, 55.69, 12.54, "Copenhagen, Denmark"],
	[173, 2, 33.09, -117.24, "Carlsbad, CA, USA"],
	[174, 0, -41.28, 174.77, "Wellington, New Zealand"],
	[175, 0, 34.08, -118.37, "West Hollywood, CA, USA"],
	[176, 0, 40.96, -74.15, "Hawthorne, NJ, USA"],
	[177, 2, 42.48, -83.11, "Madison Heights, MI, USA"],
	[178, 2, -25.15, 27.01, "Johannesburg, South Africa"],
	[179, 2, 59.27, 18.04, "Enskede, Sweden"],
	[180, 2, 25.79, -80.14, "Miami Beach, FL, USA"],
	[181, 2, 59.91, 10.74, "Oslo, Norway"],
	[182, 2, 39.22, -94.42, "Liberty, MO, USA"],
	[183, 2, 20.66, -103.37, "Guadalajara, Mexico"],
	[184, 2, 37.68, -122.14, "San Leandro, CA, USA"],
	[185, 2, 40.73, -73.98, "New York, NY, USA"],
	[186, 2, 40.7, -73.98, "Brooklyn, NY, USA"],
	[187, 2, 34.1, -117.89, "Covina, CA, USA"],
	[188, 2, 28.69, -81.4, "Longwood, FL, USA"],
	[189, 2, 33.36, -111.67, "Mesa, AZ, USA"],
	[190, 2, 45.43, -122.79, "Portland, OR, USA"],
	[191, 2, 41.87, -87.97, "Villa Park, IL, USA"],
	[192, 2, 49.28, -123.09, "Vancouver, BC, Canada"],
	[193, 0, 34.01, -118.45, "Santa Monica, CA, USA"],
	[194, 0, 32.94, -117.22, "San Diego, CA, USA"],
	[195, 2, 50.86, 4.35, "Brussels, Belgium"],
	[196, 2, 33.64, -117.75, "Irvine, CA, USA"],
	[197, 2, 43.63, -79.47, "Toronto, ON, Canada"],
	[198, 2, 39.62, -75.69, "Newark, DE, USA"],
	[199, 2, 40.77, -111.87, "Salt Lake City, UT, USA"],
	[200, 2, 37.7, -122.42, "San Francisco, CA, USA"],
	[201, 0, 37.51, -122.25, "Redwood City, CA, USA"],
	[202, 2, 33.1, -117.29, "Carlsbad, CA, USA"],
	[203, 2, 43.66, -79.33, "Toronto, ON, Canada"],
	[204, 2, 50.69, 4.04, "Enghien, Belgium"],
	[205, 2, 33.27, -117.11, "Escondido, CA, USA"],
	[206, 2, 40.02, -105.26, "Boulder, CO, USA"],
	[207, 2, 40.16, -105.12, "Longmont, CO, USA"],
	[208, 2, 42.08, -88.32, "Sleepy Hollow, IL, USA"],
	[209, 2, 32.83, -117.07, "San Diego, CA, USA"],
	[210, 0, 49.26, -123.13, "Vancouver, BC, Canada"],
	[211, 0, 35.2, -80.84, "Charlotte, NC, USA"],
	[212, 2, 43.04, -87.9, "Milwaukee, WI, USA"],
	[213, 2, 33.71, -118.02, "Huntington Beach, CA, USA"],
	[214, 2, 51.6, .64, "Hockley, United Kingdom"],
	[215, 2, 34.05, -117.27, "San Bernardino, CA, USA"],
	[216, 2, 40.31, -111.9, "Saratoga Springs, UT, USA"],
	[217, 2, 37.77, -122.39, "San Francisco, CA, USA"],
	[218, 2, 33.6, -117.91, "Newport Beach, CA, USA"],
	[219, 2, 29.55, -98.38, "San Antonio, TX, USA"],
	[220, 2, 39.76, -105.03, "Denver, CO, USA"],
	[221, 2, 37.25, -121.92, "San Jose, CA, USA"],
	[222, 2, 47.65, -122.33, "Seattle, WA, USA"],
	[223, 2, 34.1, -118.3, "Los Angeles, CA, USA"],
	[224, 0, 47.07, 15.43, "Graz, Austria"],
	[225, 0, 40.73, -111.86, "Salt Lake City, UT, USA"],
	[226, 0, 33.19, -117.25, "Vista, CA, USA"],
	[227, 0, 35.96, -78.69, "Raleigh, NC, USA"],
	[228, 0, 34.1, -117.75, "Pomona, CA, USA"],
	[229, 0, 52.5, 13.46, "Berlin, Germany"],
	[230, 0, -33.96, 151.02, "Padstow, NSW, Australia"],
	[231, 0, 33.7, -117.89, "Santa Ana, CA, USA"],
	[232, 0, 33.95, -118.45, "Playa del Rey, CA, USA"],
	[233, 0, 60.16, 24.87, "Helsinki, Finland"],
	[234, 0, 48.2, 16.34, "Wien, Austria"],
	[235, 0, 43.53, -80.29, "Guelph, ON, Canada"],
	[236, 0, 38.69, -9.3, "Lisbon, Portugal"],
	[237, 0, 22.27, 114.18, "Hong Kong, China"],
	[238, 0, 56.74, 54.16, "Chaikovsky, Russia"],
	[239, 0, 41.95, -88.12, "Bloomingdale, IL, USA"],
	[240, 0, 28.63, 77.07, "New Delhi, India"],
	[241, 0, 55.74, 37.35, "Moscow, Russia"],
	[242, 0, 43.21, -8.68, "Coruna, Spain"],
	[243, 0, 43.53, -80.26, "Guelph, ON, Canada"],
	[244, 0, 25.65, -100.29, "Contry, Mexico"],
	[245, 0, 40.54, -111.82, "Sandy, UT, USA"],
	[245, 0, 33.13, -117.27, "Carlsbad, CA, USA"],
	[248, 0, 45.41, -75.7, "Ottawa, ON, Canada"],
	[248, 0, 45.41, -75.7, "Carlsbad, CA, USA"],
	[249, 0, 43.65, -79.37, "Toronto, ON, Canada"],
	[250, 0, 51.19, 3.19, "Brugge, Belgium"],
	[251, 0, 39.22, 9.06, "Cagliari, Italy"],
	[252, 0, 41.07, 14.33, "Caserta, Italy"],
	[253, 0, 47.74, 26.64, "Botosani, Romania"],
	[254, 0, 51.33, -.41, "Cobham, United Kingdom"],
	[255, 0, 33.64, -117.58, "RSM, CA, USA"],
	[256, 0, -23.55, -46.43, "S\xE3o Paulo, Brazil"],
	[257, 0, -34.9, -56.17, "Montevideo, Uruguay"],
	[258, 0, 61.16, 24.87, "Helsinki, Finland"],
	[259, 0, 33.74, -117.82, "Tustin, CA, USA"],
	[260, 0, 1.34, 103.69, "Jurong West, Singapore"],
	[261, 0, 28.41, 77.11, "Sector 58, India"],
	[262, 0, 43.34, -80.32, "Cambridge, ON, Canada"],
	[263, 0, 54.97, -1.4, "South Shields, United Kingdom"],
	[264, 0, 26.05, -97.64, "San Benito, TX, USA"],
	[265, 0, 40.11, -8.5, "Condeixa, Portugal"],
	[266, 0, 53.21, 5.8, "Leeuwarden, Netherlands"],
	[267, 0, 33.56, -84.61, "Fairburn, GA, USA"],
	[268, 0, 51.12, 17.02, "Wroclaw, Poland"],
	[269, 0, 51.42, -.09, "London, United Kingdom"],
	[270, 0, 59.92, 10.73, "Oslo, Norway"],
	[271, 0, 45.61, -122.49, "Vancouver, WA, USA"],
	[272, 0, 48.81, 2.35, "Le Kremlin-Bic\xC3\xAAtre, France"],
	[273, 0, 21, -157.61, "Honolulu, HI, USA"],
	[274, 0, 42.65, 21.17, "Prishtine, Albania"],
	[275, 0, 46.62, -.92, "La Caill\xC3\xA8re-Saint-Hilaire, France"],
	[276, 0, 51.07, 17, "Wroclaw, Poland"],
	[277, 0, -31.82, 115.75, "Sorrento, WA, Australia"],
	[278, 0, 46.75, 23.59, "Cluj, Romania"],
	[279, 0, 57.66, 12.94, "Bor\xC3\xA5s, Sweden"],
	[280, 0, 45.48, -75.81, "Chelsea, QC, Canada"],
	[281, 0, 40.24, -111.67, "Provo, UT, USA"],
	[282, 0, -33.78, 151.24, "Seaforth, NSW, Australia"],
	[283, 0, 32.51, -85.01, "Phenix City, AL, USA"],
	[284, 0, 37.4, 127.07, "Seongnam-si, South Korea"],
	[285, 0, 29.66, -95.51, "Houston, TX, USA"],
	[286, 0, 42.36, -71.12, "Cambridge, MA, USA"],
	[287, 0, 4.9, -73.94, "Sop\xF3, Colombia"],
	[288, 0, 34.06, -118.29, "Los Angeles, CA, USA"],
	[289, 0, 47.48, 8.69, "Winterthur, Switzerland"],
	[290, 0, 26.01, -80.35, "Pembroke Pines, FL, USA"],
	[291, 0, 32.83, -117.21, "San Diego, CA, USA"],
	[292, 0, 33.71, -117.78, "Irvine, CA, USA"],
	[293, 0, 43.75, -79.45, "Toronto, ON, Canada"],
	[294, 0, 36.73, 10.29, "Bou Mhel el-Bassatine, Tunisia"],
	[295, 0, 39.39, -76.81, "Owings Mills, MD, USA"],
	[296, 0, 51.41, 21.96, "Pulawy, Poland"],
	[297, 0, 51.52, -.11, "London, United Kingdom"],
	[298, 0, -27.56, 152.95, "Darra, QLD, Australia"],
	[299, 0, 47.39, 8.53, "Z\xFCrich, Switzerland"],
	[300, 0, 35.95, -86.8, "Franklin, TN, USA"],
	[301, 0, 38.88, -77.07, "Arlington, VA, USA"],
	[302, 0, 38.81, -9.16, "Lisbon, Portugal"],
	[303, 0, 47.45, 7.74, "Bubendorf, Switzerland"],
	[304, 0, -34.78, -58.41, "Buenos Aires, Argentina"],
	[305, 0, 50.73, -1.85, "Bournemouth, United Kingdom"],
	[306, 0, 31.88, 116.01, "Midland, WA, Australia"],
	[307, 0, -26.19, 28, "Johannesburg, South Africa"],
	[308, 0, 37.5, -122.2, "Redwood City, CA, USA"],
	[309, 0, -38.14, 145.15, "Frankston, VIC, Australia"],
	[310, 0, 39.57, 2.64, "Palma, Balearic Islands, Spain"],
	[311, 0, 59.72, 10.81, "Ski, Norway"],
	[312, 0, 46.57, 15.66, "Maribor, Slovenia"],
	[313, 0, 44.66, -63.6, "Halifax, NS, Canada"],
	[314, 0, 46.36, 15.39, "Zrece, Slovenia"],
	[315, 0, 45.52, -122.97, "Hillsboro, OR, USA"],
	[316, 0, 50.55, 7.22, "Sinzig, Germany"],
	[317, 0, 40.75, -73.96, "New York, NY, USA"],
	[318, 0, 37.8, -122.41, "San Francisco, CA, USA"],
	[319, 0, 45.39, 12.35, "Lido Venezia, Italy"],
	[320, 0, -25.47, -49.28, "Curitiba, Brazil"],
	[321, 0, 52.38, 4.92, "Amsterdam, Netherlands"],
	[322, 0, 53.28, -9.05, "Galway, Ireland"],
	[323, 0, 50.07, 14.42, "Praha, Czech Republic"],
	[324, 0, 44.32, -120.81, "Prineville, OR, USA"],
	[325, 0, 38.21, -85.66, "Louisville, KY, USA"],
	[326, 0, 34.05, -117.93, "West Covina, CA, USA"],
	[327, 0, 53.2, 6.56, "Groningen, Netherlands"],
	[328, 0, 45.45, -122.76, "Portland, OR, USA"],
	[329, 0, 51.43, .17, "Dartford, United Kingdom"],
	[330, 0, 58.39, 15.63, "Link\xC3\xB6ping, Sweden"],
	[331, 0, 51.12, 4.28, "Rupelmonde, Belgium"],
	[332, 0, 37.78, -122.43, "San Francisco, CA, USA"],
	[333, 0, 55.78, 37.58, "Moscow, Russia"],
	[334, 0, 43.61, -79.62, "Mississauga, ON, Canada"],
	[335, 0, 1.34, 103.86, "The Scala, Singapore"],
	[336, 0, 38.81, -77.05, "Alexandria, VA, USA"],
	[337, 0, 40.69, -73.99, "Brooklyn, NY, USA"],
	[338, 0, -33.91, 151.05, "Punchbowl, NSW, Australia"],
	[339, 0, 47.37, 8.52, "Z\xFCrich, Switzerland"],
	[340, 0, 55.69, 12.54, "Copenhagen, Denmark"],
	[341, 0, 37.42, -122.13, "Palo Alto, CA, USA"],
	[342, 0, 0 - 22.92, -43.26, "Rio de Janeiro, Brazil"],
	[343, 0, 52.31, 4.95, "Amsterdam, Netherlands"],
	[344, 0, 50.05, 19.95, "Krak\xF3w, Poland"],
	[345, 0, 41.06, -73.52, "Stamford, CT, USA"],
	[346, 0, 52.2, 21, "Warszawa, Poland"],
	[347, 0, 51.53, -.34, "Greenford, United Kingdom"],
	[348, 0, 33.65, -117.87, "Newport Beach, CA, USA"],
	[349, 0, -33.66, -70.74, "Santiago, Chile"],
	[350, 0, 51.43, -.04, "Sydenham, United Kingdom"],
	[351, 0, 44.86, -.62, "Bordeaux, France"],
	[352, 0, 53.39, 22.77, "Monki, Poland"],
	[353, 0, 43.04, 141.31, "Hokkaido, Japan"],
	[354, 0, 59.62, 17.72, "Sigtuna, Sweden"],
	[355, 0, 48.77, 18.62, "Prievidza, Slovakia"],
	[356, 0, 56.014, -3.8, "Falkirk, United Kingdom"],
	[357, 0, 44.5, 11.82, "Conselice, Italy"],
	[358, 0, 25.78, -80.3, "Miami, FL, USA"],
	[359, 0, 52.38, 4.87, "Amsterdam, Netherlands"],
	[360, 0, 28.91, -81.29, "Debary, FL, USA"],
	[361, 0, 45.85, -72.5, "Drummondville, QC, Canada"],
	[362, 0, 53.49, -2.28, "Salford, United Kingdom"],
	[363, 0, 48.87, 2.38, "Paris, France"],
	[364, 0, 35.92, 14.49, "Saint Julian's, Malta"],
	[365, 0, -24.71, 28.39, "Modimolle, South Africa"],
	[366, 0, 32.05, 34.78, "Tel Aviv, Israel"],
	[367, 0, 32.1, 34.73, "Tel Aviv, Israel"],
	[368, 0, 41.07, 28.78, "Istanbul, Turkey"],
	[369, 0, 39.92, 116.56, "Beijing, China"],
	[370, 0, 40.48, -3.7, "Madrid, Spain"],
	[371, 0, 0 - 1.3, 36.77, "Nairobi, Kenya"],
	[372, 0, 50.38, 30.78, "Kiev, Ukraine"],
	[373, 0, 39.98, -75.14, "Philadelphia, PA, USA"],
	[374, 0, 45.11, 21.24, "Vrsac, Serbia"],
	[375, 0, 43.708, -79.39, "Toronto, ON, Canada"],
	[376, 0, 47.61, -122.35, "Seattle, WA, USA"],
	[377, 0, 46.17, -1.16, "Lagord, France"],
	[378, 0, 4.67, -74.11, "Bogota, Colombia"],
	[379, 0, 49.29, -123.14, "Vancouver, BC, Canada"],
	[380, 0, 51.49, -.02, "London, United Kingdom"],
	[381, 0, 46.349, 16.35, "Puscine, Croatia"],
	[382, 0, 32.03, 34.77, "Holon, Israel"],
	[383, 0, 55.07, -1.52, "Seaton Delaval, United Kingdom"],
	[384, 0, 48.06, -.76, "Laval, France"],
	[385, 0, -33.86, 151.2, "Sydney, NSW, Australia"],
	[386, 0, -27.55, 152.93, "Mount Ommaney, QLD, Australia"],
	[387, 0, 41.02, -74.37, "West Milford, NJ, USA"],
	[388, 0, 43.71, -79.78, "Brampton, ON, Canada"],
	[389, 0, 48.06, -.76, "Laval, France"],
	[390, 0, 53.67, -1.56, "Ossett, United Kingdom"],
	[391, 0, 34.14, -118.47, "Sherman Oaks, CA, USA"],
	[392, 0, 39.95, -75.17, "Philadelphia, PA, USA"],
	[393, 2, 45.27, 19.81, "Novi Sad, Serbia"],
	[394, 0, 41.68, -81.37, "Mentor, OH, USA"],
	[395, 2, 39.54, -119.85, "Reno, NV, USA"],
	[396, 2, 41.7, -93.64, "Ankeny, IA, USA"],
	[397, 2, 45.57, 5.91, "Chamb\xC3\xA9ry, France"],
	[398, 0, 46.07, -64.75, "Riverview, NB, Canada"],
	[399, 2, 28.15, -82.27, "Tampa, FL, USA"],
	[400, 0, 47.84, 12.08, "Rosenheim, Germany"],
	[401, 0, 51.64, -.14, "London, United Kingdom"],
	[402, 2, 45.45, 4.39, "Saint-\xC9tienne, France"],
	[403, 2, 44.75, -79.88, "Midland ON, Canada"],
	[404, 2, 33.91, -86.01, "Gadsden AL, USA"],
	[405, 0, 48.43, -89.23, "Thunder Bay, ON, Canada"],
	[406, 2, 39.69, -84.13, "Kettering, OH, USA"],
	[407, 0, 51.4, -.26, "New Malden, United Kingdom"],
	[408, 0, 41.87, -87.64, "Chicago, IL, USA"],
	[409, 0, 41, 28.73, "Istanbul, Turkey"],
	[410, 0, 54.99, -6.87, "Limavady, United Kingdom"],
	[411, 0, 47.61, -122.33, "Seattle, WA, USA"],
	[412, 0, 45.02, 7.79, "Chieri, Italy"],
	[413, 0, 35.18, -97.42, "Norman, OK, USA"],
	[414, 0, 45.5, -122.92, "Hillsboro, OR, USA"],
	[415, 0, 28.54, -81.36, "Orlando, FL, USA"],
	[416, 0, 42.46, -71.06, "Melrose, MA, USA"],
	[417, 2, -35.2, 173.92, "Kerikeri, New Zealand"],
	[419, 2, 52.06, -.08, "Litlington, United Kingdom"],
	[420, 2, 43.22, -79.98, "Ancaster, ON, Canada"],
	[421, 0, 1.35, 103.93, "Singpaore, Singpaore"],
	[422, 2, 46.82, -92.06, "Duluth, MN, USA"],
	[423, 0, 52.05, 1.17, "Ipswich, United Kingdom"],
	[424, 0, 40.71, -74.28, "Union, NJ, USA"],
	[425, 0, -29.78, 31.02, "Durban, South Africa"],
	[426, 0, 43.88, -79.31, "Markham, ON, Canada"],
	[427, 0, 33.81, -116.45, "Cathedral City, CA, USA"],
	[428, 0, -37.8713221, 144.99, "Balaclava, VIC, Australia"],
	[429, 0, 36.15, -115.32, "Las Vegas, NV, USA"],
	[430, 0, 52.37, 4.87, "Amsterdam, Netherlands"],
	[431, 0, 45.76, 4.78, "Tassin la Demi Lune, France"],
	[432, 0, 50.61, 3.04, "Lille, France"],
	[433, 0, 48.86, 9.24, "Remseck, Germany"],
	[434, 0, 34, -118.45, "Venice, CA, USA"],
	[435, 0, 31.83, 34.73, "Shdema, Israel"],
	[436, 0, 19.43, -99.17, "Mexico City, Mexico"],
	[437, 0, 34.19, -118.16, "Altadena, CA, USA"],
	[438, 0, 32.3, 34.82, "Netanya, Israel"],
	[439, 0, 48.891305, 2.35, "Paris, France"],
	[440, 0, 43.78, -79.4, "North York, ON, Canada"],
	[441, 0, 53.79, -2.69, "Fulwood, United Kingdom"],
	[442, 0, 40.66, -73.93, "Brooklyn, NY, USA"],
	[443, 0, 48.88, 2.41, "Les Lilas, France"],
	[444, 0, 45.51, 10.31, "Rezzato, Italy"],
	[445, 0, -37.96, 145.06, "Cheltenham, VIC, Australia"],
	[446, 0, 40.83, -73.99, "Ridgefield, NJ, USA"],
	[447, 0, 40.46, -86.95, "West Lafayette, IN, USA"],
	[448, 0, 33.97, -118.46, "Venice, CA, USA"],
	[449, 0, -27.45, 153.03, "Fortitude Valley, QLD, Australia"],
	[450, 0, 22.45, 114.17, "Hong Kong, China"],
	[451, 0, 54.7, 25.42, "Vilnius, Lithuania"],
	[452, 0, 31.22, 121.19, "Shanghai, China"],
	[453, 0, -33.86, 151.2, "Sydney, NSW, Australia"],
	[454, 0, 49.1, 22.06, "Pap\xEDn, Slovakia"],
	[455, 0, 51.4, -.77, "Bracknell, United Kingdom"],
	[456, 0, 50.94, 4.73, "Rotselaar, Belgium"],
	[457, 0, 46.91, 8.99, "Linthal, Switzerland"],
	[458, 0, 34.13, -117.95, "Duarte, CA, USA"],
	[459, 0, 36.31, -94.14, "Rogers, AR, USA"],
	[460, 0, 35.13, 33.54, "Nicosia, Cyprus"],
	[461, 0, 39.15, -86.56, "Bloomington, IN, USA"],
	[462, 0, 42.26, 23.1, "Dupnica, Bulgaria"],
	[463, 0, 43.69, -79.29, "Toronto, ON, Canada"],
	[464, 0, 39.1, -84.51, "Cincinnati, OH, USA"],
	[465, 0, 46.45, 30.64, "Odessa, Ukraine"],
	[466, 0, 39.6, -84.15, "Centerville, OH, USA"],
	[467, 0, 35.71, 139.78, "Tokyo, Taito-ku, Japan"],
	[468, 0, 45.5, -73.62, "Montreal, QC, Canada"],
	[469, 0, 39.92, 116.6, "Beijing, China"],
	[470, 0, 53.56, 9.92, "Hamburg, Germany"],
	[471, 0, 55.849285, 37.64, "Moscow, Russia"],
	[472, 0, 24.7255553, 46.54, "Riyadh, Saudi Arabia"],
	[473, 0, 50.8094082, 19.05, "Czestochowa, Poland"],
	[474, 0, 52.2963346, -.25, "Buckden, United Kingdom"],
	[475, 0, 33.5051078, -117.66, "San Juan Capistrano, CA, USA"],
	[476, 0, 37.3199256, -121.94, "San Jose, CA, USA"],
	[477, 0, 38.5837696, -76.55, "Huntingtown, MD, USA"],
	[478, 0, 37.775377, -121.54, "Tracy, CA, USA"],
	[479, 0, 45.29, 19.79, "Novi Sad, Serbia"],
	[480, 0, 40.93, 24.4, "Kavala, Greece"],
	[481, 0, -37.074, 144.2, "Castlemaine, VIC, Australia"],
	[482, 0, 12.99, 77.75, "Bengaluru, India"],
	[483, 0, 51.59, .023, "London, United Kingdom"],
	[484, 0, 39.9, 116.37, "Beijing, China"],
	[485, 0, 59.41, 24.7, "Tallinn, Estonia"],
	[486, 0, 44.5, -80.25, "Collingwood, ON, Canada"],
	[487, 0, 30.39, -97.72, "Austin, TX, USA"],
	[488, 0, 49.25, -122.78, "Port Coquitlam, BC, Canada"],
	[489, 0, 28.25, -82.32, "Wesley Chapel, FL, USA"],
	[490, 0, 44.9, -93.07, "West Saint Paul, MN, USA"],
	[491, 0, 31.94, 34.86, "Nir Zvi, Israel"],
	[492, 0, 40.45, -86.94, "West Lafayette, IN, USA"],
	[493, 0, 22.48, 114.13, "Hong Kong, China"],
	[494, 0, -43.51, 172.57, "Christchurch, New Zealand"],
	[495, 0, 51.1, 17.03, "Wroclaw, Poland"],
	[496, 0, 40.847, -73.94, "New York, NY, USA"],
	[497, 0, 44.84, -.57, "Bordeaux, France"],
	[498, 0, 55.69, 37.67, "Moscow, Russia"],
	[499, 0, 28.43, 117.87, "Jiangxi, China"],
	[500, 0, 30.46, -97.57, "Pflugerville, TX, USA"],
	[501, 0, -34.9, -56.17, "Montevideo, Uruguay"],
	[502, 0, 35.91, -78.75, "Raleigh, NC, USA"],
	[503, 0, 49.44, 11.11, "N\xFCrnberg, Germany"],
	[504, 0, 52.44, 4.8, "Zaandam, Netherland"],
	[505, 0, 29.62, -82.37, "Gainesville, FL, USA"],
	[506, 0, 32.79, -117.24, "San Diego, CA, USA"],
	[507, 0, 33.59, -117.25, "Wildomar, CA, USA"],
	[508, 0, 48.21, 16.34, "Wien, Austria"],
	[509, 0, 12.97, 77.59, "Bangalore, India"],
	[510, 0, 45.59, -122.46, "Camas, WA, USA"],
	[511, 0, 51.42, .05, "London, United Kingdom"],
	[512, 0, 52.3, 4.67, "Hoofddorp, Netherlands"],
	[513, 0, -1.31, 36.81, "Nairobi, Kenya"],
	[514, 0, -12.0685907, -77.05, "Lima, Peru"],
	[515, 0, -37.8136119, 144.99, "Richmond, VIC, Australia"],
	[516, 0, 40.5051074, -89.01, "Normal, IL, USA"],
	[517, 0, 6.0621705, 102.2, "Pasir Mas, Malaysia"],
	[518, 0, 44.5607668, 27.35, "Slobozia, Romania"],
	[519, 0, 41.6138608, -93.69, "Des Moines, IA, USA"],
	[520, 0, 45.6839121, -122.56, "Vancouver, WA, USA"],
	[521, 0, 52.3328093, 6.65, "Almelo, Netherlands"],
	[522, 0, 46.0339753, 8.67, "Trarego, Italy"],
	[523, 0, 40.9132133, -74.61, "Wharton, NJ, USA"],
	[524, 0, 53.3410437, -6.3, "Dublin, Ireland"],
	[525, 0, 45.4038154, -122.6, "Milwaukie, OR, USA"],
	[526, 0, 32.4997135, -117.12, "Tijuana, Mexico"],
	[527, 0, 55.9524765, -3.2, "Edinburgh, United Kingdom"],
	[528, 0, 34.2665786, -119.27, "Ventura, CA, USA"],
	[529, 0, 54.6864503, 25.3, "Vilnius, Lithuania"],
	[530, 0, 52.3746877, 4.87, "Amsterdam, Netherlands"],
	[531, 0, 40.2745958, -111.63, "Provo, UT, USA"],
	[532, 0, 30.3019953, 78.05, "Dehradun, India"],
	[533, 0, 53.2381354, -.58, "Lincoln, United Kingdom"],
	[534, 0, 37.8038781, -122.4, "San Francisco, CA, USA"],
	[535, 0, 45.498193, -73.65, "Montreal, QC, Canada"],
	[536, 0, -7.7812061, 110.4, "Yogyakarta, Indonesia"],
	[537, 0, 33.698458, -117.72, "Irvine, CA, USA"],
	[538, 0, 37.1744091, -3.6, "Almer\xEDa, Spain"],
	[539, 0, 25.0701718, 55.13, "Dubai, United Arab Emirates"],
	[540, 0, -25.2939002, -57.67, "Asuncion, Paraguay"],
	[541, 0, -33.88542, 18.48, "Cape Town, South Africa"],
	[542, 0, 39.1329145, -76.62, "Glen Burnie, MD, USA"],
	[543, 0, 38.8112256, -77.13, "Alexandria, VA, USA"],
	[544, 0, 43.836251, 18.29, "Sarajevo, Bosnia and Herzegovina"],
	[545, 0, 47.151451, 24.51, "Bistrita, Romania"],
	[546, 0, 50.70359, 7.09, "Bonn, Germany"],
	[547, 0, 36.4085442, -6.16, "C\xE1diz, Spain"],
	[548, 0, 38.75924, -77.22, "Springfield, VA, USA"],
	[549, 0, 49.889739, 18.81, "Mnich, Poland"],
	[550, 0, 38.9932599, -92.17, "Columbia, MO, USA"],
	[551, 0, 40.7139205, -73.96, "Brooklyn, NY, USA"],
	[552, 0, 47.6197812, -122.2, "Bellevue, WA, USA"],
	[553, 0, 33.0222951, -96.72, "Plano, TX, USA"],
	[554, 0, -23.6165678, -46.68, "Sao Paulo, Brazil"],
	[555, 0, 48.8642676, 2.2, "Suresnes, France"],
	[600, 1, 50.79, -2.6, "Dorset, United Kingdom"],
	[600, 1, 52.54, 1.26, "Norwich, United Kingdom"],
	[600, 1, 51.52, -.24, "London, United Kingdom"],
	[600, 1, 50.83, -.14, "Brighton, United Kingdom"],
	[600, 1, 51.44, -.36, "Twickenham, United Kingdom"],
	[600, 1, 53.22, -4.16, "Bangor, United Kingdom"],
	[600, 1, 52.47, -1.93, "Birmingham, United Kingdom"],
	[600, 1, 53.41, -2.98, "Liverpool, United Kindom"],
	[600, 1, 53.8, -1.6, "Leeds, United Kingdom"],
	[600, 1, 51.5, -3.23, "Cardiff, United Kingdom"],
	[600, 1, 51.46, -2.66, "Bristol, United Kindom"],
	[600, 1, 55.85, -4.3, "Glasgow, United Kingdom"],
	[600, 1, 55.94, -3.27, "Edinburgh, United Kingdom"],
	[600, 1, 53.47, -2.29, "Manchester, United Kingdom"],
	[600, 1, 54.59, -5.99, "Belfast, Northern Ireland"],
	[600, 1, 50.91, -1.43, "Southampton, United Kingdom"],
	[600, 1, 50.83, -.14, "Brighton, United Kingdom"],
	[600, 1, 50.38, -4.14, "Plymouth, United Kingdom"],
	[600, 1, 52.19, .08, "Cambridge, United Kingdom"],
	[600, 1, 51.27, 1.06, "Canterbury, United Kingdom"],
	[600, 1, 51.38, -2.39, "Bath, United Kingdom"],
	[600, 1, 51.45, -1.03, "Reading, United Kingdom"],
	[600, 1, 52.96, -1.49, "East Midlands, United Kingdom"],
	[600, 1, 23.27, 113.18, "Hong Kong, China"],
	[600, 1, 52.37, 4.82, "Amsterdam, Netherlands"],
	[600, 1, 50.62, 5.52, "Liege, Belgium"],
	[600, 1, 51.93, 4.6, "The Hague, Netherlands"],
	[600, 1, 59.33, 18.04, "Stockholm, Sweden"],
	[600, 1, 52.38, 4.66, "Haarlem, Netherlands"],
	[600, 1, 54.34, 10.05, "Kiel, Germany"],
	[600, 1, 53.55, 9.78, "Hamburg, Germany"],
	[600, 1, 12.95, 77.49, "Bengaluru, India"],
	[600, 1, 48.85, 2.27, "Paris, France"],
	[600, 1, 41.39, 2.07, "Barcelona, Spain"],
	[600, 1, 45.29, 19.85, "Novi Sad, Serbia"],
	[600, 1, 12.95, 77.51, "Bengaluru, India"],
	[600, 1, 48.86, 2.27, "Paris, France"],
	[600, 1, 6.55, 3.14, "Lagos, Nigeria"],
	[600, 1, 49.87, 8.58, "Darmstadt, Germany"],
	[600, 1, 36.19, -5.92, "Vejer De La Frontera, Spain"],
	[600, 1, 45.46, 9.14, "Milan, Italy"],
	[600, 1, 46.3, 25.28, "Odorheiu Secuies, Romania"],
	[600, 1, 47.07, 15.37, "Graz, Austria"],
	[600, 1, 47.1, 15.4, "Graz, Austria"],
	[600, 1, 52.5, 13.28, "Berlin, Germany"],
	[600, 1, 50.95, 6.82, "Cologne, Germany"],
	[600, 1, 50.12, 8.49, "Frankfurt, Germany"],
	[600, 1, 50.15, 8.52, "Frankfurt, Germany"],
	[600, 1, 48.18, 11.5, "Munich, Germany"],
	[600, 1, 48.15, 11.47, "Munich, Germany"],
	[600, 1, 48.77, 9.1, "Stuttgart, Germany"],
	[600, 1, 44.81, 20.28, "Belgrade, Serbia"],
	[600, 1, 47.55, 7.55, "Basel, Switzerland"],
	[600, 1, 46.95, 7.35, "Bern, Switzerland"],
	[600, 1, 46.2, 6.1, "Geneva, Switzerland"],
	[600, 1, 47.36, 8.66, "Greifensee, Switzerland"],
	[600, 1, 46.68, 7.84, "Interlaken, Switzerland"],
	[600, 1, 47.05, 8.24, "Lucerne, Switzerland"],
	[600, 1, 47.35, 8.7, "Uster, Switzerland"],
	[600, 1, 47.37, 8.46, "Zurich, Switzerland"],
	[600, 1, 47.08, 2.32, "Bourges, France"],
	[600, 1, 41.16, -8.65, "Porto, Portugal"],
	[600, 1, 47.15, 8.48, "Zug, Switzlerland"],
	[600, 1, 47.42, 9.29, "St. Galen, Switzerland"],
	[600, 1, 47.4, 8.53, "Oerlikon, Switzerland"],
	[600, 1, 19.7, -101.24, "Morelia, Michoac\xE1n, M\xE9xico"],
	[600, 1, 38.66, -121.53, "Sacramento, CA, USA"],
	[600, 0, 30.5, -97.85, "Cedar Park, TX, USA"],
	[600, 1, 35.66, -97.47, "Edmond, OK, USA"],
	[600, 1, 35.15, -101.84, "Amarillo, TX, USA"],
	[600, 1, 34, -118.5, "Santa Monica, CA, USA"],
	[600, 1, 34.08, -118.41, "Beverly Hills, CA, USA"],
	[600, 1, 34.05, -118.42, "Century City, CA, USA"],
	[600, 1, 34.06, -118.45, "Westwood, CA, USA"],
	[600, 1, 33.98, -118.48, "Venice Beach, CA, USA"],
	[600, 1, 34.19, -118.4, "Hollywood, CA, USA"],
	[600, 1, 34.23, -118.55, "Northridge, CA, USA"],
	[600, 1, 34.18, -118.95, "Thousand Oaks, CA, USA"],
	[600, 1, 34.18, -118.2, "Pasadena, CA, USA"],
	[600, 1, 34.02, -118.31, "Los Angeles, CA, USA"],
	[600, 1, 34.07, -118.35, "Los Angeles, CA, USA"],
	[600, 1, 34.3, -118.45, "Los Angeles, CA, USA"],
	[600, 1, 34.25, -118.4, "Los Angeles, CA, USA"],
	[600, 1, 34.2, -118.35, "Los Angeles, CA, USA"],
	[600, 1, 34.15, -118.3, "Los Angeles, CA, USA"],
	[600, 1, 34.1, -118.25, "Los Angeles, CA, USA"],
	[600, 1, 34.05, -118.2, "Los Angeles, CA, USA"],
	[600, 1, 34, -118.15, "Los Angeles, CA, USA"],
	[600, 1, 33.95, -118.1, "Los Angeles, CA, USA"],
	[600, 1, 33, -117.97, "Los Angeles, CA, USA"],
	[600, 1, 33.9, -118.05, "Los Angeles, CA, USA"],
	[600, 1, 33.85, -118, "Los Angeles, CA, USA"],
	[600, 1, 33.8, -117.95, "Los Angeles, CA, USA"],
	[600, 1, 33.75, -117.9, "Los Angeles, CA, USA"],
	[600, 1, 37.87, -122.33, "Berkeley, CA, USA"],
	[600, 1, 37.29, -121.95, "San Jose, CA, USA"],
	[600, 1, 37.37, -122, "Santa Clara, CA, USA"],
	[600, 1, 37.29, -122.02, "Santa Clara, CA, USA"],
	[600, 1, 37.39, -122.09, "Sunnyvale, CA, USA"],
	[600, 1, 37.41, -122.11, "Mountain View, CA, USA"],
	[600, 1, 37.42, -122.17, "Palo Alto, CA, USA"],
	[600, 1, 37.51, -122.28, "Redwood City, CA, USA"],
	[600, 1, 37.31, -122.07, "Cupertino, CA, USA"],
	[600, 1, 37.23, -121.98, "Los Gatos, CA, USA"],
	[600, 1, 37.79, -122.29, "Oakland, CA, USA"],
	[600, 1, 37.79, -122.21, "Oakland, CA, USA"],
	[600, 1, 37.29, -121.95, "San Jose, CA, USA"],
	[600, 1, 37.27, -121.82, "San Jose, CA, USA"],
	[600, 1, 37.73, -122.51, "San Francisco, CA USA"],
	[600, 1, 37.7, -122.5, "San Francisco, CA USA"],
	[600, 1, 37.65, -122.45, "San Francisco, CA USA"],
	[600, 1, 37.6, -122.4, "San Francisco, CA USA"],
	[600, 1, 37.55, -122.35, "San Francisco, CA USA"],
	[600, 1, 37.5, -122.3, "San Francisco, CA USA"],
	[600, 1, 37.45, -122.25, "San Francisco, CA USA"],
	[600, 1, 39.13, -84.61, "Cincinnati, OH, USA"],
	[600, 1, 39.15, -84.63, "Cincinnati, OH, USA"],
	[600, 1, 39.17, -84.65, "Cincinnati, OH, USA"],
	[600, 1, 39.16, -84.65, "Cincinnati, OH, USA"],
	[600, 1, 39.17, -84.87, "Cincinnati, OH, USA"],
	[600, 1, 39.17, -84.29, "Cincinnati, OH, USA"],
	[600, 1, 39.12, -84.3, "Cincinnati, OH, USA"],
	[600, 1, 39.22, -84.33, "Cincinnati, OH, USA"],
	[600, 1, 39.23, -84.39, "Cincinnati, OH, USA"],
	[600, 1, 39.21, -84.64, "Cincinnati, OH, USA"],
	[600, 1, 39.28, -84.64, "Cincinnati, OH, USA"],
	[600, 1, 38.93, -84.59, "Cincinnati, OH, USA"],
	[600, 1, 38.95, -84.27, "Cincinnati, OH, USA"],
	[600, 1, 39.15, -84.23, "Cincinnati, OH, USA"],
	[600, 1, 40.7, -74.11, "New York, NY, USA"],
	[600, 1, 40.7, -73.83, "New York, NY, USA"],
	[600, 1, 40.87, -73.92, "New York, NY, USA"],
	[600, 1, 40.7, -73.92, "New York, NY, USA"],
	[600, 1, 40.75, -73.8, "New York, NY, USA"],
	[600, 1, 40.8, -73.85, "New York, NY, USA"],
	[600, 1, 40.85, -73.9, "New York, NY, USA"],
	[600, 1, 40.72, -73.91, "New York, NY, USA"],
	[600, 1, 40.74, -73.81, "New York, NY, USA"],
	[600, 1, 40.76, -73.81, "New York, NY, USA"],
	[600, 1, 40.78, -112.05, "Salt Lake City, UT, USA"],
	[600, 1, 40.79, -111.85, "Salt Lake City, UT, USA"],
	[600, 1, 40.77, -111.87, "Salt Lake City, UT, USA"],
	[600, 1, 40.77, -111.89, "Salt Lake City, UT, USA"],
	[600, 1, 40.77, -111.91, "Salt Lake City, UT, USA"],
	[600, 1, 40.79, -111.93, "Salt Lake City, UT, USA"],
	[600, 1, 40.75, -111.95, "Salt Lake City, UT, USA"],
	[600, 1, 40.73, -111.97, "Salt Lake City, UT, USA"],
	[600, 1, 40.77, -111.99, "Salt Lake City, UT, USA"],
	[600, 1, 40.73, -111.93, "Salt Lake City, UT, USA"],
	[600, 1, 40.71, -111.93, "Salt Lake City, UT, USA"],
	[600, 1, 39.76, -104.99, "Denver, CO, USA"],
	[600, 1, 39.76, -104.96, "Denver, CO, USA"],
	[600, 1, 39.76, -104.93, "Denver, CO, USA"],
	[600, 1, 39.76, -104.9, "Denver, CO, USA"],
	[600, 1, 39.74, -104.96, "Denver, CO, USA"],
	[600, 1, 39.74, -104.93, "Denver, CO, USA"],
	[600, 1, 39.74, -104.9, "Denver, CO, USA"],
	[600, 1, 39.72, -104.96, "Denver, CO, USA"],
	[600, 1, 39.72, -104.93, "Denver, CO, USA"],
	[600, 1, 42.35, -71.07, "Boston, MA, USA"],
	[600, 1, 42.34, -71.05, "Boston, MA, USA"],
	[600, 1, 42.33, -71.03, "Boston, MA, USA"],
	[600, 1, 42.32, -71.01, "Boston, MA, USA"],
	[600, 1, 42.31, -71.03, "Boston, MA, USA"],
	[600, 1, 42.3, -71.05, "Boston, MA, USA"],
	[600, 1, 32.7, -117.05, "San Diego, CA, USA"],
	[600, 1, 32.72, -117.07, "San Diego, CA, USA"],
	[600, 1, 32.74, -117.09, "San Diego, CA, USA"],
	[600, 1, 32.7, -117.09, "San Diego, CA, USA"],
	[600, 1, 32.72, -117.11, "San Diego, CA, USA"],
	[600, 1, 32.74, -117.13, "San Diego, CA, USA"],
	[600, 1, 47.61, -122.41, "Seattle, WA, USA"],
	[600, 1, 47.24, -122.5, "Tacoma, WA, USA"],
	[600, 1, 47.24, -122.48, "Tacoma, WA, USA"],
	[600, 1, 47.22, -122.52, "Tacoma, WA, USA"],
	[600, 1, 47.22, -122.5, "Tacoma, WA, USA"],
	[600, 1, 33.72, -84.47, "Atlanta, GA, USA"],
	[600, 1, 33.74, -84.49, "Atlanta, GA, USA"],
	[600, 1, 33.76, -84.51, "Atlanta, GA, USA"],
	[600, 1, 33.78, -84.53, "Atlanta, GA, USA"],
	[600, 1, 30.31, -97.73, "Austin, TX, USA"],
	[600, 1, 30.33, -97.75, "Austin, TX, USA"],
	[600, 1, 30.35, -97.77, "Austin, TX, USA"],
	[600, 1, 30.31, -97.79, "Austin, TX, USA"],
	[600, 1, 30.31, -97.77, "Austin, TX, USA"],
	[600, 1, 30.29, -97.73, "Austin, TX, USA"],
	[600, 1, 41.83, -87.87, "Chicago, IL, USA"],
	[600, 1, 41.81, -87.89, "Chicago, IL, USA"],
	[600, 1, 41.8, -87.91, "Chicago, IL, USA"],
	[600, 1, 41.79, -87.93, "Chicago, IL, USA"],
	[600, 1, 41.77, -87.95, "Chicago, IL, USA"],
	[600, 1, 41.75, -87.97, "Chicago, IL, USA"],
	[600, 1, 41.73, -87.99, "Chicago, IL, USA"],
	[600, 1, 40, -75.18, "Philadelphia, PA, USA"],
	[600, 1, 40, -75.16, "Philadelphia, PA, USA"],
	[600, 1, 40, -75.14, "Philadelphia, PA, USA"],
	[600, 1, 40, -75.12, "Philadelphia, PA, USA"],
	[600, 1, 40, -75.1, "Philadelphia, PA, USA"],
	[600, 1, 40, -75.08, "Philadelphia, PA, USA"],
	[600, 0, 38.87, -77.06, "Washington, DC, USA"],
	[600, 0, 38.85, -77.04, "Washington, DC, USA"],
	[600, 0, 38.83, -77.02, "Washington, DC, USA"],
	[600, 0, 38.81, -77, "Washington, DC, USA"],
	[600, 0, 38.87, -77.04, "Washington, DC, USA"],
	[600, 0, 38.85, -77.06, "Washington, DC, USA"],
	[600, 1, 25.78, -80.3, "Miami, FL, USA"],
	[600, 1, 25.75, -80.28, "Miami, FL, USA"],
	[600, 1, 25.78, -80.26, "Miami, FL, USA"],
	[600, 1, 25.75, -80.24, "Miami, FL, USA"],
	[600, 1, 25.78, -80.22, "Miami, FL, USA"],
	[600, 1, 39.28, -76.69, "Baltimore, MD, USA"],
	[600, 1, 39.3, -76.71, "Baltimore, MD, USA"],
	[600, 1, 39.28, -76.67, "Baltimore, MD, USA"],
	[600, 1, 39.3, -76.65, "Baltimore, MD, USA"],
	[600, 1, 32.82, -96.87, "Dallas, TX, USA"],
	[600, 1, 32.8, -96.85, "Dallas, TX, USA"],
	[600, 1, 32.78, -96.83, "Dallas, TX, USA"],
	[600, 1, 41.76, -72.715, "Hartford, CT, USA"],
	[600, 1, 41.74, -72.713, "Hartford, CT, USA"],
	[600, 1, 41.72, -72.711, "Hartford, CT, USA"],
	[600, 1, 36.18, -87.06, "Nashville, TN, USA"],
	[600, 1, 36.18, -87.04, "Nashville, TN, USA"],
	[600, 1, 36.18, -87.02, "Nashville, TN, USA"],
	[600, 1, 33.6, -112.4, "Phoenix, AZ, USA"],
	[600, 1, 45.54, -122.72, "Portland, OR, USA"],
	[600, 1, 45.52, -122.7, "Portland, OR, USA"],
	[600, 1, 45.5, -122.68, "Portland, OR, USA"],
	[600, 1, 27.95, -82.45, "Tampa, FL, USA"],
	[600, 1, 35.2, -80.98, "Charlotte, NC, USA"],
	[600, 1, 35.22, -80.93, "Charlotte, NC, USA"],
	[600, 1, 35.28, -80.91, "Charlotte, NC, USA"],
	[600, 1, 39.98, -83.13, "Columbus, OH, USA"],
	[600, 1, 39.98, -83.11, "Columbus, OH, USA"],
	[600, 1, 39.98, -83.09, "Columbus, OH, USA"],
	[600, 1, 42.35, -83.23, "Detroit, MI, USA"],
	[600, 1, 42.33, -83.21, "Detroit, MI, USA"],
	[600, 1, 42.31, -83.19, "Detroit, MI, USA"],
	[600, 1, 44.95, -93.31, "Minneapolis, MN, USA"],
	[600, 1, 44.97, -93.33, "Minneapolis, MN, USA"],
	[600, 1, 44.99, -93.35, "Minneapolis, MN, USA"],
	[600, 1, 37.27, -79.99, "Roanoke, VA, USA"],
	[600, 1, 37.38, -79.19, "Lynchburg, VA, USA"],
	[600, 1, 37.4, -79.21, "Lynchburg, VA, USA"],
	[600, 1, 38.65, -90.31, "St. Louis, MO, USA"],
	[600, 1, 38.65, -90.31, "St. Louis, MO, USA"],
	[600, 1, 42.89, -78.92, "Buffalo, NY, USA"],
	[600, 1, 42.89, -78.9, "Buffalo, NY, USA"],
	[600, 1, 38.87, -104.89, "Colorado Springs, CO, USA"],
	[600, 1, 38.87, -104.89, "Colorado Springs, CO, USA"],
	[600, 1, 34.83, -82.39, "Greenville, SC, USA"],
	[600, 1, 34.83, -82.37, "Greenville, SC, USA"],
	[600, 1, 43.05, -88.03, "Milwaukee, WI, USA"],
	[600, 1, 43.03, -88.01, "Milwaukee, WI, USA"],
	[600, 1, 28.39, -81, "Orlando, FL, USA"],
	[600, 1, 28.39, -81.02, "Orlando, FL, USA"],
	[600, 1, 36.15, -96.01, "Tulsa, OK, USA"],
	[600, 1, 36.15, -96.01, "Tulsa, OK, USA"],
	[600, 1, 26.74, -80.19, "West Palm Beach, FL, USA"],
	[600, 1, 26.74, -80.21, "West Palm Beach, FL, USA"],
	[600, 1, 42.66, -73.84, "Albany, NY, USA "],
	[600, 1, 41.96, -91.73, "Cedar Rapids, IA, USA"],
	[600, 1, 37.99, -87.57, "Evansville, IN, USA"],
	[600, 1, 36.78, -119.93, "Fresno, CA, USA"],
	[600, 1, 44.52, -88.02, "Green Bay, WI, USA"],
	[600, 1, 36.1, -79.9, "Greensbro, NC, USA"],
	[600, 1, 42.95, -85.73, "Grand Rapids, MI, USA"],
	[285, 1, 29.66, -95.53, "Houston, TX, USA"],
	[600, 1, 39.77, -86.27, "Indianapolis, IN, USA"],
	[600, 1, 39.09, -94.71, "Kansas City, MO, USA"],
	[600, 1, 38.03, -84.61, "Lexington, KY, USA"],
	[600, 1, 38.18, -85.81, "Louisville, KY, USA"],
	[600, 1, 35.12, -90.11, "Memphis, TN, USA"],
	[600, 1, 35.48, -97.61, "Oklahoma City, OK, USA"],
	[600, 1, 40.44, -79.94, "Pittsburgh, PA, USA"],
	[600, 1, 43.67, -70.29, "Portland, ME, USA"],
	[600, 1, 35.84, -78.71, "Raleigh, NC, USA"],
	[600, 1, 27.77, -82.74, "St. Petersberg, FL, USA"],
	[600, 1, 27.83, -82.63, "St. Petersberg, FL, USA"],
	[600, 1, 35.53, -82.63, "Asheville, NC, USA"],
	[600, 1, 27.64, -80.41, "Vero Beach, FL, USA"],
	[600, 1, 42.49, -90.74, "Dubuqu, IA, USA"],
	[600, 1, 36.31, -119.36, "Visalia, CA, USA"],
	[600, 1, 47.67, -117.48, "Spokane, WA, USA"],
	[600, 1, 33.74, -117.66, "Silverado, CA, USA"],
	[600, 1, 35.08, -106.81, "Albuquerque, NM, USA"],
	[600, 1, 33.75, -112.46, "Peoria, AZ, USA"],
	[600, 1, 33.39, -111.99, "Tempe, AZ, USA"],
	[600, 1, 35.18, -111.64, "Flagstaff, AZ, USA"],
	[600, 1, 33.67, -111.99, "Scottsdale, AZ, USA"],
	[600, 1, 33.29, -111.83, "Gilbert, AZ, USA"],
	[600, 1, 33.66, -112.52, "Surprise, AZ, USA"],
	[600, 1, 37.33, -119.58, "Bass Lake, CA, USA"],
	[600, 1, 34.148, -117.43, "San Bernardino, CA, USA"],
	[600, 1, 33.5, -117.19, "Temecula, CA, USA"],
	[600, 1, 33.43, -117.68, "San Clemente, CA, USA"],
	[600, 1, 38.56, -121.58, "Sacramento, CA, USA"],
	[600, 1, 36.96, -120.11, "Madera, CA, USA"],
	[600, 1, 35.32, -119.15, "Bakersfield, CA, USA"],
	[600, 1, 35.27, -120.7, "San Luis Obispo, CA, USA"],
	[600, 1, 37.61, -119.03, "Mammoth Lakes, CA, USA"],
	[600, 1, 33.74, -116.43, "Palm Desert, CA, USA"],
	[600, 1, 33.88, -117.27, "Riverside, CA, USA"],
	[600, 1, 33.22, -117.38, "Oceanside, CA. USA"],
	[600, 1, 33.54, -117.81, "Laguna Beach, CA, USA"],
	[600, 1, 38.55, -121.77, "Davis, CA, USA"],
	[600, 1, 37.33, -119.67, "Oakhurst, CA, USA"],
	[600, 1, 33.36, -117.25, "Fallbrook, CA, USA"],
	[600, 1, 36.82, -119.71, "Clovis, CA, USA"],
	[600, 1, 36.59, -121.88, "Monterey, CA, USA"],
	[600, 1, 36.97, -122.06, "Santa Cruz, CA, USA"],
	[600, 1, 37.27, -107.9, "Durango, CO, USA"],
	[600, 1, 38.26, -104.66, "Pueblo, CO, USA"],
	[600, 1, 39.68, -104.82, "Aurora, CO, USA"],
	[600, 1, 40.55, -105.13, "Fort Collins, CO, USA"],
	[600, 1, 39.19, -106.85, "Aspen, CO, USA"],
	[600, 1, 41.29, -72.96, "New Haven, CT, USA"],
	[600, 1, 39.15, -75.54, "Dover, CT, USA"],
	[600, 1, 30.34, -81.86, "Jacksonville, FL, USA"],
	[600, 1, 29.68, -82.38, "Gainsville, FL, USA"],
	[600, 1, 30.46, -84.32, "Tallahassee, FL, USA"],
	[600, 1, 33.94, -83.45, "Athens, GA, USA"],
	[600, 1, 43.6, -116.37, "Boise, ID, USA"],
	[600, 1, 47.7, -116.82, "Coeur d'Alene, ID, USA"],
	[600, 1, 44.93, -93.14, "St. Paul, MN, USA"],
	[600, 1, 46.59, -112.05, "Helena, MT, USA"],
	[600, 1, 40.61, -73.67, "Oceanside, NY, USA"],
	[600, 1, 35.68, -106.05, "Santa Fe, NM, USA"],
	[600, 1, 36.12, -115.31, "Las Vegas, NV, USA"],
	[600, 1, 44.06, -121.38, "Bend, OR, USA"],
	[600, 1, 46.18, -123.83, "Astoria, OR, USA"],
	[600, 1, 40.17, -75.11, "Hatboro, PA, USA"],
	[600, 1, 39.75, -75.4, "Philadelphia, PA, USA"],
	[600, 1, 35.2, -101.87, "Amarillo, TX, USA"],
	[600, 1, 38.81, -77.1, "Alexandria, VA, USA"],
	[1e3, 1, 37.78, -122.41, "San Francisco, CA, USA"],
	[1001, 1, 38.65, -75.09, "Bristol, PA, USA"],
	[1002, 1, 33.64, -117.58, "RSM, CA, USA"],
	[1003, 1, 37.78, -122.26, "Alameda, CA, USA"],
	[1004, 1, 40.71, -74.01, "New York, NY, USA"],
	[1005, 1, 21.4, -157.81, "Haleiwa, HI, USA"],
	[1006, 1, 30.46, -97.85, "Cedar Park, TX, USA"],
	[1007, 1, 34.15, -118.12, "Pasadena, CA, USA"],
	[1008, 2, 47.27, -122.49, "Tacoma, WA, USA"],
	[1009, 2, 33.57, -117.23, "Murrieta, CA, USA"],
	[1010, 2, 33.67, -117.84, "Irvine, CA, USA"],
	[1011, 2, 33.53, -117.72, "Laguna Niguel, CA, USA"],
	[1012, 2, 42.24, -71.59, "Hopkinton, MA, USA"],
	[1013, 2, 32.72, -117.01, "Spring Valley, CA, USA"],
	[1014, 2, 45.5, -122.61, "Portland, OR, USA"],
	[1015, 2, 33.62, -117.61, "RSM, CA, USA"],
	[1016, 2, 33.43, -117.65, "San Clemente, CA, USA"],
	[1017, 2, 33.57, -117.74, "Aliso Viejo, CA, USA"],
	[1018, 2, 33.6, -112.21, "Peoria, AZ, USA"],
	[1019, 2, 33.5, -117.15, "Temecula, CA, USA"]],
dataMedia =
		[["PHOTO", 2, 33.75, -118, "Las Flores, CA, USA",
			"https://twitter.com/shanemielke/status/821813139599540227"],
		["PHOTO", 2, 33.5, -117.7, "Irvine, CA, USA",
			"https://twitter.com/lolozinss/status/827557029950599168"],
		["PHOTO", 2, 33.25, -117.5, "Huntington Beach, CA, USA",
			"https://twitter.com/jasonwhittemore/status/830156808794705920"],
		["PHOTO", 2, 33, -117.2, "Newport Beach, CA, USA",
			"https://twitter.com/gregchristian/status/827978438354952192"],
		["PHOTO", 2, 34, -118.27, "Los Angeles, CA, USA",
			"https://twitter.com/victorbme/status/822622091333791744"],
		["PHOTO", 2, 33.75, -118.5, "Los Angeles, CA, USA",
			"https://twitter.com/iJess/status/829055755663745024"],
		["PHOTO", 1, 33.5, -118.23, "Santa Monica, CA, USA",
			"https://twitter.com/_micahcarroll/status/856185707101999105"],
		["PHOTO", 2, 33.25, -118.04, "Carlsbad, CA, USA",
			"https://twitter.com/aidanrunner/status/831191865231699968"],
		["PHOTO", 2, 33, -117.75, "Escondido, CA, USA",
			"https://www.instagram.com/p/BQ6iILqAjhY/"],
		["PHOTO", 1, 32.75, -117.47, "San Diego, CA, USA",
			"https://twitter.com/SYLVIA38/status/883792407707254784"],
		["PHOTO", 2, 32.5, -117.18, "San Diego, CA, USA",
			"https://twitter.com/bymattlee/status/828858960253898752"],
		["PHOTO", 2, 37.75, -122.03, "Lafayette, CA, USA",
			"https://twitter.com/ParkerHendo/status/823744638607462402"],
		["PHOTO", 2, 37.8, -122.47, "San Francisco, CA, USA",
			"https://twitter.com/mscccc/status/829143195464241153"],
		["VIDEO", 1, 37.46, -122.18, "San Francisco, CA, USA",
			"https://twitter.com/DannPetty/status/882513242261569537"],
		["PHOTO", 1, 37.24, -121.72, "San Jose, CA, USA",
			"https://twitter.com/AdobeXD/status/869647616044285952"],
		["PHOTO", 0, 38.02, -84.61, "Lexington, KY, USA",
			"https://twitter.com/TAdamMartin/status/825575387270959108"],
		["PHOTO", 0, 51.52, -.24, "London, United Kingdom",
			"https://twitter.com/SimeoneSergio/status/825694978093547522"],
		["PHOTO", 2, 43.63, -79.47, "Toronto, ON, Canada",
			"https://twitter.com/serjkozlov/status/826557797630353412"],
		["PHOTO", 2, 59.27, 18.04, "Stockholm, Sweden",
			"https://twitter.com/mannenmedhatten/status/826793675426500610"],
		["PHOTO", 2, 41.87, -87.97, "Chicago, IL, USA",
			"https://twitter.com/designagencyhq/status/826952760738381824"],
		["PHOTO", 2, 40.16, -105.13, "Boulder, CO, USA",
			"https://twitter.com/chadtotaro/status/827199681696497664"],
		["PHOTO", 2, 40.61, -89.5, "Morton, IL, USA",
			"https://www.instagram.com/p/BTAx40mgHO7/"],
		["PHOTO", 2, 51.6, .64, "Hockley, United Kingdom",
			"https://twitter.com/dbfxstudio/status/829415311204089858"],
		["PHOTO", 2, -25.15, 27.01, "Johannesburg, South Africa",
			"https://twitter.com/tPelmir/status/829608844212977664"],
		["PHOTO", 1, 50.62, 5.52, "Liege, Belgium",
			"https://twitter.com/luruke/status/829638673306177536"],
		["PHOTO", 2, 50.86, 4.35, "Brussels, Belgium",
			"https://twitter.com/prz3mas/status/829787638399897601"],
		["VIDEO", 2, 55.69, 12.54, "Copenhagen, Denmark",
			"https://twitter.com/bomouridsen/status/836705854695038976"],
		["PHOTO", 1, 27.95, -82.45, "Tampa, FL, USA",
			"https://twitter.com/aarongreenlee/status/862330314793865217"],
		["PHOTO", 2, 51.02, -114.14, "Calgary, AB, Canada",
			"https://twitter.com/wearecamp/status/824362755217973248"],
		["PHOTO", 1, 40.77, -112.06, "Salt Lake City, UT, USA",
			"https://twitter.com/canvascreative/status/872858003237728256"],
		["PHOTO", 1, 35.2, -101.87, "Amarillo, TX, USA",
			"https://twitter.com/stevebargas/status/884863267402862592"],
		["PHOTO", 1, 41.39, 2.07, "Barcelona, Spain",
			"https://twitter.com/bluemag/status/885443767544807424"],
		["PHOTO", 1, 40.71, -74.01, "New York, NY, USA",
			"https://twitter.com/EpicallyHarshed/status/887364215677345794"],
		["PHOTO", 1, 35.53, -82.63, "Asheville, NC, USA",
			"https://twitter.com/bezierer/status/887727599518183425"],
		["VIDEO", 1, 54.34, 10.05, "Kiel, Germany",
			"https://twitter.com/MAXIMILIAN_DAHL/status/887921539525615616"],
		["PHOTO", 1, 35.66, -97.47, "Edmond, OK, USA",
			"https://twitter.com/ryandavidk/status/888189473799852032"],
		["PHOTO", 1, 47.67, -117.48, "Spokane, WA, USA",
			"https://twitter.com/typicaltechtran/status/893558600882298881"],
		["PHOTO", 1, 21.4, -157.81, "Haleiwa, HI, USA",
			"https://twitter.com/hemeon/status/897582578395365379"],
		["PHOTO", 0, 25.78, -80.3, "Miami, FL, USA",
			"https://twitter.com/andresV1llegas/status/874968995560030208"],
		["PHOTO", 1, 52.96, -1.49, "East Midlands, United Kingdom",
			"https://twitter.com/Shake2L/status/913130720528359424"],
		["PHOTO", 1, 49.87, 8.58, "Darmstadt, Germany",
			"https://twitter.com/marekIsOkay/status/900679750607351808"],
		["PHOTO", 1, 48.86, 2.27, "Paris, France",
			"https://twitter.com/bilalkhettab/status/903209900477730816"],
		["PHOTO", 1, 52.37, 4.82, "Amsterdam, Netherlands",
			"https://twitter.com/harmenstruiksma/status/903642255302516736"],
		["PHOTO", 1, 12.95, 77.51, "Bengaluru, India",
			"https://twitter.com/manpurwala/status/907539696414162945"],
		["PHOTO", 1, 6.55, 3.14, "Lagos, Nigeria",
			"https://twitter.com/FlairMan_/status/908778275979247616"],
		["PHOTO", 1, 45.29, 19.85, "Novi Sad, Serbia",
			"https://twitter.com/Bajazetov/status/913432240335589382"],
		["PHOTO", 1, 26.14, -80.55, "Fort Lauderdale, FL, USA",
			"https://twitter.com/Osifer/status/924011281857830912"],
		["PHOTO", 1, 26.03, -142.01, "Hawaiin Airlines, Pacific Ocean",
			"https://twitter.com/hemeon/status/924075566751289349"],
		["PHOTO", 2, 47.75, -122.33, "Wallingford, WA, USA",
			"https://twitter.com/u10int/status/828796330512232448"],
		["PHOTO", 1, 47.5, -122.25, "Seattle, WA, USA",
			"https://twitter.com/egojab/status/924425800555798528"],
		["PHOTO", 1, 42.456, 14.13, "Pescara, Italy",
			"https://twitter.com/maztheegg/status/928967180883857410"],
		["PHOTO", 1, 33.69, -117.04, "Huntington Beach, CA, USA",
			"https://twitter.com/reidpriddy/status/932807348879421440"],
		["PHOTO", 1, 37.12, -80.56, "Radford, VA, USA",
			"https://twitter.com/kevPo/status/939601679154139136"],
		["PHOTO", 2, 52.06, -.08, "Litlington, United Kingdom",
			"https://twitter.com/fwa/status/941005946419122182"],
		["PHOTO", 2, 41.7, -93.64, "Ankeny, IA, USA",
			"https://www.instagram.com/p/BctfjWWDxo-"],
		["PHOTO", 2, 32.51, -117.8, "Aliso Viejo, USA",
			"https://www.instagram.com/p/BcshIUelnBW/"],
		["PHOTO", 2, 45.57, 5.9, "Chamb\xC3\xA9ry, France",
			"https://twitter.com/AriBenoist/status/941499931738755072"],
		["PHOTO", 2, 39.53, -119.85, "Reno, NV, USA",
			"https://twitter.com/stealth_hi/status/941719477804138496"],
		["PHOTO", 2, 33.91, -86.01, "Gadsden, AL, USA",
			"https://twitter.com/heyitsmederek/status/942449752872050688"],
		["PHOTO", 2, 42.24, -71.59, "Hopkinton, MA, USA",
			"https://twitter.com/webRat/status/942760171469754368"],
		["PHOTO", 2, 45.51, -122.61, "Portland, OR, USA",
			"https://twitter.com/JonathanHooker/status/942778658023907328"],
		["PHOTO", 1, 46.3, 25.28, "Odorheiu Secuies, Romania",
			"https://twitter.com/simotamas7/status/977084088350801920"],
		["PHOTO", 1, 19.7, -101.24, "Morelia, Michoac\xE1n, M\xE9xico",
			"https://twitter.com/TheFrost084/status/1047153130733850625"]];
$(document).ready(initWebgl);