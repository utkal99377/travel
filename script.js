/* ==========================================
   Manali • Spiti • Kasol Travel Guide
   - Three.js + GSAP animations
   - Mobile-first interactive UI
   ========================================== */

// Ensure GSAP plugins are registered before any ScrollTrigger usage.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin);
}

const state = {
  audioPlaying: false,
  audioCtx: null,
  ambientGain: null,
  scrollTrigger: null,
  timelineLoaded: false,
  sceneReady: false,
};

const ELEMENTS = {
  loader: document.getElementById('loader'),
  transitionOverlay: document.getElementById('transition-overlay'),
  exploreBtn: document.getElementById('explore-journey'),
  timeline: document.getElementById('timeline'),
  timelineCards: document.getElementById('timeline-cards'),
  destinationGrid: document.getElementById('destination-grid'),
  guidePanels: document.getElementById('guide-panels'),
  travelToolkit: document.getElementById('travel-toolkit'),
  scrollProgress: document.getElementById('scroll-progress'),
  fabTop: document.getElementById('fab-top'),
  audioToggle: document.getElementById('audio-toggle'),
  audioIcon: document.getElementById('audio-icon'),
  routePlay: document.getElementById('route-play'),
  routeReset: document.getElementById('route-reset'),
  routeDot: document.getElementById('route-dot'),
  routePath: document.getElementById('route-path'),
  navButtons: document.querySelectorAll('.nav-btn'),
  menuToggle: document.getElementById('menu-toggle'),
};

const TRIP_DAYS = [
  {
    day: 'Day 1',
    date: '19 May',
    title: 'Jharsuguda -> Delhi',
    badge: 'Train Start',
    items: [
      'Train: Hirakud Express',
      'Travel start and booking check',
      'Night journey toward Delhi',
    ],
    icon: '&#128646;',
  },
  {
    day: 'Day 2',
    date: '20 May',
    title: 'Delhi -> Manali',
    badge: 'Bus Journey',
    items: [
      'Reach Delhi afternoon',
      'Evening bus at 8:30 PM',
      'Rest early because the mountain days start next morning',
    ],
    icon: '&#128652;',
  },
  {
    day: 'Day 3',
    date: '21 May',
    title: 'Manali Arrival',
    badge: 'Core Base',
    items: [
      'Reach 7:20 AM',
      'Hotel check-in, freshen up, and slow lunch',
      'Visit Hadimba Temple in the cedar forest',
      'Explore Old Manali, Cafe 1947, Drifters Cafe, or Jogini and Vashisht side',
    ],
    icon: '&#127956;',
  },
  {
    day: 'Day 4',
    date: '22 May',
    title: 'Manali -> Spiti Side',
    badge: 'Reality Check',
    items: [
      'Manali to Kaza alone takes roughly 8-10 hours',
      'Key Monastery and Langza need more time than a rushed day run allows',
      'If the plan feels tight, Atal Tunnel and Sissu are the smarter high-altitude substitute',
    ],
    icon: '&#128739;',
  },
  {
    day: 'Day 5',
    date: '23 May',
    title: 'Spiti Side -> Manali Return',
    badge: 'Return Trip',
    items: [
      'Reverse through the mountain roads with buffer time for weather',
      'Keep the evening light in Manali',
      'If you skip the long push, use this day for Sethan Valley or Van Vihar instead',
    ],
    icon: '&#128260;',
  },
  {
    day: 'Day 6',
    date: '24 May',
    title: 'Solang Valley -> Atal Tunnel -> Sissu -> Rohtang',
    badge: 'Peak Day',
    items: [
      'Paragliding, zipline, and snow scooter options in Solang',
      'Drive through the 9.02 km Atal Tunnel',
      'Stop at Sissu waterfall and lake',
      'Rohtang snow depends on weather and permits',
    ],
    icon: '&#127958;',
  },
  {
    day: 'Day 7',
    date: '25 May',
    title: 'Kullu -> Kasol -> Manikaran',
    badge: 'Valley Trance',
    items: [
      'Optional Beas rafting or shawl shopping in Kullu',
      'Kasol cafe hop and Parvati riverside time',
      'Manikaran hot springs, blessings, and langar',
    ],
    icon: '&#127794;',
  },
  {
    day: 'Day 8',
    date: '26 May',
    title: 'Kasol -> Manali',
    badge: 'Return Road',
    items: [
      'Take the Kasol to Chalal walk in the morning',
      'If time allows, choose an offbeat detour like Grahan or Rasol',
      'Wrap up and align the evening transfer toward Delhi',
    ],
    icon: '&#128740;',
  },
  {
    day: 'Day 9',
    date: '27 May',
    title: 'Delhi -> Jharsuguda (Train)',
    badge: 'Final Stretch',
    items: ['Train ride home', 'Reflect on the journey'],
    icon: '&#128646;',
  },
  {
    day: 'Day 10',
    date: '28 May',
    title: 'Reach Jharsuguda',
    badge: 'Home',
    items: ['Arrive home safe', 'Share memories & photos'],
    icon: '&#127968;',
  },
];

