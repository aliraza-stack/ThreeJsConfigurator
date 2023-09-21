var camera, controls, scene, renderer;

var plane = new THREE.Plane();
var raycaster = new THREE.Raycaster();
var clickMouse = new THREE.Vector2();
var mouseMove = new THREE.Vector2();
var axesHelper = new THREE.AxesHelper(5);

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

var cube;
// var GUI = new dat.GUI();


var cubePosition = { x: 0, y: 0, z: 0 };
var mousePreviousPosition = { x: 0, y: 0, };
var pos = { x: 0, y: -1, z: 0 };
var scale = { x: 50, y: 2, z: 50 };

camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
window.camera = camera;
camera.position.set(0, 3.5, 7.5);

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
pivot.add(camera);
scene.add(pivot);

camera.lookAt(pivot.position);

// CAMERA CONTROLS
controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
// controls.maxPolarAngle = 0.9 * Math.PI / 2;
// controls.minPolarAngle = 0.7 * Math.PI / 2;
controls.minAzimuthAngle = -Math.PI;
controls.maxAzimuthAngle = Math.PI;
controls.enableZoom = false;
// controls.enableRotate = flase;

// AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight("#ffe2a9", 2);
scene.add(ambientLight);

// // GUI FOLDER FOR AMBIENT LIGHT
// var ambientLightFolder = GUI.addFolder("Ambient Light");
// // ambientLight color
// ambientLightFolder.addColor(ambientLight, "color");
// // ambientLight intensity 0 to 10 at 0.01
// ambientLightFolder.add(ambientLight, "intensity", 0, 10, 0.01);
// // position of ambientLight
// ambientLightFolder.add(ambientLight.position, "x", -10, 10, 0.01);
// ambientLightFolder.add(ambientLight.position, "y", -10, 10, 0.01);
// ambientLightFolder.add(ambientLight.position, "z", -10, 10, 0.01);
// ambientLightFolder.open();

// HEMISPHERE LIGHT
window.hemisphereLight = new THREE.HemisphereLight();
// window.hemisphereLight.color = new Color(5.5, 6, 9); // 5, 8, 8
// window.hemisphereLight.groundColor = new Color(5.5, 6, 9);
window.hemisphereLight.position.set(0, 20, 0);
scene.add(window.hemisphereLight);

// GUI FOLDER FOR HEMISPHERE LIGHT
// const hamiSphareFolder = GUI.addFolder("Hemisphere Light");
// // hamisphare colors ground and color
// hamiSphareFolder.addColor(window.hemisphereLight, "groundColor");
// hamiSphareFolder.addColor(window.hemisphereLight, "color");
// // hamisphare intensity 0 to 10 at 0.01
// hamiSphareFolder.add(window.hemisphereLight, "intensity", 0, 10, 0.01);
// // position of hamisphare
// hamiSphareFolder.add(window.hemisphereLight.position, "x", -10, 10, 0.01);
// hamiSphareFolder.add(window.hemisphereLight.position, "y", -10, 10, 0.01);
// hamiSphareFolder.add(window.hemisphereLight.position, "z", -10, 10, 0.01);
// hamiSphareFolder.open();

// var hamiSphareFolder = GUI.addFolder("Hemisphere Light");
// // hamisphare colors ground and color
// hamiSphareFolder.addColor(window.hemisphereLight, "groundColor");
// hamiSphareFolder.addColor(window.hemisphereLight, "color");
// // hamisphare intensity 0 to 10 at 0.01
// hamiSphareFolder.add(window.hemisphereLight, "intensity", 0, 10, 0.01);
// hamiSphareFolder.open();

// const helper = new THREE.HemisphereLightHelper(hemisphereLight, 10);
// scene.add(helper);


// DIRECTIONAL LIGHT 1
var directionalLight1 = new THREE.DirectionalLight("#ffe4b9", 3);
directionalLight1.position.set(0.5, 0, 0.866);
scene.add(directionalLight1);

