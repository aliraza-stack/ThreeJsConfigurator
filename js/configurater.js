var camera, controls, scene, renderer;

var plane = new THREE.Plane();
var raycaster = new THREE.Raycaster();
var clickMouse = new THREE.Vector2();
var mouseMove = new THREE.Vector2();
// var axesHelper = new THREE.AxesHelper(5);

var mouse = new THREE.Vector2();
var pNormal = new THREE.Vector3(0, 1, 0);
var planeIntersect = new THREE.Vector3();
var pIntersect = new THREE.Vector3();
var shift = new THREE.Vector3();
var isDragging = false;
var dragObject;
var offset = new THREE.Vector3();
var intersection = new THREE.Vector3();
var Dragged;
var selectedCube = null;
let selectedObjects = [];
var lastCube = [];

var width = window.innerWidth;
var height = window.innerHeight;

var draggable = null;
var selected = null;

var isMoving = false;
var leftShiftPressed = false;
var controlPressed = false;

var intersects = [];
var allCubes = [];

var allSubCubes = [];
var cubeCounter = 0;
var clickedSlug = null;
var totalQuenty = 0;
var eachProductQuantity = {};
var busniess_cart_info = {};
let isRequestInProgress = false;
const _pointer = new Vector2();


window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
const isMobile =  window.mobileAndTabletCheck();

const modelCache = {};
var cube;
// var GUI = new dat.GUI(); //Debugger
var cubePosition = { x: 0, y: 0, z: 0 };
var mousePreviousPosition = { x: 0, y: 0, };
var pos = { x: 0, y: -1, z: 0 };
var scale = { x: 50, y: 2, z: 50 };
var model_url;
var model_url2;

var OBJECT_FACE = {};

var DOMAIN_URL = 'https://d6734qda5szbb.cloudfront.net';
// var DOMAIN_URL = '';
var chrome = navigator.userAgent.search("Chrome") != -1 ? true : false;
var firefox = navigator.userAgent.search("Firefox") != -1 ? true : false;
var msie8 = navigator.userAgent.search("MSIE 8.0");
var msie9 = navigator.userAgent.search("MSIE 9.0");
// U CUBE SETS ARRAY
var UCUBESETS = {
  'purple': {
    'S': {
      connecter: 1,
      seatcushion: 1
    },
    'M': {
        connecter: 2,
        seatcushion: 1
    },
    'L': {
        connecter: 3,
        seatcushion: 2
    },
  },
  'green': {
    'S': {
      connecter: 1,
      seatcushion: 1
    },
    'M': {
        connecter: 2,
        seatcushion: 1
    },
    'L': {
        connecter: 3,
        seatcushion: 2
    },
  },
  'yellow': {
    'S': {
      connecter: 2,
      seatcushion: 1
    },
    'M': {
        connecter: 4,
        seatcushion: 2
    },
    'L': {
        connecter: 6,
        seatcushion: 2
    },
  },
  'blue': {
    'S': {
      connecter: 2,
      seatcushion: 1
    },
    'M': {
        connecter: 4,
        seatcushion: 2
    },
    'L': {
        connecter: 6,
        seatcushion: 3
    },
  },
  'gray': {
    'S': {
      connecter: 2,
      seatcushion: 0
    },
    'M': {
        connecter: 4,
        seatcushion: 2
    },
    'L': {
        connecter: 6,
        seatcushion: 3
    },
  },
  'URL': {
    'purple - purple': {
      connecter_url: DOMAIN_URL + '/wp-content/uploads/2023/10/U_cube_purple_connector.gltf',
      seatcusion_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/U_cube_purple_purple-cussion.gltf`,
    },
    'green - green': {
      connecter_url: DOMAIN_URL + '/wp-content/uploads/2023/10/U_cube_green_connector.gltf',
      seatcusion_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/U_cube_green_green-cussion.gltf`,
    },
    'yellow - yellow': {
      connecter_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/U_cube_yellow_connector.gltf`,
      seatcusion_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/U_cube_yellow_yellow-cussion.gltf`,
    },
    'blue - blue': {
      connecter_url: `${DOMAIN_URL}/wp-content/uploads/2023/11/U_cube_blue_connector.gltf`,
      seatcusion_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/U_cube_blue_blue-cussion.gltf`,
    },
    'gray - gray': {
      connecter_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/U_cube_gray_connector.gltf`,
      seatcusion_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/U_cube_gray_gray-cussion.gltf`,
    },
  }
};


// O CUBE SETS ARRAY
var OCUBESETS = {
  'slug': {
    'S': {
      connecter: 2,
      seatcushion: 4,
      seatcushion_per: 1,
    },
    'M': {
        connecter: 4,
        seatcushion: 8,
        seatcushion_per: 2,
    },
    'L': {
        connecter: 6,
        seatcushion: 16,
        seatcushion_per: 4,
    },
  },
  'black': {
    'S': {
      connecter: 2,
      seatcushion: 1
    },
    'M': {
        connecter: 4,
        seatcushion: 2
    },
    'L': {
        connecter: 6,
        seatcushion: 4
    },
  },
  'silver': {
    'S': {
      connecter: 2,
      seatcushion: 1
    },
    'M': {
        connecter: 4,
        seatcushion: 2
    },
    'L': {
        connecter: 6,
        seatcushion: 4
    },
  },
  'copper': {
    'S': {
      connecter: 2,
      seatcushion: 1
    },
    'M': {
        connecter: 4,
        seatcushion: 2
    },
    'L': {
        connecter: 6,
        seatcushion: 4
    },
  },
  'bronze': {
    'S': {
      connecter: 2,
      seatcushion: 1
    },
    'M': {
        connecter: 4,
        seatcushion: 2
    },
    'L': {
        connecter: 6,
        seatcushion: 4
    },
  },
  'URL': {
    'black - black': {
      connector_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/O_cube_black-connector.gltf`,
      seatcusion_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/O_cube_black_black.gltf`,
    },
    'copper - black': {
        connector_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/O_cube_copper-connector.gltf`,
        seatcusion_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/O_cube_copper_black.gltf`,
    },
    'silver - black': {
        connector_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/O_cube_silver-connector.gltf`,
        seatcusion_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/O_cube_silver_black.gltf`,
    },
    'bronze - black': {
        connector_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/O_cube_browne-connector.gltf`,
        seatcusion_url: `${DOMAIN_URL}/wp-content/uploads/2023/10/O_cube_brownze_black.gltf`,
    },
  }
}

allData("UCUBESETS", UCUBESETS);
allData("OCUBESETS", OCUBESETS);

const isPortrait = window.matchMedia("(orientation: portrait)").matches;
const isLandscape = window.matchMedia("(orientation: landscape)").matches;



let console_disabled = false;

const nullFunc = function(){};
console = new Proxy(console, {
  get(target, prop, receiver){
    if(prop==='log' && console_disabled){
      return nullFunc;
    }
    return Reflect.get(...arguments)
  }
});



camera = new THREE.PerspectiveCamera(35, width / height, 1, 1000);
// var controls1 = new DeviceOrientationControls(camera);
// window.camera = camera;
// if (!isMobile) 
//   camera.position.set(0, 0, 11);

// if( firefox ){
//   camera.position.set(0, 0, 10);
// }else{
//   camera.position.set(0, 0, 11);
// }
// mobile and tablet check
if (isMobile && isPortrait) {
  console.log("isMobile and isPortrait", isMobile, isPortrait);
  camera.position.set(0, 0, 15);
} else if (isMobile && isLandscape) {
  console.log("isMobile and isLandscape", isMobile, isLandscape);
  camera.position.set(0, 0, 10);
} else {
  console.log("Desktop");
  camera.position.set(0, 0, 11);
}
camera.lookAt(0, 0, 0);