const DESTINATIONS = [
  {
    id: 'manali',
    name: 'Manali',
    kicker: 'Core Base of Your Trip',
    description: 'Your main launch pad for mountain drives, cafe time, temples, and short scenic escapes around the valley.',
    image: 'https://images.unsplash.com/photo-1542643671-bf1c8c1af7b9?auto=format&fit=crop&w=900&q=80',
    guideId: 'guide-manali',
    tag: 'Core Base',
    facts: [
      'Linked to Sage Manu in Hindu mythology',
      'Spiritual, adventure, and nightlife mix',
      'Base for Rohtang, Spiti, and Leh routes',
    ],
    sections: [
      {
        title: 'History and Importance',
        items: [
          'The name is linked to Manu, the first human in Hindu mythology.',
          'A popular local belief says Sage Manu recreated life here after a great flood.',
          'Manali also sat on an old trade route connecting India, Ladakh, and Tibet.',
        ],
      },
      {
        title: 'What Makes It Special',
        items: [
          'Few hill towns combine spiritual stops, adventure sports, and nightlife this easily.',
          'It works as the practical base for Rohtang, Spiti, and Leh-Ladakh side routes.',
        ],
      },
      {
        title: 'Must-Visit Places',
        items: [
          'Hadimba Temple: built in 1553 and wrapped by a cedar forest.',
          'Old Manali: hippie lanes, live music, and cafe stops like Cafe 1947 and Drifters Cafe.',
          'Jogini Waterfall: an easy trek of around 1.5 hours with a quieter feel.',
          'Vashisht Hot Springs: natural hot water baths many travelers treat as restorative.',
        ],
      },
      {
        title: 'Hidden Gems',
        items: [
          'Sethan Valley can still surprise you with snow even in May.',
          'Hampta Pass viewpoint gives a strong mountain payoff without committing to the full pass.',
          'Van Vihar is an easy forest pause inside town limits.',
        ],
      },
    ],
  },
  {
    id: 'spiti',
    name: 'Spiti Valley',
    kicker: 'Extreme Adventure Zone',
    description: 'A dramatic cold desert of monasteries, fossil villages, thin air, and some of the toughest road decisions on the trip.',
    image: 'https://images.unsplash.com/photo-1522548937139-f6caad6c6ea2?auto=format&fit=crop&w=900&q=80',
    guideId: 'guide-spiti',
    tag: 'High Altitude',
    facts: [
      'Often called Little Tibet',
      'Cold desert with almost no trees',
      'Low oxygen makes altitude management important',
    ],
    sections: [
      {
        title: 'History and Culture',
        items: [
          'Spiti is widely known as Little Tibet because of its geography and culture.',
          'Tibetan Buddhism strongly shapes the monasteries, villages, and visual identity of the valley.',
          'Several monasteries in the region are around a thousand years old.',
        ],
      },
      {
        title: 'Unique Features',
        items: [
          'It is one of the coldest inhabited regions in India.',
          'The landscape is a stark desert mountain zone instead of a green forest valley.',
          'The altitude means low oxygen and a real risk of altitude sickness for some travelers.',
        ],
      },
      {
        title: 'Major Attractions',
        items: [
          'Key Monastery: the biggest monastery in Spiti with a striking hilltop setting.',
          'Kaza: the main service town for food, fuel, and stays.',
          'Langza Village: known for fossils and its giant Buddha statue.',
        ],
      },
    ],
    alert: 'Reality check: Manali to Kaza alone takes roughly 8-10 hours. If the trip window is short, Atal Tunnel and Sissu give a more realistic taste of the high-altitude landscape.',
  },
  {
    id: 'solang',
    name: 'Solang Valley',
    kicker: 'Adventure Hub',
    description: 'This is the kinetic part of the itinerary with snow activities, open valley views, and easy access from Manali.',
    image: 'https://images.unsplash.com/photo-1601610150501-5a2f9b7cec9c?auto=format&fit=crop&w=900&q=80',
    guideId: 'guide-solang',
    tag: 'Adventure',
    facts: [
      'Often the most action-packed day of the trip',
      'Paragliding and zipline hotspot',
      'Pairs well with the Atal Tunnel and Sissu circuit',
    ],
    sections: [
      {
        title: 'Why This Route Works',
        items: [
          'Solang is the strongest base for a high-energy day near Manali.',
          'It combines well with the Atal Tunnel and Sissu for a full-value outing without forcing a rushed Spiti run.',
        ],
      },
      {
        title: 'What To Do',
        items: [
          'Paragliding for valley-wide aerial views.',
          'Zipline rides for a shorter adrenaline hit.',
          'Snow scooters when conditions allow.',
        ],
      },
    ],
  },
  {
    id: 'atal',
    name: 'Atal Tunnel',
    kicker: 'Engineering Marvel',
    description: 'The fast transition point that opens the route to Lahaul and changes how practical this day trip feels.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    guideId: 'guide-atal',
    tag: 'Engineering Marvel',
    facts: [
      'Length: 9.02 km',
      'Built for all-weather connectivity',
      'Cuts travel time to Lahaul dramatically',
    ],
    sections: [
      {
        title: 'Why It Matters',
        items: [
          'The tunnel gives all-weather access beyond Manali for much of the year.',
          'It makes the Lahaul side feel closer and more feasible for a day trip.',
        ],
      },
      {
        title: 'Quick Facts',
        items: [
          'The tunnel length is 9.02 km.',
          'It was built to provide dependable connectivity through the high mountains.',
          'Crossing it is one of the signature moments of this route.',
        ],
      },
    ],
  },
  {
    id: 'sissu',
    name: 'Sissu',
    kicker: 'Hidden Paradise',
    description: 'A calmer Lahaul stop that gives you the mountain-desert transition without the exhaustion of a full Spiti push.',
    image: 'https://images.unsplash.com/photo-1602326191590-0e91a4d9d3f4?auto=format&fit=crop&w=900&q=80',
    guideId: 'guide-sissu',
    tag: 'Hidden Paradise',
    facts: [
      'Feels quieter than Manali',
      'Known for its waterfall and small lake',
      'A strong alternative to a rushed Kaza day',
    ],
    sections: [
      {
        title: 'Why Stop Here',
        items: [
          'Sissu feels more peaceful and less crowded than the core Manali circuit.',
          'It gives you a high-altitude, wider-valley mood soon after the tunnel crossing.',
        ],
      },
      {
        title: 'Do Not Miss',
        items: [
          'Sissu waterfall for the main photo stop.',
          'The lake area for a slower scenic break.',
          'The contrast between the open Lahaul valley and the greener Manali side.',
        ],
      },
    ],
  },
  {
    id: 'rohtang',
    name: 'Rohtang Pass',
    kicker: 'Snow and Peaks',
    description: 'The classic snow stop of the region with big altitude, weather dependence, and a proper Himalayan feel.',
    image: 'https://images.unsplash.com/photo-1564897302313-ffe1929a8aac?auto=format&fit=crop&w=900&q=80',
    guideId: 'guide-rohtang',
    tag: 'Snow & Peaks',
    facts: [
      'Altitude: 3978 m',
      'Snow is often possible even in May',
      'Access always depends on weather conditions',
    ],
    sections: [
      {
        title: 'High-Altitude Snapshot',
        items: [
          'Rohtang sits at about 3978 meters.',
          'Snow can stay around for much of the year depending on the season.',
          'The views feel more raw and exposed than the Manali valley floor.',
        ],
      },
      {
        title: 'Before You Go',
        items: [
          'Road and permit conditions can change quickly.',
          'Treat it as a weather-dependent bonus rather than the guaranteed center of the day.',
        ],
      },
    ],
  },
  {
    id: 'kullu',
    name: 'Kullu',
    kicker: 'Valley of Gods',
    description: 'A practical stop for rafting, markets, and temple visits before the Parvati Valley section begins.',
    image: 'https://images.unsplash.com/photo-1542253088-ff4310b6d0b0?auto=format&fit=crop&w=900&q=80',
    guideId: 'guide-kullu',
    tag: 'Valley of Gods',
    facts: [
      'Historically called Kulant Peeth',
      'Known for the Kullu Dussehra festival',
      'Good for rafting, shawls, and temple stops',
    ],
    sections: [
      {
        title: 'History',
        items: [
          'Kullu has long been called Kulant Peeth, or the end of the habitable world.',
          'It is especially famous for the Kullu Dussehra festival.',
        ],
      },
      {
        title: 'What To Do',
        items: [
          'River rafting in the Beas River.',
          'Shawl shopping, which is one of the valley staples.',
          'A quick temple stop at Raghunath Temple.',
        ],
      },
    ],
  },
  {
    id: 'kasol',
    name: 'Kasol',
    kicker: 'Mini Israel of India',
    description: 'A riverside backpacker base with cafe culture, easy walks, and quick access to rawer Parvati Valley villages.',
    image: 'https://images.unsplash.com/photo-1560772148-4c5f77bb6654?auto=format&fit=crop&w=900&q=80',
    guideId: 'guide-kasol',
    tag: 'Hippie Culture',
    facts: [
      'Strong Israeli traveler presence',
      'Known for Indian and Israeli cafe culture',
      'Easy gateway to short and long treks',
    ],
    sections: [
      {
        title: 'Culture and History',
        items: [
          'Kasol became especially popular with Israeli travelers over the years.',
          'That influence shaped the food scene and the easygoing backpacker mood of the village.',
        ],
      },
      {
        title: 'Experiences You Should Do',
        items: [
          'Sit beside the Parvati River at night.',
          'Cafe hop through places like Moon Dance Cafe and Evergreen Cafe.',
          'Take the easy Kasol to Chalal walk for a quick trail fix.',
        ],
      },
      {
        title: 'Hidden Spots',
        items: [
          'Grahan Village for a stronger trek feel.',
          'Rasol Village if you want something rawer and more offbeat.',
        ],
      },
    ],
  },
  {
    id: 'manikaran',
    name: 'Manikaran',
    kicker: 'Spiritual and Natural Wonder',
    description: 'A sacred Parvati Valley stop where hot springs, langar, and temple-gurudwara energy all come together.',
    image: 'https://images.unsplash.com/photo-1604710323509-1f276a96adc5?auto=format&fit=crop&w=900&q=80',
    guideId: 'guide-manikaran',
    tag: 'Spiritual Stop',
    facts: [
      'Sacred to both Sikhs and Hindus',
      'Known for boiling natural hot springs',
      'Best known for blessings, langar, and hot pools',
    ],
    sections: [
      {
        title: 'Religious Importance',
        items: [
          'Manikaran is sacred for both Sikh and Hindu pilgrims.',
          'Guru Nanak is believed to have visited here.',
        ],
      },
      {
        title: 'Unique Feature',
        items: [
          'The hot springs are so intense that food is famously cooked in the water.',
          'That natural heat is one of the most memorable parts of the stop.',
        ],
      },
      {
        title: 'What To Do',
        items: [
          'Take blessings at the gurudwara and temple complex.',
          'Eat langar.',
          'Experience the hot water pools.',
        ],
      },
    ],
  },
];