// // GUI FOLDER FOR DIRECTIONAL LIGHT 1
// var directionalLight1Folder = GUI.addFolder("Directional Light 1");
// // directionalLight1 color
// directionalLight1Folder.addColor(directionalLight1, "color");
// // directionalLight1 intensity 0 to 10 at 0.01
// directionalLight1Folder.add(directionalLight1, "intensity", 0, 10, 0.01);
// // position of directionalLight1
// directionalLight1Folder.add(directionalLight1.position, "x", -10, 10, 0.01);
// directionalLight1Folder.add(directionalLight1.position, "y", -10, 10, 0.01);
// directionalLight1Folder.add(directionalLight1.position, "z", -10, 10, 0.01);
// directionalLight1Folder.open();

// var helper1 = new THREE.DirectionalLightHelper(directionalLight1, 5);
// scene.add(helper1);
// directionalLight1.target.position.set(0, 0, 0);
// scene.add(directionalLight1.target);
// // directionalLight.castShadow = true;
// // directionalLight.shadow.mapSize.width = 2080;
// // directionalLight.shadow.mapSize.height = 2080;
// // directionalLight.shadow.camera.left = -70;
// // directionalLight.shadow.camera.right = 70;
// // directionalLight.shadow.camera.top = 70;
// // directionalLight.shadow.camera.bottom = -70;

// DIRECTIONAL LIGHT 2
// var directionalLight2 = new THREE.DirectionalLight("#ffe4b9", 3);
// directionalLight2.position.set(-0.5, 0, -0.866);
// scene.add(directionalLight2);
// var helper2 = new THREE.DirectionalLightHelper(directionalLight2, 5);
// scene.add(helper2);
// directionalLight2.target.position.set(0, 0, 0);
// console.log(directionalLight2.position);
// scene.add(directionalLight2.target);

// // DIRECTIONAL LIGHT 3
// var directionalLight3 = new THREE.DirectionalLight(0xffffff, 2);
// var helper3 = new THREE.DirectionalLightHelper(directionalLight3, 5);
// scene.add(helper3);
// directionalLight3.position.set(30, 30, -30);
// directionalLight3.target.position.set(0, 0, 0);
// console.log(directionalLight3.position);
// scene.add(directionalLight3);
// scene.add(directionalLight3.target);

// // DIRECTIONAL LIGHT 4
// var directionalLight4 = new THREE.DirectionalLight(0xffffff, 2);
// var helper4 = new THREE.DirectionalLightHelper(directionalLight4, 5);
// scene.add(helper4);
// directionalLight4.position.set(-30, 30, -30);
// directionalLight4.target.position.set(0, 0, 0);
// console.log(directionalLight4.position);
// scene.add(directionalLight4);
// scene.add(directionalLight4.target);

// FLOOR PLANE
// function createFloor() {
//   let blockPlane = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(),
//     new THREE.MeshPhongMaterial({ color: 0xdfdfdf, transparent: true, opacity: 0, })
//   );
//   blockPlane.position.set(pos.x, pos.y, pos.z);
//   blockPlane.scale.set(scale.x, scale.y, scale.z);
//   blockPlane.receiveShadow = true;
//   scene.add(blockPlane);
// }

// MODEL OUTLINE PASS
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const pixelRatio = renderer.getPixelRatio();
const outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera);
outlinePass.edgeStrength = 10;
outlinePass.edgeGlow = 0;
outlinePass.edgeThickness = 0.5;
outlinePass.pulsePeriod = 5;
outlinePass.usePatternTexture = false;
outlinePass.resolutionX = 512 * 3;
outlinePass.resolutionY = 512 * 3;
outlinePass.visibleEdgeColor = new THREE.Color(0, 65, 255); // Red: 0, Green: 65, Blue: 255
outlinePass.hiddenEdgeColor = new THREE.Color(0, 26, 255);  // Red: 0, Green: 26, Blue: 255
composer.addPass(outlinePass);
// // GUI FOLDER FOR OUTLINE PASS
// var outlinePassFolder = GUI.addFolder("Outline Pass");
// outlinePassFolder.add(outlinePass, "edgeStrength", 0, 10, 0.1);
// outlinePassFolder.add(outlinePass, "edgeGlow", 0, 10, 0.1);
// outlinePassFolder.add(outlinePass, "edgeThickness", 0, 10, 0.1);
// outlinePassFolder.add(outlinePass, "pulsePeriod", 0, 5, 0.1);
// // color for visible and hidden edges of the outline
// outlinePassFolder.addColor(outlinePass, "visibleEdgeColor");
// outlinePassFolder.addColor(outlinePass, "hiddenEdgeColor");