const rendererOptions = {
  antialias: true,
};

renderer = new THREE.WebGLRenderer({ ...rendererOptions });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", resizeWindow);
renderer.setClearColor(0xdfdfdf);



// SCENE
scene = new THREE.Scene();
// scene.add(axesHelper);
// scene.background = new THREE.Color(0xdfdfdf);

// PIVOT
const pivot = new THREE.Group();
pivot.position.set(0, 0, -1); 
pivot.add(camera);
scene.add(pivot);

// console.log(pivot.position);

camera.lookAt(pivot.position);

// CAMERA CONTROLS
controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.maxPolarAngle = 0.9 * Math.PI / 2;
controls.minPolarAngle = 0.5 * Math.PI / 2;
controls.minAzimuthAngle = -Math.PI;
controls.maxAzimuthAngle = Math.PI;
controls.enableZoom = false;
// controls.enableRotate = flase;

// AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight("#ffe2a9", 2);
scene.add(ambientLight);

// flore plane
function createFloor() {
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: "#6C5F5B",
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  floor.rotation.x = Math.PI * -0.5;
  scene.add(floor);
}

const floorY = 0;
function restrictObjectToFloor(object) {
  if (object && object.position.y < floorY) {
    object.position.y = floorY;
  }
}




// HEMISPHERE LIGHT
window.hemisphereLight = new THREE.HemisphereLight();
// window.hemisphereLight.color = new Color(5.5, 6, 9); // 5, 8, 8
// window.hemisphereLight.groundColor = new Color(5.5, 6, 9);
window.hemisphereLight.position.set(0, 20, 0);
scene.add(window.hemisphereLight);

// DIRECTIONAL LIGHT 1
var directionalLight1 = new THREE.DirectionalLight("#ffe4b9", 3);
directionalLight1.position.set(0.5, 0, 0.866);
scene.add(directionalLight1);

// var directionalLight2 = new THREE.DirectionalLight("#ffe4b9", 3);
// directionalLight2.position.set(0.5, 0, 0.866);
// const helper = new THREE.DirectionalLightHelper(directionalLight2, 5);
// scene.add(helper);
// scene.add(directionalLight2);
// // GUI
// GUI.add(directionalLight2.position, 'x', -10, 10);
// GUI.add(directionalLight2.position, 'y', -10, 10);
// GUI.add(directionalLight2.position, 'z', -10, 10);

// MODEL OUTLINE PASS
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const pixelRatio = renderer.getPixelRatio();
const outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera);
outlinePass.edgeStrength = 10;
outlinePass.edgeGlow = 0.1;
outlinePass.edgeThickness = 2.5;
outlinePass.pulsePeriod = 10;
outlinePass.usePatternTexture = false;
outlinePass.resolutionX = 512 * 3;
outlinePass.resolutionY = 512 * 3;
outlinePass.visibleEdgeColor = new THREE.Color(0, 65, 255); // Red: 0, Green: 65, Blue: 255
outlinePass.hiddenEdgeColor = new THREE.Color(0, 26, 255);  // Red: 0, Green: 26, Blue: 255
composer.addPass(outlinePass);


// FXAA SHADER PASS
const effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
effectFXAA.renderToScreen = true;
composer.addPass(effectFXAA);

const progressBar = document.getElementById("progress-bar");

const loading = new LoadingManager();
loading.onStart = function (url, itemsLoaded, itemsTotal) {
  progressBar.style.display = "flex";
};

const progressComplete = document.getElementById("progress-bar");

loading.onLoad = function () {
  progressComplete.style.display = "none";
};
loading.onProgress = function (url, itemsLoaded, itemsTotal) {
  progressBar.style.width = `${(itemsLoaded / itemsTotal) * 100}%`;
};
loading.onError = function (url) {
  hideAlert();
};

function hideAlert() {
  const alertElement = document.getElementById('danger-alert');
  alertElement.style.display = 'flex';
  setTimeout(() => {
    alertElement.style.display = 'none';
  }, 4000);
}



// if(WP_PRODUCTS[cubex.id].tag === PTAG) {
//   var uCubeButton = jQuery("button#uCube");
//   if (uCubeButton.hasClass("active")) {
//     const uData =  WP_PRODUCTS[cubex.id].variants.map((variant) => {
//       return {
//         slug: variant.slug,
//       }
//     });
//     const uCubeData = uData.filter((data) => data.slug in UCUBESETS['URL']);
//     uCubeData.forEach((data) => {
//         model_url = UCUBESETS['URL'][data.slug].connecter_url;
//         model_url2 = UCUBESETS['URL'][data.slug].seatcusion_url;
//     });
//   } else {
//     const oData =  WP_PRODUCTS[cubex.id].variants.map((variant) => {
//       return {
//         slug: variant.slug,
//       }
//     });
//     const oCubeData = oData.filter((data) => data.slug in OCUBESETS['URL']);
//     oCubeData.forEach((data) => {
//         model_url = OCUBESETS['URL'][data.slug].connecter_url;
//         model_url2 = OCUBESETS['URL'][data.slug].seatcusion_url;
//     });
//   }
// } else {
//   model_url = imageElement.dataset.modelUrl;
//   model_url2 = imageElement.dataset.modelUrl2;
// }


String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}