const TRAVEL_TOOLKIT = {
  spotlight: {
    badge: 'Best Day of the Trip',
    title: 'Solang Valley + Atal Tunnel + Sissu',
    description: 'This route gives you the strongest one-day balance of thrill, snow chance, engineering spectacle, and peaceful mountain scenery.',
    items: [
      'Start with Solang for paragliding, zipline, or snow scooter rides.',
      'Cross the 9.02 km Atal Tunnel for the Lahaul-side transition.',
      'Slow down at Sissu waterfall and the lake for the scenic payoff.',
      'Treat Rohtang as a weather-dependent bonus if road conditions support it.',
    ],
    realityCheck: 'A direct Manali to Kaza push is very rushed for this itinerary. Manali to Kaza alone usually takes around 8-10 hours, so Atal Tunnel and Sissu are the more realistic high-altitude substitute.',
  },
  tipSections: [
    {
      title: 'Snow Chances in May',
      items: [
        'Rohtang Pass: usually the strongest snow bet.',
        'Sissu: good chance of snow or fresh high-altitude scenery nearby.',
        'Solang Valley: possible, but less reliable than Rohtang.',
        'Manali town: generally no snow in town itself.',
      ],
    },
    {
      title: 'Budget Trick',
      items: [
        'Stay in Old Manali for cheaper rooms and better cafe access.',
        'Bike rentals often land around Rs 500-1000 per day, depending on season and bike type.',
      ],
    },
    {
      title: 'Safety',
      items: [
        'Avoid night driving in the mountains.',
        'Carry offline maps before entering patchy network zones.',
        'Prepare for altitude with rest, hydration, and any doctor-advised medication.',
      ],
    },
  ],
};