// outlinePassFolder.open()

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
  console.log("There was an error loading model : ", url);
  hideAlert();
};

function hideAlert() {
  const alertElement = document.getElementById('danger-alert');
  alertElement.style.display = 'flex';
  setTimeout(() => {
    alertElement.style.display = 'none';
  }, 4000);
}

// CUBE LOADER
function cloneCube(cubex) {
  const cubexVariants = jQuery("#cubex-variants-" + cubex.id);
  const imageElement = cubexVariants.find("img")[0];
  let model_url = imageElement.dataset.modelUrl;
  const loader = new GLTFLoader(loading);
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(WP_DRECO_PATH);
  dracoLoader.setDecoderConfig({ type: 'js' });
  dracoLoader.preload();
  loader.setDRACOLoader(dracoLoader);

  const cubePromises = [];

  const numCubesToAdd = cubex.id === WP_PRODUCTS[cubex.id].id ? WP_PRODUCTS[cubex.id].cubes : 1;


  for (let i = 0; i < numCubesToAdd; i++) {
    cubePromises.push(loadAndAddCube(loader, model_url, cubex, i));
  }

  Promise.all(cubePromises).then((cubes) => {
    cubes.forEach((cube, index) => {
      positionCube(cube, index, numCubesToAdd);
    });
  });

  // loader.load(cubeModel, (gltf) => {
  //   cube = gltf.scene.clone();
  //   cube.userData.draggable = false;
  //   cube.name = cubex.title + "-" + (allCubes.length + 1);
  //   cube.userData.type = cubex.title;
  //   cube.userData.position = cubePosition;
  //   allCubes.push(cube);
  //   window.cube = allCubes;
  //   scene.add(cube);
  //   for (let i = 0; i < allCubes.length; i++) {
  //     if (allCubes.length > 0 && allCubes[i].userData.type === OCUBE || allCubes[i].userData.type === UCUBE) {
  //       const lastCube = allCubes[allCubes.length - 1];
  //       if (lastCube.position.x % 3 === 0) {
  //         cube.position.x = lastCube.position.x - 2;
  //         cube.position.z = lastCube.position.z - 1;
  //       } else {
  //         cube.position.x = lastCube.position.x + 1;
  //         cube.position.z = lastCube.position.z;
  //       }
  //     } else {
  //       cube.position.set(0, 0, 0);
  //     }
  //   }
  //   dracoLoader.dispose();
  // });
}

function loadAndAddCube(loader, model_url, cubex, index) {
  return new Promise((resolve) => {
    loader.load(model_url, (gltf) => {
      const cube = gltf.scene.clone();
      cube.userData.draggable = false;
      cube.name = cubex.title + "-" + (allCubes.length + 1);
      cube.userData.type = cubex.title;
      cube.userData.id = cubex.id;
      cube.userData.position = cubePosition;
      allCubes.push(cube);
      jQuery("#cube_counters_" + cubex.id).html(allCubes.filter((cube) => cube.userData.id === cubex.id).length);
      scene.add(cube);
      resolve(cube);
    });
  });
}

function positionCube(cube, index, numCubesToAdd) {
  const spacingX = -1;
  const spacingZ = -1;
  if (numCubesToAdd > 1) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    cube.position.x = col * spacingX;
    cube.position.z = row * spacingZ;
  } else {
    index = allCubes.length - 1;
    const row = Math.floor(index / 3);
    const col = index % 3;
    cube.position.x = col * spacingX;
    cube.position.z = row * spacingZ;
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
  renderer.domElement.addEventListener("pointerdown", onModelDown, false);
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
}