// CUBE LOADER
async function cloneCube(cubex) {
  const cubexVariants = jQuery("#cubex-variants-" + cubex.id);
  const imageElement = cubexVariants.find("img")[0];
  let model_url = imageElement.dataset.modelUrl;
  let model_url2 = imageElement.dataset.modelUrl2;
  
  // console.log(model_url, model_url2);

  const loader = new GLTFLoader(loading);
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(WP_DRECO_PATH);
  dracoLoader.setDecoderConfig({ type: 'js' });
  dracoLoader.preload();
  loader.setDRACOLoader(dracoLoader);

  const cubePromises = [];

  const numCubesToAdd = numbersOfCubes(cubex.id);

  function numbersOfCubes(id) {
    if (WP_PRODUCTS[id].tag === PTAG) {
      let cubesQuantity = WP_PRODUCTS[id].cubes === "" ? 0 : parseInt(WP_PRODUCTS[id].cubes);
      console.log(cubesQuantity, "cubesQuantity");
      return cubesQuantity;
    } else {
      return 1;
    }
  }

  // let i = 0;
  // let index_override = false;
  //   if (WP_PRODUCTS[cubex.id].tag === PTAG) {
  //     index_override = allCubes.length;
  //     var uCubeButton = jQuery("button#uCube");
  //     if (uCubeButton.hasClass("active")) {
  //       Object.keys(ALL_DATA['UCUBESETS'].URL).forEach((data) => {
  //         const singleSlug = data.split(" - ")[0];
  //         const slugLast = cubex.title.split("-")[1];
  //         const uCubeData = ALL_DATA.UCUBESETS[singleSlug][slugLast];
  //      if( uCubeData.connecter >= uCubeData.seatcushion ){
  //         for( let cubeCounter = 0; uCubeData.connecter > cubeCounter; cubeCounter++ ){
  //           let mi_url = ALL_DATA.UCUBESETS.URL[data];
  //           let threedUrl = cubeCounter >= uCubeData.seatcushion ? mi_url['connecter_url'] : mi_url['seatcusion_url'];
  //           var isSeatcushion = cubeCounter >= uCubeData.seatcushion ? false : true;
  //           cubePromises.push(loadAndAddCube(loader, threedUrl, cubex, i++, isSeatcushion));
  //         }
  //       }
  //       else if( uCubeData.connecter <= uCubeData.seatcushion ){
  //         for( let cubeCounter = 0; uCubeData.seatcushion > cubeCounter; cubeCounter++ ){
  //           let mi_url = ALL_DATA.UCUBESETS.URL[data];
  //           let threedUrl = cubeCounter >= uCubeData.connector ? mi_url['connecter_url'] : mi_url['seatcusion_url'];
  //           var isSeatcushion = cubeCounter >= uCubeData.seatcushion ? false : true;
  //           cubePromises.push(loadAndAddCube(loader, threedUrl, cubex, i++, isSeatcushion));
  //         }
  //       }
  //       });
  //     } else {
  //       Object.keys(ALL_DATA['OCUBESETS'].URL).forEach((data) => {
  //         const singleSlug = data.split(" - ")[0];
  //         const slugLast = cubex.title.split("-")[1];
  //         const uCubeData = ALL_DATA.OCUBESETS[singleSlug][slugLast];
  //         console.log(uCubeData, data);
  //          if( uCubeData.connecter >= uCubeData.seatcushion ){
  //             for( let cubeCounter = 0; uCubeData.connecter > cubeCounter; cubeCounter++ ){
  //               let mi_url = ALL_DATA.OCUBESETS.URL[data];
  //               let threedUrl = cubeCounter >= uCubeData.seatcushion ? mi_url['connector_url'] : mi_url['seatcusion_url'];
  //               console.log("threedUrl-1", threedUrl)
  //               var isSeatcushion = cubeCounter >= uCubeData.seatcushion ? false : true;
  //               cubePromises.push(loadAndAddCube(loader, threedUrl, cubex, i++, isSeatcushion));
  //             }
  //           }else if( uCubeData.connecter <= uCubeData.seatcushion ){
  //             for( let cubeCounter = 0; uCubeData.seatcushion > cubeCounter; cubeCounter++ ){
  //               let mi_url = ALL_DATA.OCUBESETS.URL[data];
  //               let threedUrl = cubeCounter >= uCubeData.seatcushion ? mi_url['connector_url'] : mi_url['seatcusion_url'];
  //               console.log("threedUrl-else", threedUrl)
  //               var isSeatcushion = cubeCounter >= uCubeData.seatcushion ? false : true;
  //               cubePromises.push(loadAndAddCube(loader, threedUrl, cubex, i++, isSeatcushion));
  //             }
  //           }
  //       });
  //     }
  //   } else {

  //     var isSeatcushion = WP_PRODUCTS[cubex.id].seatcushions == "1" ? true : false;
  //     if( isSeatcushion == false ){
  //       isSeatcushion = WP_PRODUCTS[cubex.id].name.toLowerCase() == "Seatcushion".toLowerCase() ? true : false;
  //     }
  //     // console.log( "isSeatcushion: " , isSeatcushion, cubex.title, cubex.id );
  //     cubePromises.push(loadAndAddCube(loader, model_url, cubex, i, isSeatcushion));
  //   }

  let cubesQuantity = WP_PRODUCTS[cubex.id].cubes === "" ? 0 : parseInt(WP_PRODUCTS[cubex.id].cubes);
  let setCubesQuantity = 0;
  let a = 0;
  let index_override = false;
  for (let i = 0; i < numCubesToAdd; i++) {
    if (cubesQuantity > 0 && setCubesQuantity < cubesQuantity) {
      index_override = allCubes.length;
      console.log(setCubesQuantity, cubesQuantity);
      let cube = await loadAndAddCube(loader, model_url, cubex, a++, false)
      // cubePromises.push(loadAndAddCube(loader, model_url, cubex, a++, false));
      setCubesQuantity++;
      positionCube(cube, index_override ? (index_override): i, numCubesToAdd);
      console.log("Position", i, index_override, numCubesToAdd, a);
    } else {
      console.log("else");
      var isSeatcushion = WP_PRODUCTS[cubex.id].seatcushions == "1" ? true : false;
      if( isSeatcushion == false ){
        isSeatcushion = WP_PRODUCTS[cubex.id].name.toLowerCase() == "Seatcushion".toLowerCase() ? true : false;
      }
      index_override = allCubes.length;
      // console.log( "isSeatcushion: " , isSeatcushion, cubex.title, cubex.id );
      cubePromises.push(loadAndAddCube(loader, model_url, cubex, a++, isSeatcushion));
    }
  }
  if( cubePromises.length ){
    Promise.all(cubePromises).then((cubes) => {
      cubes.forEach((cube, index) => {
        // console.log(cube, index, numCubesToAdd);
        positionCube(cube, index_override ? (index_override+index): index, numCubesToAdd);
      });
    });
  }
  
}
async function loadAndAddCube(loader, url, cubex, index, isSeatcushion) {
  console.log("modelCache[url]", 3);
  return new Promise((resolve, reject) => {
    if (modelCache[url]) {
    
      const cachedModel = modelCache[url].clone();
      const products = WP_PRODUCTS[cubex.id];
      cachedModel.userData.draggable = false;
      cachedModel.name = cubex.title + "-" + (allCubes.length + 1);
      cachedModel.userData.type = cubex.title;
      cachedModel.userData.id = cubex.id;
      cachedModel.userData.price = products.price;
      cachedModel.userData.category = products.category ?? "";
      cachedModel.userData.slug = clickedSlug;
      cachedModel.userData.set = products.tag;
      cachedModel.userData.cubesQuantity = products.cubes === "" ? 0 : parseInt(products.cubes);
      cachedModel.userData.connectorQuantity = products.connecters === "" ? 0 : parseInt(products.connecters);
      cachedModel.userData.seatcussionQuantity = products.seatcussions === "" ? 0 : parseInt(products.seatcussions);
      cachedModel.isSeatcushion = isSeatcushion;
      cachedModel.face = 0;
      cachedModel.userData.rotation = { x: Math.floor(cachedModel.rotation.x), y: Math.floor(cachedModel.rotation.y), z: Math.floor(cachedModel.rotation.z) };
      allCubes.push(cachedModel);
      allData("allCubes", allCubes);
      jQuery("#cube_counters_" + cubex.id).html(allCubes.filter((cachedModel) => cachedModel.userData.id === cubex.id).length);
      
      scene.add(cachedModel);
      resolve(cachedModel);
    } else {
      loader.load(url, (gltf) => {
        console.log("modelURL: else >>>>>>>>", url,);
        // console.log( 'modelURL: ', url, index, cubex )
        const cube = gltf.scene.clone();
        modelCache[url] = cube;
        const products = WP_PRODUCTS[cubex.id];
        // cube.scale.set(2.5, 2.5, 2.5);
        cube.userData.draggable = false;
        cube.name = cubex.title + "-" + (allCubes.length + 1);
        cube.userData.type = cubex.title;
        cube.userData.id = cubex.id;
        cube.userData.price = products.price;
        cube.userData.category = products.category ?? "";
        cube.userData.slug = clickedSlug;
        cube.userData.set = products.tag;
        cube.userData.cubesQuantity = products.cubes === "" ? 0 : parseInt(products.cubes);
        cube.userData.connectorQuantity = products.connecters === "" ? 0 : parseInt(products.connecters);
        cube.userData.seatcussionQuantity = products.seatcussions === "" ? 0 : parseInt(products.seatcussions);
        cube.isSeatcushion = isSeatcushion;
        cube.face = 0;
        cube.userData.rotation = { x: Math.floor(cube.rotation.x), y: Math.floor(cube.rotation.y), z: Math.floor(cube.rotation.z) };
        allCubes.push(cube);
        allData("allCubes", allCubes);
        jQuery("#cube_counters_" + cubex.id).html(allCubes.filter((cube) => cube.userData.id === cubex.id).length);
        scene.add(cube);
        resolve(cube);
      }, null, reject);
    }
  });
}