function ready(fn) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fn, 10);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/* ---------- App Init ---------- */
ready(() => {
  initTimeline();
  initDestinations();
  initGuidePanels();
  initTravelToolkit();
  initNavigation();
  initScrollProgress();
  initFab();
  initAudio();
  initMenu();
  initMapAnimations();
  initHeroScene();
  initSnowfall();
  bindActions();
});

window.addEventListener('load', () => {
  hideLoader();
});

/* ---------- Loader ---------- */
function hideLoader() {
  if (!ELEMENTS.loader) return;
  gsap.to(ELEMENTS.loader, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    onComplete: () => {
      ELEMENTS.loader.style.display = 'none';
    },
  });
}

function runPageTransition(callback) {
  const overlay = ELEMENTS.transitionOverlay;
  if (!overlay) {
    if (typeof callback === 'function') callback();
    return;
  }

  gsap.killTweensOf(overlay);
  gsap.set(overlay, { opacity: 0, pointerEvents: 'auto', scale: 0.92 });
  gsap.to(overlay, {
    opacity: 1,
    scale: 1.08,
    duration: 0.35,
    ease: 'power3.out',
    onComplete: () => {
      if (typeof callback === 'function') callback();
      gsap.to(overlay, {
        opacity: 0,
        scale: 1,
        duration: 0.32,
        delay: 0.08,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { pointerEvents: 'none' });
        },
      });
    },
  });
}

