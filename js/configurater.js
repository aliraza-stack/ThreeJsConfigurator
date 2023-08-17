var camera, controls, scene, renderer;

var plane = new THREE.Plane();
var raycaster = new THREE.Raycaster();
var clickMouse = new THREE.Vector2();
var mouseMove = new THREE.Vector2();
var axesHelper = new THREE.AxesHelper(5);

var width = window.innerWidth;
var height = window.innerHeight;

var draggable = null;
var Selected = null;

var isMoving = false;
var leftShiftPressed = false;

var intersects = [];
var allCubes = [];

var cube;

var previousMousePosition = { x: 0, y: 0 };
var mousePreviousPosition = { x: 0, y: 0, };
var pos = { x: 0, y: -1, z: 0 };
var scale = { x: 50, y: 2, z: 50 };

camera = new THREE.PerspectiveCamera(30, width / height, 1, 1000);
camera.position.set(0, 20, 70);
camera.lookAt(new THREE.Vector3(0, 0, 0));

renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", function () {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
});

// SCENE
scene = new THREE.Scene();
scene.add(axesHelper);
scene.background = new THREE.Color(0xdfdfdf);

// CAMERA CONTROLS
controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.maxPolarAngle = 0.9 * Math.PI / 2;
// controls.minPolarAngle = 0.7 * Math.PI / 2;
controls.minAzimuthAngle = -Math.PI / 2;
controls.maxAzimuthAngle = Math.PI / 2;
// controls.enableZoom = false;
// controls.enableRotate = flase;

// AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// DIRECTIONAL LIGHT
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 50, -20);
directionalLight.target.position.set(0, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2080;
directionalLight.shadow.mapSize.height = 2080;
directionalLight.shadow.camera.left = -70;
directionalLight.shadow.camera.right = 70;
directionalLight.shadow.camera.top = 70;
directionalLight.shadow.camera.bottom = -70;

// FLOOR PLANE
function createFloor() {
  let blockPlane = new THREE.Mesh(
    new THREE.BoxBufferGeometry(),
    new THREE.MeshPhongMaterial({ color: 0xdfdfdf, transparent: true, opacity: 0, })
  );
  blockPlane.position.set(pos.x, pos.y, pos.z);
  blockPlane.scale.set(scale.x, scale.y, scale.z);
  blockPlane.receiveShadow = true;
  scene.add(blockPlane);
}

// MODEL OUTLINE PASS
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera);
outlinePass.edgeStrength = 3;
outlinePass.edgeGlow = 1;
outlinePass.edgeThickness = 3;
outlinePass.pulsePeriod = 0;
outlinePass.usePatternTexture = false;
outlinePass.visibleEdgeColor = new THREE.Color(1, 0, 0);
outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0);
// outlinePass.visibleEdgeColor.set("#8B0000");
// outlinePass.hiddenEdgeColor.set("#000000");
composer.addPass(outlinePass);

// FXAA SHADER PASS
const effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
effectFXAA.renderToScreen = true;
composer.addPass(effectFXAA);