function positionCube(cube, index, numCubesToAdd) {
  const spacingX = -1;
  const spacingZ = -1;

  if (numCubesToAdd > 1) {
    const row = Math.floor(index / 4);
    const col = index % 4;
    cube.children[0].position.x = col * spacingX;
    cube.children[0].position.z = row * spacingZ;
    cube.children[0].position.y = 0;
  } else {
    if (index > 1) {
      const row = Math.floor(index / 4);
      const col = index % 4;
      cube.children[0].position.x = col * spacingX;
      cube.children[0].position.z = row * spacingZ;
      cube.children[0].position.y = 0;
    } else {
      index = allCubes.length - 1;
      const row = Math.floor(index / 4);
      const col = index % 4;
      cube.children[0].position.x = col * spacingX;
      cube.children[0].position.z = row * spacingZ;
      cube.children[0].position.y = 0;
    }
  }
}


// ROTATION CONTROLS
jQuery("#rotateCube").on("click", handleRotateCubes);
function handleRotateCubes() {
  jQuery("#rotateCube").addClass("active");
  jQuery("#moveCube").removeClass("active");
  renderer.domElement.removeEventListener("pointerdown", onModelDown, false);
  renderer.domElement.removeEventListener("pointermove", onModelMove, false);
  renderer.domElement.removeEventListener("pointerup", onModelUp, false);
  renderer.domElement.addEventListener("pointerdown", onMouseDownRotation, false);
}

// MOVEMENT CONTROLS
jQuery("#moveCube").on("click", handleMoveCube);
function handleMoveCube() {
  controls.enabled = false;
  jQuery("#moveCube").addClass("active");
  jQuery("#rotateCube").removeClass("active");
  console.log( 'test inits' );
  renderer.domElement.addEventListener("pointerdown", onModelDown, false);
  renderer.domElement.addEventListener("touchstart", onModelDown, false);
  renderer.domElement.addEventListener("pointermove", onModelMove, false);
  renderer.domElement.addEventListener("pointerup", onModelUp, false);
}

// DELETE ALL CUBES
jQuery("#deleteAllCube").on("click", deleteAllCubes);
function deleteAllCubes() {
  for (let i = 0; i < allCubes.length; i++) {
    scene.remove(allCubes[i]);
  }
  allCubes = [];
  ALL_DATA = {
    UCUBESETS,
    OCUBESETS,
  };
  totalQuenty = 0;
  busniess_cart_info = {};
  // update the cube counter
  jQuery(".cube_counters").html(0);
  // data-count attribute set to 0
  jQuery(".sub-cube-images").attr("data-count", 0);
  jQuery(".cubeImage").attr("data-count", 0);
  eachProductQuantity = {};
}

// DELETE SELECTED CUBE
jQuery("#deleteCube").on("click", deleteSelectedCube);
function deleteSelectedCube() {
  for (let i = 0; i < allCubes.length; i++) {
    // console.log(allCubes[i]);
    if (allCubes[i].children[0] === selectedCube) {
      scene.remove(allCubes[i]);
      allCubes.splice(i, 1);
      const dataValue = jQuery("#Textures-" + selectedCube.parent.userData.id).attr("data-count");
      const subDataValue = jQuery("#Sub-Textures-" + selectedCube.parent.userData.id).attr("data-count");
      if (dataValue > 0) {
        jQuery("#Textures-" + selectedCube.parent.userData.id).attr("data-count", parseInt(dataValue) - 1);
      } else if (subDataValue > 0) {
        jQuery("#Sub-Textures-" + selectedCube.parent.userData.id).attr("data-count", parseInt(subDataValue) - 1);
      }
      if (totalQuenty > 0) {
        totalQuenty = totalQuenty - 1;
      }

      const slug = busniess_cart_info[selectedCube.parent.userData.slug];
      // console.log(slug);
      if (slug) {
        if (slug.seatcussionQuantity <= selectedCube.userData.cubesQuantity) {
          var cussionQuantity = slug.seatcussionQuantity - 1;
        }
        if (slug) {
          slug.cubesQuantity = slug.cubesQuantity - 1;
          slug.connectorQuantity = slug.connectorQuantity - 1;
          slug.seatcussionQuantity = cussionQuantity;
        }
      }
      jQuery("#cube_counters_" + selectedCube.parent.userData.id).html(allCubes.filter((cube) => cube.userData.id === selectedCube.parent.userData.id).length);
    } else if (allCubes[i] === selectedCube) {
      scene.remove(allCubes[i]);
      allCubes.splice(i, 1);
      const dataValue = jQuery("#Textures-" + selectedCube.userData.id).attr("data-count");
      const subDataValue = jQuery("#Sub-Textures-" + selectedCube.userData.id).attr("data-count");
      if (dataValue > 0) {
        jQuery("#Textures-" + selectedCube.userData.id).attr("data-count", parseInt(dataValue) - 1);
      } else if (subDataValue > 0) {
        jQuery("#Sub-Textures-" + selectedCube.userData.id).attr("data-count", parseInt(subDataValue) - 1);
      }
      if (totalQuenty > 0) {
        totalQuenty = totalQuenty - 1;
      }

      const slug = busniess_cart_info[selectedCube.userData.slug];
      // console.log(slug);
      if (slug) {
        if (slug.seatcussionQuantity <= selectedCube.userData.cubesQuantity) {
          var cussionQuantity = slug.seatcussionQuantity - 1;
        }
        if (slug) {
          slug.cubesQuantity = slug.cubesQuantity - 1;
          slug.connectorQuantity = slug.connectorQuantity - 1;
          slug.seatcussionQuantity = cussionQuantity;
        }
      }
      jQuery("#cube_counters_" + selectedCube.userData.id).html(allCubes.filter((cube) => cube.userData.id === selectedCube.userData.id).length);

    }
  }
  selectedCube = null;
}


const getPrimaryCubes = () => {
  const uCube = Object.values(WP_PRODUCTS).filter(
    (product) => product.slug === "u-cube"
  )[0];
  const oCube = Object.values(WP_PRODUCTS).filter(
    (product) => product.slug === "o-cube"
  )[0];
  return { uCube, oCube };
};

const getSecondaryCubes = () => {
  var activeLanguageElement = document.querySelector('.wpml-ls-current-language');
  var activeLanguage = activeLanguageElement.querySelector('.wpml-ls-native').textContent.trim();
  var selectedLanguage = activeLanguage.toLowerCase();
  var OCubeProducts, UCubeProducts;
  OCubeProducts = Object.values(WP_PRODUCTS).filter(
    (product) => product.show_in_configurator === true && (product.category == "O-Wuerfel" || product.category == "O-Cube") && product.language == "en"
  );
  UCubeProducts = Object.values(WP_PRODUCTS).filter(
    (product) => product.show_in_configurator === true  && (product.category == "U-Wuerfel" || product.category == "U-Cube") && product.language == "en"
  );
	// if (selectedLanguage == "english") {
  // OCubeProducts = Object.values(WP_PRODUCTS).filter(
  //   (product) => product.show_in_configurator === true && (product.category == "O-Wuerfel" || product.category == "O-Cube") && product.language == "en"
  // );
  // UCubeProducts = Object.values(WP_PRODUCTS).filter(
  //   (product) => product.show_in_configurator === true  && (product.category == "U-Wuerfel" || product.category == "U-Cube") && product.language == "en"
  // );
	// } else {
	// 	OCubeProducts = Object.values(WP_PRODUCTS).filter(
  //   (product) => product.show_in_configurator === true && (product.category == "O-Wuerfel" || product.category == "O-Cube") && product.language == "de"
  // );
  // UCubeProducts = Object.values(WP_PRODUCTS).filter(
  //   (product) => product.show_in_configurator === true  && (product.category == "U-Wuerfel" || product.category == "U-Cube") && product.language == "de"
  // );
	// }
  return { OCubeProducts, UCubeProducts };
};