function renderBulletList(items, listClass = '') {
  const className = listClass ? ` class="${listClass}"` : '';
  return `<ul${className}>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function renderDestinationMedia(dest) {
  if (dest.image) {
    return `
      <img src="${dest.image}" alt="${dest.name}" loading="lazy" />
      <div class="dest-overlay"></div>
    `;
  }

  return `
    <div class="dest-fallback" aria-hidden="true">
      <span class="dest-fallback-mark">${dest.fallbackMark || dest.name.charAt(0)}</span>
      <span class="dest-fallback-label">${dest.fallbackLabel || dest.kicker}</span>
    </div>
    <div class="dest-overlay"></div>
  `;
}

function scrollToGuide(destinationId) {
  const panel = document.querySelector(`[data-guide-id="${destinationId}"]`);
  if (!panel) return;

  runPageTransition(() => {
    panel.open = true;
    panel.classList.add('guide-focus');
    window.setTimeout(() => panel.classList.remove('guide-focus'), 1400);

    const offset = panel.getBoundingClientRect().top + window.scrollY - 92;
    gsap.to(window, { scrollTo: offset, duration: 0.85, ease: 'power3.out' });
  });
}

/* ---------- Hero 3D Scene ---------- */
function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x070a13, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.2, 200);
  camera.position.set(0, 13, 32);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.AmbientLight(0x99b7ff, 0.6);
  scene.add(ambient);

  const rim = new THREE.DirectionalLight(0x7dcaff, 1.1);
  rim.position.set(8, 15, 6);
  scene.add(rim);

  const bottom = new THREE.PointLight(0x7cdbf9, 0.4, 80);
  bottom.position.set(-12, -10, 15);
  scene.add(bottom);

  const fogColor = new THREE.Color(0x070a13);
  scene.fog = new THREE.Fog(fogColor, 18, 70);

  const lake = new THREE.Mesh(
    new THREE.CircleGeometry(42, 64),
    new THREE.MeshStandardMaterial({
      color: 0x0b3350,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.35,
    })
  );
  lake.rotation.x = -Math.PI * 0.5;
  lake.position.y = -0.7;
  scene.add(lake);

  const mountains = new THREE.Group();
  scene.add(mountains);

  const baseColors = [0x0e1d34, 0x142442, 0x0b1a2f];

  for (let i = 0; i < 14; i += 1) {
    const height = THREE.MathUtils.randFloat(5, 14);
    const radius = THREE.MathUtils.randFloat(6, 20);
    const geometry = new THREE.ConeGeometry(radius, height, 6 + Math.floor(Math.random() * 5), 4);
    geometry.translate(0, -height * 0.5, 0);

    const material = new THREE.MeshStandardMaterial({
      color: baseColors[i % baseColors.length],
      roughness: 0.88,
      metalness: 0,
      flatShading: true,
    });

    const mountain = new THREE.Mesh(geometry, material);
    mountain.position.x = THREE.MathUtils.randFloatSpread(40);
    mountain.position.z = THREE.MathUtils.randFloatSpread(30) - 5;
    mountain.position.y = THREE.MathUtils.randFloat(-1, 2);
    mountain.rotation.y = THREE.MathUtils.randFloat(0, Math.PI * 2);
    mountain.scale.setScalar(THREE.MathUtils.randFloat(0.8, 1.2));
    mountains.add(mountain);
  }

  const cloudGroup = new THREE.Group();
  scene.add(cloudGroup);

  const cloudTexture = createCloudTexture();

  for (let i = 0; i < 10; i += 1) {
    const cloud = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 10),
      new THREE.MeshBasicMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
      })
    );
    cloud.position.set(THREE.MathUtils.randFloat(-22, 22), THREE.MathUtils.randFloat(4, 12), THREE.MathUtils.randFloat(-12, 10));
    cloud.rotation.set(0, 0, THREE.MathUtils.randFloat(-0.4, 0.4));
    cloud.scale.multiplyScalar(THREE.MathUtils.randFloat(0.8, 1.4));
    cloudGroup.add(cloud);
  }

  const snowCount = 800;
  const snowGeo = new THREE.BufferGeometry();
  const snowPositions = new Float32Array(snowCount * 3);

  for (let i = 0; i < snowCount; i += 1) {
    snowPositions[i * 3 + 0] = THREE.MathUtils.randFloatSpread(60);
    snowPositions[i * 3 + 1] = THREE.MathUtils.randFloat(0, 30);
    snowPositions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(40);
  }

  snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
  const snowMaterial = new THREE.PointsMaterial({
    size: 0.22,
    color: 0xffffff,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  });

  const snow = new THREE.Points(snowGeo, snowMaterial);
  scene.add(snow);

  state.sceneReady = true;

  function createCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
    gradient.addColorStop(0.7, 'rgba(255,255,255,0.25)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const blur = ctx.filter;
    ctx.filter = 'blur(16px)';
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = blur;

    return new THREE.CanvasTexture(canvas);
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function animate(now) {
    const time = now * 0.0003;

    mountains.rotation.y = Math.sin(time * 0.2) * 0.05;
    cloudGroup.children.forEach((cloud, index) => {
      cloud.position.x += 0.02 + (index % 3) * 0.005;
      cloud.position.z += 0.01;
      if (cloud.position.x > 30) cloud.position.x = -30;
      if (cloud.position.z > 20) cloud.position.z = -20;
    });

    const positions = snow.geometry.attributes.position.array;
    for (let i = 0; i < snowCount; i += 1) {
      const idx = i * 3;
      positions[idx + 1] -= 0.06;
      if (positions[idx + 1] < -3) {
        positions[idx + 1] = 26;
      }
    }
    snow.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  gsap.to(mountains.position, {
    y: 1.2,
    duration: 5,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });

  gsap.to(camera.position, {
    z: 28,
    duration: 10,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(animate);

  // Parallax on scroll
  // Scroll-based camera parallax
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 0.9,
    onUpdate: (self) => {
      const progress = self.progress;
      camera.position.x = Math.sin(progress * Math.PI * 0.5) * 8;
      camera.position.y = 12 + progress * 6;
      camera.lookAt(0, 0, 0);
    },
  });

  const headline = document.querySelector('#hero h2');
  gsap.fromTo(
    headline,
    { y: 25, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.3, ease: 'power2.out', delay: 0.2 }
  );

  const sub = document.querySelector('#hero p');
  gsap.fromTo(sub, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, delay: 0.5, ease: 'power2.out' });

  const cta = document.querySelector('#explore-journey');
  gsap.fromTo(cta, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, delay: 0.7, ease: 'power2.out' });
}

/* ---------- Timeline ---------- */
function initTimeline() {
  if (!ELEMENTS.timelineCards) return;

  ELEMENTS.timelineCards.innerHTML = TRIP_DAYS.map((day) => {
    return `
      <article class="timeline-card glow-edge" data-day="${day.day}">
        <div class="badge">
          <span>${day.icon}</span>
          <strong>${day.day}</strong>
          <span class="text-xs text-white/60">${day.date}</span>
        </div>
        <h3>${day.title}</h3>
        <p class="text-white/60">${day.badge}</p>
        <ul>
          ${day.items.map((item) => `<li><span>&bull;</span>${item}</li>`).join('')}
        </ul>
      </article>
    `;
  }).join('');

  const cards = Array.from(document.querySelectorAll('.timeline-card'));

  cards.forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      x: 120,
      duration: 1.1,
      delay: i * 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        end: 'bottom 55%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

/* ---------- Destinations ---------- */
function initDestinations() {
  if (!ELEMENTS.destinationGrid) return;

  ELEMENTS.destinationGrid.innerHTML = DESTINATIONS.map((dest) => {
    return `
      <article class="dest-card card-tilt" data-destination="${dest.id}" role="button" tabindex="0" aria-label="Open ${dest.name} guide">
        <div class="dest-image">
          ${renderDestinationMedia(dest)}
        </div>
        <div class="dest-body">
          <p class="dest-kicker">${dest.kicker}</p>
          <h3>${dest.name}</h3>
          <p>${dest.description}</p>
          <div class="dest-facts">
            ${dest.facts.slice(0, 2).map((fact) => `<span>${fact}</span>`).join('')}
          </div>
          <div class="dest-footer">
            <div class="tag">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3 3L22 4" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span>${dest.tag}</span>
            </div>
            <button type="button" class="dest-action" data-target="${dest.id}">View Guide</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  const cards = Array.from(document.querySelectorAll('.dest-card'));

  cards.forEach((card) => {
    const pointer = (event) => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const midX = bounds.width / 2;
      const midY = bounds.height / 2;
      const rotateY = ((x - midX) / midX) * 12;
      const rotateX = -((y - midY) / midY) * 10;
      gsap.to(card, { rotateX, rotateY, duration: 0.4, ease: 'power2.out' });
    };

    const reset = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'expo.out' });
    const openGuide = () => scrollToGuide(card.dataset.destination);

    card.addEventListener('pointermove', pointer);
    card.addEventListener('pointerleave', reset);
    card.addEventListener('click', openGuide);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openGuide();
      }
    });

    const action = card.querySelector('.dest-action');
    if (action) {
      action.addEventListener('click', (event) => {
        event.stopPropagation();
        openGuide();
      });

      action.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openGuide();
        }
      });

      gsap.from(action, {
        opacity: 0,
        y: 18,
        duration: 0.9,
        delay: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    gsap.from(card, {
      opacity: 0,
      y: 40,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initGuidePanels() {
  if (!ELEMENTS.guidePanels) return;

  ELEMENTS.guidePanels.innerHTML = DESTINATIONS.map((dest, index) => {
    return `
      <details id="guide-${dest.id}" class="guide-panel glow-edge" data-guide-id="${dest.id}" ${index === 0 ? 'open' : ''}>
        <summary>
          <div class="guide-summary-copy">
            <p class="guide-kicker">${dest.kicker}</p>
            <h3>${dest.name}</h3>
            <p>${dest.description}</p>
          </div>
          <div class="guide-summary-facts">
            ${dest.facts.map((fact) => `<span>${fact}</span>`).join('')}
          </div>
        </summary>
        <div class="guide-content">
          <div class="guide-section-grid">
            ${dest.sections.map((section) => `
              <section class="guide-section">
                <h4>${section.title}</h4>
                ${renderBulletList(section.items, 'guide-list')}
              </section>
            `).join('')}
          </div>
          ${dest.alert ? `
            <div class="guide-alert">
              <strong>Reality Check</strong>
              <p>${dest.alert}</p>
            </div>
          ` : ''}
        </div>
      </details>
    `;
  }).join('');

  const panels = Array.from(document.querySelectorAll('.guide-panel'));

  panels.forEach((panel, index) => {
    gsap.from(panel, {
      opacity: 0,
      y: 30,
      duration: 0.9,
      delay: index * 0.04,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: panel,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initTravelToolkit() {
  if (!ELEMENTS.travelToolkit) return;

  ELEMENTS.travelToolkit.innerHTML = `
    <article class="travel-tool glow-edge">
      <p class="travel-kicker">${TRAVEL_TOOLKIT.spotlight.badge}</p>
      <h3>${TRAVEL_TOOLKIT.spotlight.title}</h3>
      <p class="travel-copy">${TRAVEL_TOOLKIT.spotlight.description}</p>
      ${renderBulletList(TRAVEL_TOOLKIT.spotlight.items, 'travel-list')}
      <div class="travel-alert">
        <strong>Reality Check</strong>
        <p>${TRAVEL_TOOLKIT.spotlight.realityCheck}</p>
      </div>
    </article>
    <article class="travel-tool">
      <p class="travel-kicker">Pro Level Travel Tips</p>
      <h3>Snow, Budget, and Safety</h3>
      <div class="travel-tip-groups">
        ${TRAVEL_TOOLKIT.tipSections.map((section) => `
          <section class="travel-tip-group">
            <h4>${section.title}</h4>
            ${renderBulletList(section.items, 'travel-list compact')}
          </section>
        `).join('')}
      </div>
    </article>
  `;

  const tools = Array.from(document.querySelectorAll('.travel-tool'));

  tools.forEach((tool, index) => {
    gsap.from(tool, {
      opacity: 0,
      y: 36,
      duration: 1,
      delay: index * 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: tool,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

/* ---------- Map Animations ---------- */
function initMapAnimations() {
  if (!ELEMENTS.routePath) return;

  const routeSvg = document.getElementById('route-svg');

  gsap.set(ELEMENTS.routeDot, { xPercent: -50, yPercent: -50 });
  if (routeSvg) {
    gsap.set(routeSvg, { transformOrigin: '50% 50%', scale: 1 });
  }

  const pathLength = ELEMENTS.routePath.getTotalLength();
  ELEMENTS.routePath.style.strokeDasharray = pathLength;
  ELEMENTS.routePath.style.strokeDashoffset = pathLength;

  const routeDotIcon = document.getElementById('route-dot-icon');
  const ROUTE_ICONS = [
    { threshold: 0.28, symbol: '🚆' },
    { threshold: 0.45, symbol: '🚌' },
    { threshold: 0.72, symbol: '🏍️' },
    { threshold: 1.0, symbol: '🚗' },
  ];

  function updateRouteIcon(progress) {
    if (!routeDotIcon) return;
    const icon = ROUTE_ICONS.find((item) => progress <= item.threshold);
    if (icon) routeDotIcon.textContent = icon.symbol;
  }

  const dotTimeline = gsap.timeline({ paused: true, onUpdate: () => updateRouteIcon(dotTimeline.progress()) });

  dotTimeline.to(ELEMENTS.routePath.style, {
    strokeDashoffset: 0,
    duration: 5.2,
    ease: 'power2.inOut',
  });

  dotTimeline.to(ELEMENTS.routeDot, {
    motionPath: {
      path: ELEMENTS.routePath,
      align: ELEMENTS.routePath,
      alignOrigin: [0.5, 0.5],
      autoRotate: false,
    },
    duration: 5.2,
    ease: 'power2.inOut',
  }, 0);

  updateRouteIcon(0);

  if (routeSvg) {
    dotTimeline.to(
      routeSvg,
      {
        scale: 1.08,
        duration: 2.2,
        ease: 'power2.inOut',
      },
      0
    );

    dotTimeline.to(
      routeSvg,
      {
        scale: 1,
        duration: 2.2,
        ease: 'power2.inOut',
      },
      2.2
    );
  }

  ELEMENTS.routePlay.addEventListener('click', () => {
    dotTimeline.restart();
  });

  ELEMENTS.routeReset.addEventListener('click', () => {
    dotTimeline.pause(0);
  });

  // Automatic timeline trigger when map section hits center
  ScrollTrigger.create({
    trigger: '#route-map',
    start: 'top center',
    onEnter: () => {
      if (!dotTimeline.isActive()) dotTimeline.play();
    },
  });
}

/* ---------- Scroll Progress ---------- */
function initScrollProgress() {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    ELEMENTS.scrollProgress.style.width = `${progress}%`;

    if (scrollTop > 450) {
      ELEMENTS.fabTop.classList.add('visible');
    } else {
      ELEMENTS.fabTop.classList.remove('visible');
    }
  });
}

/* ---------- Fab (Back to Top) ---------- */
function initFab() {
  ELEMENTS.fabTop.addEventListener('click', () => {
    gsap.to(window, { scrollTo: { y: 0, autoKill: true }, duration: 0.9, ease: 'power3.inOut' });
  });
}

/* ---------- Navigation ---------- */
function initNavigation() {
  ELEMENTS.navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const anchor = btn.dataset.target;
      const target = document.querySelector(anchor);
      if (!target) return;

      ELEMENTS.navButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      runPageTransition(() => {
        gsap.to(window, { scrollTo: offset, duration: 0.9, ease: 'power3.out' });
      });
    });
  });

  ELEMENTS.exploreBtn.addEventListener('click', () => {
    const offset = ELEMENTS.timeline.getBoundingClientRect().top + window.scrollY - 90;
    runPageTransition(() => {
      gsap.to(window, { scrollTo: offset, duration: 1.1, ease: 'power4.out' });
    });
  });

  window.addEventListener('scroll', () => {
    const sections = ['#hero', '#timeline', '#route-map', '#destination-grid', '#guide-panels'];
    const scrollPos = window.scrollY + window.innerHeight * 0.36;

    sections.forEach((selector) => {
      const section = document.querySelector(selector);
      if (!section) return;
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      const matchingBtn = Array.from(ELEMENTS.navButtons).find((btn) => btn.dataset.target === selector);
      if (!matchingBtn) return;

      if (scrollPos >= top && scrollPos < bottom) {
        matchingBtn.classList.add('active');
      } else {
        matchingBtn.classList.remove('active');
      }
    });
  });
}

/* ---------- Audio / Ambient ---------- */
function initAudio() {
  ELEMENTS.audioToggle.addEventListener('click', () => {
    if (state.audioPlaying) {
      stopAmbient();
    } else {
      startAmbient();
    }
  });
}

function startAmbient() {
  if (state.audioPlaying) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  state.audioCtx = new AudioContext();

  const carrier = state.audioCtx.createOscillator();
  const modulator = state.audioCtx.createOscillator();
  const modGain = state.audioCtx.createGain();
  const gain = state.audioCtx.createGain();
  const filter = state.audioCtx.createBiquadFilter();

  carrier.type = 'sine';
  carrier.frequency.value = 120;

  modulator.type = 'triangle';
  modulator.frequency.value = 0.1;

  modGain.gain.value = 40;

  gain.gain.value = 0.18;
  filter.type = 'lowpass';
  filter.frequency.value = 980;
  filter.Q.value = 0.9;

  modulator.connect(modGain);
  modGain.connect(carrier.frequency);

  carrier.connect(filter);
  filter.connect(gain);

  gain.connect(state.audioCtx.destination);

  carrier.start();
  modulator.start();

  state.ambientGain = gain;
  state.audioPlaying = true;

  ELEMENTS.audioIcon.innerHTML = `
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M17 18V6" />
  `;
  ELEMENTS.audioToggle.title = 'Pause ambient audio';
}

function stopAmbient() {
  if (!state.audioPlaying || !state.audioCtx) return;
  state.audioCtx.close();
  state.audioCtx = null;
  state.audioPlaying = false;

  ELEMENTS.audioIcon.innerHTML = `
    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5l-6 6h-3v2h3l6 6V5z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.07 4.93a10 10 0 010 14.14" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.54 8.46a6 6 0 010 7.07" />
  `;
  ELEMENTS.audioToggle.title = 'Play ambient audio';
}

/* ---------- Menu Overlay ---------- */
function initMenu() {
  const overlay = document.createElement('div');
  overlay.id = 'menu-overlay';
  overlay.innerHTML = `
    <div id="menu-sheet">
      <h3>Quick Navigation</h3>
      <a href="#hero" data-link="#hero">Home</a>
      <a href="#timeline" data-link="#timeline">Timeline</a>
      <a href="#route-map" data-link="#route-map">Route Map</a>
      <a href="#destination-grid" data-link="#destination-grid">Destinations</a>
      <a href="#guide-panels" data-link="#guide-panels">Guide</a>
      <a href="#" id="close-menu" style="margin-top:0.8rem; display:block; text-align:center;" class="text-white/70">Close</a>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      overlay.classList.remove('active');
    }
  });

  overlay.querySelectorAll('a[data-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.dataset.link);
      if (!target) return;
      overlay.classList.remove('active');
      const offset = target.getBoundingClientRect().top + window.scrollY - 90;
      gsap.to(window, { scrollTo: offset, duration: 0.9, ease: 'power3.out' });
    });
  });

  overlay.querySelector('#close-menu').addEventListener('click', (event) => {
    event.preventDefault();
    overlay.classList.remove('active');
  });

  ELEMENTS.menuToggle.addEventListener('click', () => {
    overlay.classList.toggle('active');
  });
}

/* ---------- Bind events ---------- */
function bindActions() {
  // Prevent touch-based overscroll bounce on iOS for sections using scroll triggers
  document.body.addEventListener('touchmove', () => {}, { passive: false });
}

/* ---------- Snowfall (light overlay) ---------- */
function initSnowfall() {
  if (document.getElementById('snow-container')) return;

  const container = document.createElement('div');
  container.id = 'snow-container';
  document.body.appendChild(container);

  const flakes = [];
  const count = 38;
  const w = () => window.innerWidth;
  const h = () => window.innerHeight;

  for (let i = 0; i < count; i += 1) {
    const flake = document.createElement('div');
    flake.className = `snowflake ${Math.random() > 0.7 ? 'snowflake--soft' : ''}`;

    const size = 4 + Math.random() * 5;
    const x = Math.random() * w();
    const y = Math.random() * h();
    const speed = 0.25 + Math.random() * 0.6;
    const drift = (Math.random() - 0.5) * 0.3;
    const opacity = 0.3 + Math.random() * 0.5;

    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;
    flake.style.opacity = opacity;

    container.appendChild(flake);
    flakes.push({ el: flake, x, y, speed, drift, size, opacity });
  }

  function update() {
    const width = w();
    const height = h();

    flakes.forEach((flake) => {
      flake.y += flake.speed;
      flake.x += flake.drift;

      if (flake.y > height + 10) {
        flake.y = -10;
        flake.x = Math.random() * width;
      }
      if (flake.x < -30) flake.x = width + 30;
      if (flake.x > width + 30) flake.x = -30;

      flake.el.style.transform = `translate3d(${Math.round(flake.x)}px, ${Math.round(flake.y)}px, 0)`;
    });

    requestAnimationFrame(update);
  }

  update();
}