// DELETE SELECTED CUBE
jQuery("#deleteCube").on("click", deleteSelectedCube);
function deleteSelectedCube() {
  console.log('selectedCube', selectedCube);
  console.log('allCubes', allCubes);
  for (let i = 0; i < allCubes.length; i++) {
    if (allCubes[i].children[0] === selectedCube) {
      scene.remove(allCubes[i]);
      allCubes.splice(i, 1);
    }
  }
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
  let { uCube, oCube } = getPrimaryCubes();
  let OCubeProducts = Object.values(WP_PRODUCTS).filter(
    (product) => product.category == "O-Cube" && product.id !== oCube.id
  );
  let UCubeProducts = Object.values(WP_PRODUCTS).filter(
    (product) => product.category == "U-Cube" && product.id !== uCube.id
  );
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

  let o_menu_items = OCubeProducts.map((product) => `<a class="dropdown-item" data-product-id="${product.id}" data-name=${product.name} data-info='${JSON.stringify(product)}'">${product.name}</a>`).join("");
  let u_menu_items = UCubeProducts.map((product) => `<a class="dropdown-item" data-product-id="${product.id}" data-name=${product.name} data-info='${JSON.stringify(product)}'">${product.name}</a>`).join("");

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

  switchCubeModel(cubex);
});

jQuery("#uCube").click();

function switchCubeModel(cubex) {
  jQuery("#uCube").toggleClass("active");
  jQuery("#oCube").toggleClass("active");

  CubeModel.init(cubex);

  jQuery("#Textures-" + cubex.id).click(function () {
    cloneCube(cubex);
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

  const allSubCubes = [...oCubeModel, ...uCubeModel];

  jQuery(document).on('click', ".sub-cube-images", function (e) {
    let productId = jQuery(e.target).data("product-id");
    allSubCubes.forEach((subProduct) => {
      if (subProduct.id === productId) {
        cloneCube(subProduct);
      }
    })
  });
  deleteAllCubes();
}


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  composer.render();
  resizeWindow();
}

function resizeWindow() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

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
  console.log('rangeFov range', rangeFov)
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
}

// window.addEventListener("mousemove", function (event) {
//   event.preventDefault();
//   mouseMove.x = (event.clientX / width) * 2 - 1;
//   mouseMove.y = -(event.clientY / height) * 2 + 1;
//   raycaster.setFromCamera(mouseMove, camera);
//   intersects = raycaster.intersectObjects(allCubes, true);
//   if (intersects.length > 0) {
//     document.body.style.cursor = "pointer";
//     outlinePass.selectedObjects = [intersects[0].object.parent];
//   } else if (selected === null) {
//     document.body.style.cursor = "auto";
//     outlinePass.selectedObjects = [];
//   }
// });

function onModelMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  if (Dragged) {
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      Dragged.position.copy(intersection.sub(offset));
    }
    return;
  }
  intersects = raycaster.intersectObjects(allCubes, true);
  if (intersects.length > 0) {
    if (selected != intersects[0].object.parent) {
      selected = intersects[0].object.parent;
      plane.setFromNormalAndCoplanarPoint(
        camera.getWorldDirection(plane.normal),
        selected.position
      );
    }
    outlinePass.selectedObjects = [selected];
    document.body.style.cursor = "pointer";
  } else {
    selected = null;
    document.body.style.cursor = "auto";
  }

}

function onModelDown(event) {
  event.preventDefault();
  if (selected) {
    selected.parent.userData.draggable = true;
    controls.enabled = false;
    Dragged = selected;
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      offset.copy(intersection).sub(Dragged.position);
    }
    selectedCube = selected;
    selectedObjects.push(intersects[0].object.parent);
    outlinePass.selectedObjects = [intersects[0].object.parent];
    document.body.style.cursor = "move";
  } else {
    outlinePass.selectedObjects = [];
  }
}

function onModelUp(event) {
  event.preventDefault();
  controls.enabled = true;
  if (selected) {
    selected.position.x = Math.round(selected.position.x);
    selected.position.y = (Math.round(selected.position.y)) / 1.05;
    selected.position.z = Math.round(selected.position.z);
    // if (selected.parent.userData.type === UCUBE || selected.parent.userData.type === OCUBE) {
    //   selected.position.x = Math.round(selected.position.x);
    //   selected.position.y = (Math.round(selected.position.y)) / 1.05;
    //   selected.position.z = Math.round(selected.position.z);
    // }
  }


  if (Dragged) {
    Dragged = null;
    selected.parent.userData.draggable = false;
  }
  document.body.style.cursor = "auto";
}

// createFloor();
animate();