const attributesAndMenus = (cubex) => {
  let connectorAttribute = WP_PRODUCTS[cubex.id].attributes["pa_connecter-single"] ?? [];
  let usurfaceAttribute = WP_PRODUCTS[cubex.id].attributes["pa_cube-surface"] ?? [];
  let osurfaceAttribute = WP_PRODUCTS[cubex.id].attributes["pa_o-cube-surface"] ?? [];
  let seatcussionAttribute = WP_PRODUCTS[cubex.id].attributes["pa_seatcushion-single"] ?? [];

  let connector_div = connectorAttribute.map((connector) => `<li data-slug="${connector.slug}" onclick="toggleActive(this)"><span style="background-color: ${connector.color}; cursor: pointer;"></span></li>`).join("");
  let u_surface_div = usurfaceAttribute.map((u_surface) => `<li data-slug="${u_surface.slug}" onclick="toggleActive(this)"><span style="background-color: ${u_surface.color}; cursor: pointer;"></span></li>`).join("");
  let o_surface_div = osurfaceAttribute.map((o_surface) => `<li data-slug="${o_surface.slug}" onclick="toggleActive(this)"><span style="background-color: ${o_surface.color}; cursor: pointer;"></span></li>`).join("");
  let seatcussion_div = seatcussionAttribute.map((seatcussion) => `<li data-slug="${seatcussion.slug}" onclick="toggleActive(this)"><span style="background-color: ${seatcussion.color}; cursor: pointer;"></span></li>`).join("");

  let { OCubeProducts, UCubeProducts } = getSecondaryCubes();

  let o_menu_items = OCubeProducts.map((product) => product);
  let u_menu_items = UCubeProducts.map((product) => product);



  return { connectorAttribute, surfaceAttribute: osurfaceAttribute, seatcussionAttribute, connector_div, u_surface_div, o_surface_div, seatcussion_div, u_menu_items, o_menu_items };
};

const cubex = {
  id: null,
  type: "",
  title: "",
  image: null,
  menu_items: [],
  connector_div: null,
  u_surface_div: null,
  o_surface_div: null,
  seatcussion_div: null,
  price: null,
  tag: "",
  isSeatcushion: false,
};

jQuery(".btn-switch-cube").click(function () {
  let { uCube, oCube } = getPrimaryCubes();

  if (jQuery(this).attr("id") === "uCube") {
    cubex.id = uCube.id;
    cubex.type = "uCube";
    // window.hemisphereLight.intensity = 1.1;
    cubex.menu_items = attributesAndMenus(cubex).u_menu_items;
  } else {
    cubex.id = oCube.id;
    cubex.type = "oCube";
    // window.hemisphereLight.intensity = 0.6;
    cubex.menu_items = attributesAndMenus(cubex).o_menu_items;
  }

  let { connector_div, u_surface_div, o_surface_div, seatcussion_div } = attributesAndMenus(cubex);

  cubex.title = WP_PRODUCTS[cubex.id].name;
  cubex.image = WP_PRODUCTS[cubex.id].image;
  cubex.connector_div = connector_div;
  cubex.u_surface_div = u_surface_div;
  cubex.o_surface_div = o_surface_div;
  cubex.seatcussion_div = seatcussion_div;
  cubex.price = WP_PRODUCTS[cubex.id].price;
  cubex.tag = WP_PRODUCTS[cubex.id].tag;

  switchCubeModel(cubex);
});

jQuery("#uCube").click();

function switchCubeModel(cubex) {
  jQuery("#uCube").toggleClass("active");
  jQuery("#oCube").toggleClass("active");

  CubeModel.init(cubex);

  jQuery("#Textures-" + cubex.id + ', #Textures-tooltip-' + cubex.id).click(function (e) {
    cloneCube(cubex);
    allData("cubex", cubex);
    clickedSlug = jQuery( `#Textures-${cubex.id}` ).data('slug');
    // clickedSlug = e.target.dataset.slug;
    allData("clickedSlug", clickedSlug);
  });

  let { OCubeProducts, UCubeProducts } = getSecondaryCubes();

  const oCubeModel = OCubeProducts.map((product) => {
    return {
      id: product.id,
      title: product.name,
    }
  });


  const uCubeModel = UCubeProducts.map((product) => {
    return {
      id: product.id,
      title: product.name,
    };
  });

  allSubCubes = [...oCubeModel, ...uCubeModel];
  allData("allSubCubes", allSubCubes);

  deleteAllCubes();
}

jQuery(document).on('click', ".sub-cube-images, .Sub-Textures-tooltip", function (e) {
  var productId = jQuery(e.target).data("product-id");
  var slug = jQuery(e.target).data("slug");
  slug == undefined ? slug = jQuery('#Sub-Textures-' + productId).data("slug") : slug = slug;

  console.log(slug);
  allSubCubes.forEach((subProduct) => {
    if (subProduct.id === productId) {
      clickedSlug = slug;
      allData("sub-cube-slug", clickedSlug);
      cloneCube(subProduct);
    }
  })
});



function animate() {
  resizeWindow();
  restrictObjectToFloor(selected);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  composer.render();
}

function allData(key, value) {
  ALL_DATA[key] = value;
}

function resizeWindow() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

// // after every 5 seconds
// setInterval(() => {
//   compare(allCubes, selectedCube);
//   connectorCompare(selectedCube);
// }, 2000);

// ZOOM IN AND OUT CONTROLS
// Define the clickZoom function
const clickZoom = (value, zoomType) => {
  if (zoomType === "zoomIn") {
    value = Math.max(29, value - 3); // Ensure it doesn't go below 29
  } else if (zoomType === "zoomOut") {
    value = Math.min(44, value + 3); // Ensure it doesn't exceed 44
  }
  return value;
};


// Define the getFov function
const getFov = () => {
  return Math.floor(
    (2 *
      Math.atan(camera.getFilmHeight() / (2 * camera.getFocalLength())) *
      (180 / Math.PI))
  );
};

// rotate single cube 90 degree
jQuery("#rotateSingleCube").on("click", () => {
  // console.log( 'rotate: ', selectedCube );
  selectedCube.rotation.y -= Math.PI / 2;
  if( selectedCube && jQuery('#oCube').hasClass('active')  ){
    OBJECT_FACE[selectedCube.uuid] = OBJECT_FACE[selectedCube.uuid] == undefined ? 3 : OBJECT_FACE[selectedCube.uuid];
    OBJECT_FACE[selectedCube.uuid] = OBJECT_FACE[selectedCube.uuid] == 3 ? 0 : parseInt(OBJECT_FACE[selectedCube.uuid]) + 1;
    // console.log( "Face Direction:", selectedCube.face, OBJECT_FACE[selectedCube.uuid] );
    connectorCompare( selectedCube );
  }else
  if (selectedCube && selectedCube) {
    OBJECT_FACE[selectedCube.uuid] = OBJECT_FACE[selectedCube.uuid] == undefined ? 0 : OBJECT_FACE[selectedCube.uuid];
    OBJECT_FACE[selectedCube.uuid] = OBJECT_FACE[selectedCube.uuid] == 3 ? 0 : parseInt(OBJECT_FACE[selectedCube.uuid]) + 1;
    // console.log( "Face Direction:", selectedCube.face, OBJECT_FACE[selectedCube.uuid] );
    connectorCompare( selectedCube );
  }
});