// CUBE LOADER
function cloneCube(cubex) {
  const cubexVariants = jQuery("#cubex-variants-" + cubex.id);
  const imageElement = cubexVariants.find("img")[0];
  let model_url = imageElement.alt;
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/wp-content/plugins/Configurater/libs/draco/");
  loader.setDRACOLoader(dracoLoader);
  const cubeModel = model_url;
  loader.load(cubeModel, (gltf) => {
    cube = gltf.scene;
    cube.scale.set(20, 20, 20);
    cube.rotation.set(0, -90, 0);
    cube.userData.draggable = true;
    cube.userData.type = cubex.title;
    scene.add(cube);
    allCubes.push(cube);
  });
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
  controls.enable = false;
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
  if (Selected) {
    scene.remove(Selected);
    Selected = null;
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
  let surfaceAttribute = WP_PRODUCTS[cubex.id].attributes["pa_cube-surface"] ?? [];
  let seatcussionAttribute = WP_PRODUCTS[cubex.id].attributes["pa_seatcushion-single"] ?? [];

  let connector_div = connectorAttribute.map((connector) => `<li data-slug="${connector.slug}" onclick="toggleActive(this)"><span style="background-color: ${connector.color}; cursor: pointer;"></span></li>`).join("");
  let surface_div = surfaceAttribute.map((surface) => `<li data-slug="${surface.slug}" onclick="toggleActive(this)"><span style="background-color: ${surface.color}; cursor: pointer;"></span></li>`).join("");
  let seatcussion_div = seatcussionAttribute.map((seatcussion) => `<li data-slug="${seatcussion.slug}" onclick="toggleActive(this)"><span style="background-color: ${seatcussion.color}; cursor: pointer;"></span></li>`).join("");

  let { OCubeProducts, UCubeProducts } = getSecondaryCubes();

  let o_menu_items = OCubeProducts.map((product) => `<a class="dropdown-item" data-product-id="${product.id}" data-name=${product.name} data-info='${JSON.stringify(product)}'">${product.name}</a>`).join("");
  let u_menu_items = UCubeProducts.map((product) => `<a class="dropdown-item" data-product-id="${product.id}" data-name=${product.name} data-info='${JSON.stringify(product)}'">${product.name}</a>`).join("");

  return { connectorAttribute, surfaceAttribute, seatcussionAttribute, connector_div, surface_div, seatcussion_div, u_menu_items, o_menu_items };
};

const cubex = {
  id: null,
  type: "",
  title: "",
  image: null,
  menu_items: [],
  connector_div: null,
  surface_div: null,
  seatcussion_div: null,
};

jQuery(".btn-switch-cube").click(function () {
  let { uCube, oCube } = getPrimaryCubes();

  if (jQuery(this).attr("id") === "uCube") {
    cubex.id = uCube.id;
    cubex.type = "uCube";
    cubex.menu_items = attributesAndMenus(cubex).u_menu_items;
  } else {
    cubex.id = oCube.id;
    cubex.type = "oCube";
    cubex.menu_items = attributesAndMenus(cubex).o_menu_items;
  }

  let { connector_div, surface_div, seatcussion_div } = attributesAndMenus(cubex);

  cubex.title = WP_PRODUCTS[cubex.id].name;
  cubex.image = WP_PRODUCTS[cubex.id].image;
  cubex.connector_div = connector_div;
  cubex.surface_div = surface_div;
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
  console.log(allSubCubes);

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
}

// ZOOM IN AND OUT CONTROLS
const zoomInFunction = (e) => {
  const fov = getFov();
  camera.fov = clickZoom(fov, "zoomIn");
  camera.updateProjectionMatrix();
};
jQuery("#zoomIn").on("click", zoomInFunction);

const zoomOutFunction = (e) => {
  const fov = getFov();
  camera.fov = clickZoom(fov, "zoomOut");
  camera.updateProjectionMatrix();
};
jQuery("#zoomOut").on("click", zoomOutFunction);

const handleRangeChange = (e) => {
  const fov = getFov();
  camera.fov = e.target.value;
  camera.updateProjectionMatrix();
};
jQuery('input[type="range"]').on("change", handleRangeChange);

jQuery("#zoomIn").on("click", () => {
  jQuery('input[type="range"]').val(clickZoom(getFov(), "zoomIn"));
});
jQuery("#zoomOut").on("click", () => {
  jQuery('input[type="range"]').val(clickZoom(getFov(), "zoomOut"));
});

const clickZoom = (value, zoomType) => {
  if (value >= 25 && zoomType === "zoomIn") {
    return value - 5;
  } else if (value <= 40 && zoomType === "zoomOut") {
    return value + 5;
  } else {
    return value;
  }
};
const getFov = () => {
  return Math.floor(
    (2 *
      Math.atan(camera.getFilmHeight() / 2 / camera.getFocalLength()) *
      180) /
    Math.PI
  );
};

// MODEL ROTATION
function onMouseDownRotation(event) {
  event.preventDefault();
  controls.enableRotate = true;
  // controls.enablePan = false;
}

// MODEL MOVEMENT
function onModelDown(event) {
  event.preventDefault();
  controls.enableRotate = false;
  isMoving = true;
  previousMousePosition = { x: (event.clientX / width) * 2 - 1, y: -(event.clientY / height) * 2 + 1, };
  raycaster.setFromCamera(previousMousePosition, camera);
  intersects = raycaster.intersectObjects(allCubes, true);

  if (intersects.length > 0) {
    let selectedObjects = [];
    selectedObjects.push(intersects[0].object.parent);
    Selected = intersects[0].object.parent;
    outlinePass.selectedObjects = [Selected];
  } else {
    Selected = null;
    outlinePass.selectedObjects = [];
  }
  renderer.domElement.style.cursor = "grabbing";
}

function onModelUp(event) {
  event.preventDefault();
  previousMousePosition = { x: 0, y: 0 };
  isMoving = false;
  renderer.domElement.style.cursor = "auto";
}

function onModelMove(event) {
  event.preventDefault();
  if (isMoving && Selected) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mousePosition = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    };
    const deltaMove = {
      x: mousePosition.x - previousMousePosition.x,
      y: mousePosition.y - previousMousePosition.y,
    };
    if (leftShiftPressed) {
      Selected.position.y = Math.min(13.2, Math.max(0, Selected.position.y + deltaMove.y * 25));
    } else {
      Selected.position.x = Math.min(22.5, Math.max(-22.5, Selected.position.x + deltaMove.x * 25));
      Selected.position.z = Math.min(22.5, Math.max(-22.5, Selected.position.z - deltaMove.y * 25));
    }
    previousMousePosition = mousePosition;
  } else {
    renderer.domElement.style.cursor = "auto";
  }
}


// SHIFT KEY DOWN AND UP EVENT FOR MOVING CUBE UP AND DOWN
window.addEventListener('keydown', (event) => {
  if (event.key === 'Shift') {
    leftShiftPressed = true;
  }
});
window.addEventListener('keyup', (event) => {
  if (event.key === 'Shift') {
    leftShiftPressed = false;
  }
});

// createFloor();
animate();