// Function to update the camera FOV and input range value
const updateCameraFOV = (updatedFov) => {
  camera.fov = updatedFov;
  camera.updateProjectionMatrix();
  jQuery('input[type="range"]').val(updatedFov);
};

// Function to handle zoom in button click
jQuery("#zoomIn").on("click", () => {
  const currentFov = getFov();
  const zoomInFov = clickZoom(currentFov, "zoomIn");
  updateCameraFOV(zoomInFov);
});

// Function to handle zoom out button click
jQuery("#zoomOut").on("click", () => {
  const zoomOut = getFov();
  const zoomOutFov = clickZoom(zoomOut, "zoomOut");
  updateCameraFOV(zoomOutFov);
});

// Function to handle range input change
jQuery('input[type="range"]').on("input", (e) => {
  const rangeFov = parseInt(e.target.value);
  updateCameraFOV(rangeFov);
});

// Initialize camera FOV
const initialFov = 44;
updateCameraFOV(initialFov);


// MODEL ROTATION
function onMouseDownRotation(event) {
  event.preventDefault();
  controls.enabled = true;
  controls.enableRotate = true;
  // // connectorCompare(allCubes, selected);
}

var scope = this;
const _inverseMatrix = new Matrix4();
const hovered = null;


function onModelMove(event) {
  // event.preventDefault();

  updatePointer(event);
  intersects.length = 0;
  raycaster.setFromCamera(_pointer, camera);

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // console.log( "Mob: ", window.screen.height, mouse.x, mouse.y );
    if( !isMobile && window.location.pathname == '/konfigurator/' && window.screen.height >= 1050 )
    {
      mouse.y = mouse.y + 0.18; //@todo: Offset manual for now
    }else if( !isMobile && window.location.pathname == '/konfigurator/' && window.screen.height >= 768 ){
      mouse.y = mouse.y + 0.24;
    }else if( isMobile ){
      if(event.type.includes(`touch`)) {
        const { touches, changedTouches } = event.originalEvent ?? event;
        const touch = touches[0] ?? changedTouches[0];
        mouse.x = touch.pageX;
        mouse.y = touch.pageY + 0.2;
        console.log( 'mobile devices',x,y );
    }
    }
    
   
    // console.log(event.clientX, event.clientY);
    raycaster.setFromCamera(mouse, camera);
    if (Dragged) {
      if (raycaster.ray.intersectPlane(plane, intersection)) {
        Dragged.position.copy(intersection.sub(offset).applyMatrix4( _inverseMatrix ));
      }
      return;
    }
    intersects = raycaster.intersectObjects(allCubes, true, intersects);

    // console.log(intersects);
    if (selectedCube) {
      compare(allCubes, selectedCube);
      connectorCompare(selectedCube);
    }
    if (intersects.length > 0) {
      if (selected != intersects[0].object.parent) {
        selected = intersects[0].object.parent.isSeatcushion ? intersects[0].object.parent.children[0] : intersects[0].object.parent;
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",selected);
        plane.setFromNormalAndCoplanarPoint(
          camera.getWorldDirection(plane.normal),
          selected.position
          );
      }
      // console.log( 'intersect: updating: mouse-cursor' );
      document.body.style.cursor = "pointer";
    } else {
      selected = null;
      document.body.style.cursor = "auto";
    }

}

function updatePointer( event ) {

  const rect = renderer.domElement.getBoundingClientRect();

  _pointer.x = ( event.clientX - rect.left ) / rect.width * 2 - 1;
  _pointer.y = - ( event.clientY - rect.top ) / rect.height * 2 + 1;

}



function onModelDown(event) {
console.log("Mob: Selection: ", selected);
  event.preventDefault();
  console.log("isMobile: ", isMobile, "Dragged: ", Dragged, "selected: ", selected);
  if( isMobile && !Dragged && selected == null){
    console.log( 'mobile devices' );
    intersects.length = 0;
    raycaster.setFromCamera(_pointer, camera);
    if(event.type.includes(`touch`)) {
      const { touches, changedTouches } = event.originalEvent ?? event;
      const touch = touches[0] ?? changedTouches[0];
      var x = touch.pageX;
      var y = touch.pageY;
      console.log( 'mobile devices',x,y );
    }
    mouse.x = ( x / window.innerWidth ) * 2 - 1;
		mouse.y = - ( y / window.innerHeight ) * 2 + 1;
    console.log( "My Mob: ", window.screen.height, mouse.x, mouse.y );
    if (!isMobile) {
      mouse.y = mouse.y + 0.24;
    }
    console.log( "My Mob - Y: ", mouse.y );
    raycaster.setFromCamera(mouse, camera);

    intersects = raycaster.intersectObjects(allCubes, true);

    if (selectedCube) {
      compare(allCubes, selectedCube);
      connectorCompare(selectedCube);
    }

    console.log("intersects",intersects);
  
    if (intersects.length > 0) {
      if (selected != intersects[0].object.parent) {
        selected = intersects[0].object.parent.isSeatcushion ? intersects[0].object.parent.children[0] : intersects[0].object.parent;
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",selected);
        plane.setFromNormalAndCoplanarPoint(
          camera.getWorldDirection(plane.normal),
          selected.position
          );
      }
      // console.log( 'intersect: updating: mouse-cursor' );
      document.body.style.cursor = "pointer";
    }
  }
  if (selected) {
    console.log("Selection true:: ", selected);
    selected.parent.userData.draggable = true;
    controls.enabled = false;
    Dragged = selected;
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      offset.copy(intersection).sub(Dragged.position);
    }
    selectedCube = selected;
    selectedObjects.push(intersects[0].object.parent);
    outlinePass.selectedObjects = [selected];
    document.body.style.cursor = "move";
  } 
  else {
    outlinePass.selectedObjects = [];
    console.log("Selection false:: ", selected);

  }
}

function onModelUp(event) {
  event.preventDefault();
  controls.enabled = true;
  if (selected) {
    selected.position.x = Math.round(selected.position.x);
    selected.position.y = (Math.round(selected.position.y)) / 1.05;
    selected.position.z = Math.round(selected.position.z);
    console.log("Selected position", selected.position);
    compare(allCubes, selected);
    connectorCompare(selected);

  }


  if (Dragged) {
    Dragged = null;
    selected = null;
    // selected.parent.userData.draggable = false;

  }
  document.body.style.cursor = "auto";
}

function getXZCompare( all, selected, propsedY ){
  let is_match = false;
  let match = selected;
  console.log("All:::::::::::", all);
  // for (let i = 0; i < all.length; i++) {
  //   all = all[i].isSeatcushion ? all[i] : all[i].children[0]
  //   console.log(all);
  // }
  all.forEach(function(data){
    data = data.children[0];
    console.log("DATA:::::::::::::::::",data);
    let xz = data.position;
    console.log("propsedY:::::::::::::::::: ", propsedY);

    console.log( 'match', xz.x, xz.y, xz.z, '=', match.x, propsedY, match.z, );
    console.log("Match:::::::::::::::::", match);
    console.log("Compare data != selected", data.position != selected);
    console.log("Selected:::::::::::::::::", selected);
    console.log(xz.x == match.x && xz.z == match.z && xz.y == match.y && data.parent.isSeatcushion && data.position != selected);
    // console.log( 'susion: ', data.parent.isSeatcushion );
    // console.log(xz.x == match.x && xz.z == match.z && propsedY == 0.9523809523809523);
    // console.log('susion: ', data.children[0].parent.isSeatcushion);
    if( xz.x == match.x && xz.z == match.z && xz.y == propsedY && data.parent.isSeatcushion ){
      // console.log( 'match-cusion', data.children[0].parent.name);
      is_match = 2;
      console.log( 'match-cusion', data.name);
      return is_match;
    } 
    // (xz.y != 0.9523809523809523 && xz.y != 1.9047619047619047 && xz.y != 2.857142857142857)
    else if ( xz.x == match.x && xz.z == match.z && xz.y == match.y && data.parent.isSeatcushion && data.position != selected){
      is_match = 3;
      console.log( 'match-cusion 0.06675999611616135', data.name);
      return is_match;
    }

    if( xz.x == match.x && xz.z == match.z && xz.y == propsedY){
      is_match = true;

      // console.log( 'match', data.children[0].parent.name);
      return is_match;
    }


  });
  console.log( "match?:", is_match );
  return is_match;
}

function compare(all, current) {
  console.log("Current compare cube::::::", current);
if (all == undefined || all.length == 0 || all == [] || all == null || current == undefined) {
  return;
}
if (current.position.y > 0 && all.length == 1) {
  console.log("This one");
  current.position.y = (Math.round(current.position.y)) / 1.05;
}

if (current.position.y < 0 && all.length >= 1) {
  current.position.y = 0;
}
console.log("Compare function is called");

for (let i = 0; i < all.length; i++) {
  // let selectedObject = current;
  // let selectedObject = current.isSeatcushion ? current.children[0] : current.parent.children[0];
  // console.log("Now I'm hare pos :: 1", selectedObject);
  let allCubeNew = all[i].isSeatcushion ? all[i].children[0] : all[i].children[0];
  // console.log(allCubeNew !== selectedObject, "allCubeNew !== selectedObject");
  if (allCubeNew !== current) {
    // console.log("Now I'm hare pos :: 2", allCubeNew);
    // const A1 = all[i].children[0].position;
    // let selectedCubePos = current.position;
    let A1 = allCubeNew.position;
    let selectedCubePos = current.position;

    console.log("=============================================");
    console.log("all[i]", allCubeNew);
    console.log("A1", A1);
    console.log("selectedCubePos", selectedCubePos);
    console.log("=============================================");


    console.log("=============================================");
    console.log(selectedCubePos.y == 0 && (A1.x == selectedCubePos.x && A1.z == selectedCubePos.z) && all[i].isSeatcushion);
    console.log("=============================================");

    if (A1.x === selectedCubePos.x && A1.z === selectedCubePos.z && A1.y === selectedCubePos.y) {
      current.position.y = (Math.round(current.position.y + 1)) / 1.05;
    }
    // selectedCubePos = current.position;
    if (selectedCubePos.y > 0 && (A1.x != selectedCubePos.x && A1.z != selectedCubePos.z || A1.y != selectedCubePos.y)) {
      console.log("AIR CUBE DOWN");
      let propsedY = (Math.round(selectedCubePos.y - 1)) / 1.05;

      let is_match = getXZCompare( all, selectedCubePos, propsedY );
      if(  is_match === false ){
        selectedCubePos.y = propsedY;
        // console.log( 'Moving down!!', `is_match: ${is_match}`, all[i].name );

      }else if( is_match === 2 ){
        selectedCubePos.x = Math.round(selectedCubePos.x+1);
        console.log( 'Moving sideways!!', `is_match: ${is_match}`,  all[i].parent.name );
      }



      // selectedCubePos = selectedCubePos;


    } 
    else if (selectedCubePos.y == 0 && (A1.x == selectedCubePos.x && A1.z == selectedCubePos.z) && all[i].isSeatcushion) {
      console.log("Cube is on the cushion");
      let propsedY = (Math.round(selectedCubePos.y + 1)) / 1.05;
      console.log( 'propsedY:::::::::::::::::: ', propsedY);
      let is_match = getXZCompare( all, selectedCubePos, propsedY );
      if( is_match === 3 ){
        selectedCubePos.x = Math.round(selectedCubePos.x+1);
        console.log( 'Moving sideways!!!!!!!!!!!!!!!!', `is_match: ${is_match}`,  all[i].parent.name );
      }
    }

  }
}

}


// Connector on same side of Cube
function connectorCompare(current) {
  console.log("current", current);
  let all = ALL_DATA.allCubes;
  if (all == undefined || all.length == 0 || all == [] || all == null || current == undefined) {
    return;
  }
  for (let i = 0; i < all.length; i++) {
    if (all[i] != current.parent) {
      const A1 = all[i].children[0];
      if( jQuery('#oCube').hasClass('active') ){
        OBJECT_FACE[A1.uuid] == undefined ? 3 : OBJECT_FACE[A1.uuid];
        OBJECT_FACE[current.uuid] = OBJECT_FACE[current.uuid] == undefined ? 3 : OBJECT_FACE[current.uuid];
      }else{
        OBJECT_FACE[A1.uuid] == undefined ? 0 : OBJECT_FACE[A1.uuid];
        OBJECT_FACE[current.uuid] = OBJECT_FACE[current.uuid] == undefined ? 0 : OBJECT_FACE[current.uuid];
      }
      
      if( 
        current.position.x == A1.position.x + 1 || 
        current.position.x == A1.position.x - 1 || 
        current.position.z == A1.position.z + 1 || 
        current.position.z == A1.position.z - 1 ){
        //Attached
        console.log("Attached", A1.position, current.position);
        let other_face = OBJECT_FACE[A1.uuid] == undefined ? 0 : OBJECT_FACE[A1.uuid];
        if( jQuery('#oCube').hasClass('active') ){
          other_face = OBJECT_FACE[A1.uuid] == undefined ? 3 : OBJECT_FACE[A1.uuid];
        }
        
        console.log( "other: ",other_face , 'selected: ',OBJECT_FACE[current.uuid] );
        if( ((OBJECT_FACE[current.uuid] == 1 && other_face == 3) || (OBJECT_FACE[current.uuid] == 3 && other_face == 1)) && (current.position.x == A1.position.x+1 || current.position.x == A1.position.x-1) ){
          if (current.position.x == A1.position.x-1) {
            A1.position.x = Math.round(A1.position.x+1);
          } else {
            console.log("pushed 1:3");
            current.position.x = Math.round(current.position.x+1);
          }
        }else if( ((OBJECT_FACE[current.uuid] == 0 && other_face == 2) || (OBJECT_FACE[current.uuid] == 2 && other_face == 0)) && ((current.position.z == A1.position.z+1 || current.position.z == A1.position.z-1) && current.position.x == A1.position.x)){           
          if (A1.position.z-1 == current.position.z) {
            console.log("pushed 0:2:::");
            current.position.z = Math.round(A1.position.z+1);
          } else {
            console.log("pushed 0:2", (A1.position.z-1), (current.position.z), A1.parent.name);
            current.position.z = Math.round(current.position.z+1);
          }
        }
      }
      
      
    }
  }
}



if (WP_CURRENT_USER_ROLE === BUSINESS_CUSTOMER) {
  jQuery("#requestOffer").html(REQUEST_AN_OFFER);
} else {
  jQuery("#requestOffer").html(ADD_TO_CART);
}

function showAlert(messageClass, duration) {
  var alertElement = document.querySelector("." + messageClass);
  if (alertElement) {
    alertElement.style.display = "block";
    setTimeout(function () {
      alertElement.style.display = "none";
    }, duration);
  }
}

jQuery("#uCube").html(UCUBE);
jQuery("#oCube").html(OCUBE);

let productQuantity = 0;
document.getElementById('cubex').addEventListener('click', function (event) {
  if (event.target.tagName.toLowerCase() === 'img' && event.target.hasAttribute('data-product-id') ) {
    const productId = event.target.getAttribute('data-product-id');
    const currentCount = event.target.getAttribute('data-count');
    console.log( 'currentCount: ', currentCount );
    let count = parseInt(currentCount);
    if (count > 0) {
      count++;
    } else {
      count = 1;
    }
    event.target.setAttribute('data-count', count);
    const newCount = event.target.getAttribute('data-count');

    eachProductQuantity[productId] = parseInt(newCount);
    console.log( 'eachProductQuantity: ', eachProductQuantity );
    
    totalQuenty = totalQuenty + 1;
    
    console.log( 'totalQuenty: ', totalQuenty );
  }
  console.groupEnd('cart');
});

function handleRequestOfferClick() {
  jQuery("#productDetailsTable").empty();
  let productRow = '';

  allCubes.forEach((prd) => {
    let product = prd.userData;
    if (busniess_cart_info[product.slug] == undefined) {
      busniess_cart_info[product.slug] = product;
    } else {
      var info = busniess_cart_info[product.slug];
      info.id = product.id;
      info.name = product.type;

      info.quantity = (info.cubesQuantity + product.cubesQuantity) / product.cubesQuantity;
      info.cubesQuantity = eachProductQuantity[product.id] * product.cubesQuantity;
      info.connectorQuantity = eachProductQuantity[product.id] * product.connectorQuantity;
      info.seatcussionQuantity = eachProductQuantity[product.id] * product.seatcussionQuantity;
    }
  });
  for (const key in busniess_cart_info) {
    let product = busniess_cart_info[key];
    console.log(product.slug);
    var product_slug = product.slug.toUpperCase();

    var color = product_slug.split(' - ');
    var set_color = {};
    if (product.type === UCUBE || product.type === OCUBE) {
      set_color = {
        'Cube Surface': color[0] + ' - ' + product.cubesQuantity,
        'Connector': color[1] + ' - ' + product.cubesQuantity,
      }
    } else if (product.type === SEATCUSSION) {
      set_color = {
        SEATCUSSION: color[0] + ' - ' + product.seatcussionQuantity,
      }
    } else if (WP_PRODUCTS[product.id].tag === PTAG) {
      set_color = {
        "Connector": color[0] + ' - ' + product.connectorQuantity,
        "Seatcushion": color[1] + ' - ' + product.seatcussionQuantity,
      }
    }

    var productVarient = '';
    for (const key in set_color) {
      productVarient = `${productVarient}<p>${key}: ${set_color[key]}</p>`;
    }

    productRow = `${productRow}<tr data-slug="${product.slug}">
            <td>${product.type}</td>
            <td class="productVarient">${productVarient}</td>
          </tr>`;
  }
  if (productRow != '') {
    jQuery("#productDetailsTable").html(productRow);

    jQuery("#productDetailsModal").modal("show");

    isRequestInProgress = false;


  } else {
    jQuery("#requestOffer").prop("disabled", true);
  }
}

function sendRequest() {
  if (isRequestInProgress) {
    return;
  }
  isRequestInProgress = true;

  jQuery.ajax({
    url: '/wp-admin/admin-ajax.php',
    type: "POST",
    cache: false,
    data: {
      action: "send_request",
      products: busniess_cart_info,
      note: jQuery("#exampleFormControlTextarea1").val(),
    },
    success: function (response) {
      jQuery("#productDetailsModal").modal("hide");
      jQuery("#exampleFormControlTextarea1").val("");
      if (response.success) {
        showAlert("alert-success-1", 4000);
      }
    },
    error: function (error) {
      showAlert("alert-error-1", 4000);
    },
    complete: function () {
      isRequestInProgress = false;
      jQuery("#productDetailsTable").empty();
      jQuery("#sendRequestButton").off("click", sendRequest);
    }
  });
}
jQuery("#sendRequestButton").on("click", sendRequest);

function handleAddToCartClick() {
  // console.log( "Cart execution: ", totalQuenty );
  var productsToAddToCart = [];
  var productDetailsMap = {};
  const quantity = totalQuenty;
  allCubes.forEach((product, prodIndex) => {
    if (quantity > 0) {
      const productName = product.userData.type;
      const variants = WP_PRODUCTS[product.userData.id].variants;
      const varient_slug = product.userData.slug;
      console.log( 'varient_slug: ', varient_slug);
      const slug = varient_slug+ ' - ' + varient_slug;
      console.log( 'slug: ', slug);
      const varient = variants.filter((varient) => varient.slug === varient_slug)[0];
      console.log(eachProductQuantity[product.userData.id], "eachProductQuantity[product.userData.id]");
      const signleQuantity = eachProductQuantity[product.userData.id];

      if (productDetailsMap[productName] && productDetailsMap[productName].varientId === varient.id) {
        productDetailsMap[productName].quantity = signleQuantity / product.userData.cubesQuantity;
        productDetailsMap[productName].varientId = varient.id;
        productDetailsMap[productName].name = productName;
        productDetailsMap[productName].id = product.userData.id;
        productDetailsMap[productName].cubeQuantity = product.userData.cubesQuantity ?? 0;
        productDetailsMap[productName].connectorQuantity = product.userData.connectorQuantity ?? 0;
        productDetailsMap[productName].seatcussionQuantity = product.userData.seatcussionQuantity ?? 0;
      } else  {
        productDetailsMap[productName] = {
          id: product.userData.id,
          name: productName,
          quantity: signleQuantity / product.userData.cubesQuantity,
          varientId: varient ? varient.id : product.userData.id,
          cubeQuantity: product.userData.cubesQuantity ?? 0,
          connectorQuantity: product.userData.connectorQuantity ?? 0,
          seatcussionQuantity: product.userData.seatcussionQuantity ?? 0,
        };
      }
      productsToAddToCart.push({ ...productDetailsMap[productName] });
      console.log("productsToAddToCart: ", productsToAddToCart.length);
      
    }
  });
  console.log("productsToAddToCart: ", productsToAddToCart.length);
  console.groupEnd("cart:");
  if (productsToAddToCart.length > 0) {
    jQuery.ajax({
      type: "POST",
      dataType: "json",
      url: "/wp-admin/admin-ajax.php",
      data: {
        action: 'configurator_add_to_cart',
        products: productsToAddToCart,
      },
      success: function (response) {
        if (response.success) {
          window.location = '/cart/';
        } else {
          showAlert("alert-cart-error-1", 4000);
        }
      },
    });
  } else {
    jQuery("#requestOffer").prop("disabled", true);
  }
}

jQuery("#requestOffer").on('click', function () {
  // console.log( "Add to Cart", WP_CURRENT_USER_ROLE );
  if (WP_CURRENT_USER_ROLE === BUSINESS_CUSTOMER) {
    handleRequestOfferClick();
  } else {
    // console.log( "handleAddToCartClick: " );
    handleAddToCartClick();
  }
});


// function myFunction() {
//   compare(allCubes, selectedCube);
//   connectorCompare(selectedCube);
// }


// setInterval(myFunction, 1000);


createFloor();
animate();