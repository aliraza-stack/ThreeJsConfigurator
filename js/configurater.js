var camera, controls, scene, renderer;

var plane = new THREE.Plane();
var raycaster = new THREE.Raycaster();
var clickMouse = new THREE.Vector2();
var mouseMove = new THREE.Vector2();
var axesHelper = new THREE.AxesHelper(5);

var mouse = new THREE.Vector2();
var pNormal = new THREE.Vector3(0, 1, 0); // plane's normal
var planeIntersect = new THREE.Vector3(); // point of intersection with the plane
var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
var isDragging = false;
var dragObject;
var offset = new THREE.Vector3();
var intersection = new THREE.Vector3();
var Dragged;
var selectedCube = null;

var width = innerWidth;
var height = innerHeight;

var draggable = null;
var Selected = null;

var isMoving = false;
var leftShiftPressed = false;
var controlPressed = false;

var intersects = [];
var allCubes = [];

var cube;

var cubePosition = { x: 0, y: 0, z: 0 };
var mousePreviousPosition = { x: 0, y: 0, };
var pos = { x: 0, y: -1, z: 0 };
var scale = { x: 50, y: 2, z: 50 };

camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
camera.position.set(0, 3, 5);


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
// controls.enableZoom = false;
// controls.enableRotate = flase;

// AMBIENT LIGHT
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// HEMISPHERE LIGHT
window.hemisphereLight = new THREE.HemisphereLight();
window.hemisphereLight.intensity = 0.5;
window.hemisphereLight.color = new Color(3, 6, 6);
window.hemisphereLight.groundColor = new Color(3, 6, 6);
window.hemisphereLight.position.set(0, 20, 0);
scene.add(window.hemisphereLight);

const helper = new THREE.HemisphereLightHelper(hemisphereLight, 10);
scene.add(helper);


// DIRECTIONAL LIGHT 1
// var directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
// var helper1 = new THREE.DirectionalLightHelper(directionalLight1, 5);
// scene.add(helper1);
// directionalLight1.position.set(30, 30, 30);
// directionalLight1.target.position.set(0, 0, 0);
// console.log(directionalLight1.position);
// scene.add(directionalLight1);
// scene.add(directionalLight1.target);
// // directionalLight.castShadow = true;
// // directionalLight.shadow.mapSize.width = 2080;
// // directionalLight.shadow.mapSize.height = 2080;
// // directionalLight.shadow.camera.left = -70;
// // directionalLight.shadow.camera.right = 70;
// // directionalLight.shadow.camera.top = 70;
// // directionalLight.shadow.camera.bottom = -70;

// // DIRECTIONAL LIGHT 2
// var directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
// var helper2 = new THREE.DirectionalLightHelper(directionalLight2, 5);
// scene.add(helper2);
// directionalLight2.position.set(-30, 30, 30);
// directionalLight2.target.position.set(0, 0, 0);
// console.log(directionalLight2.position);
// scene.add(directionalLight2);
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
outlinePass.edgeStrength = 6;
outlinePass.edgeGlow = 0;
outlinePass.edgeThickness = 3;
outlinePass.pulsePeriod = 0;
outlinePass.usePatternTexture = false;
outlinePass.visibleEdgeColor.set("#279EFF");
outlinePass.hiddenEdgeColor.set("#0C356A");
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
    cube.userData.draggable = true;
    cube.userData.type = cubex.title;
    cube.userData.position = cubePosition;
    allCubes.push(cube);
    scene.add(cube);
    console.log('allCubes', allCubes);
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
  console.log('Selected', selectedCube);
  console.log('allCubes', allCubes);
  for (let i = 0; i < allCubes.length; i++) {
    if (allCubes[i].children[0] === selectedCube.parent) {
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
}

// MODEL MOVEMENT
// function onModelDown(event) {
//   event.preventDefault();
//   intersects = raycaster.intersectObjects(allCubes, true);
//   if (intersects.length > 0) {
//     controls.enabled = false;
//     pIntersect.copy(intersects[0].point);
//     plane.setFromNormalAndCoplanarPoint(pNormal, pIntersect);
//     shift.subVectors(intersects[0].object.parent.position, intersects[0].point);
//     Selected = intersects[0];
//     isDragging = true;
//     dragObject = intersects[0].object.parent;
//     let selectedObjects = [];
//     selectedObjects.push(intersects[0].object.parent);
//     outlinePass.selectedObjects = [dragObject];
//   } else {
//     outlinePass.selectedObjects = [];
//   }
//   renderer.domElement.style.cursor = "grabbing";
// }

// function onModelUp(event) {
//   event.preventDefault();
//   isMoving = false;
//   renderer.domElement.style.cursor = "auto";
//   isDragging = false;
// }

// function onModelMove(event) {
//   event.preventDefault();

//   mouse.x = (event.clientX / width) * 2 - 1;
//   mouse.y = - (event.clientY / height) * 2 + 1;
//   raycaster.setFromCamera(mouse, camera);

//   if (isDragging && !leftShiftPressed) {
//     raycaster.ray.intersectPlane(plane, planeIntersect);
//     dragObject.position.addVectors(planeIntersect, shift);
//     intersects = raycaster.intersectObjects(allCubes, true);
//     if (intersects.length > 0) {
//       if (dragObject != intersects[0].object.parent) {
//         dragObject = intersects[0].object.parent;
//         plane.setFromNormalAndCoplanarPoint(
//           camera.getWorldDirection(plane.normal),
//           dragObject.position);
//       }
//     }
//   } else if (leftShiftPressed && isMoving && !isDragging) {
//     intersects = raycaster.intersectObjects(allCubes, true);
//     if (intersects.length > 0) {
//       let cube = intersects[0].object.parent;
//       cube.position.y -= event.movementY / 100;
//       if (cube.position.y < 0) {
//         cube.position.y = 0;
//       } else if (cube.position.y > 1) {
//         cube.position.y = 1;
//       }
//     }
//   }

// }

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
    if (Selected != intersects[0].object.parent) {
      Selected = intersects[0].object.parent;
      plane.setFromNormalAndCoplanarPoint(
        camera.getWorldDirection(plane.normal),
        Selected.position
      );
    }
    document.body.style.cursor = "pointer";
  } else {
    Selected = null;
    document.body.style.cursor = "auto";
  }

}

function onModelDown(event) {
  event.preventDefault();
  if (Selected) {
    controls.enabled = false;
    Dragged = Selected;
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      offset.copy(intersection).sub(Dragged.position);
    }
    let selectedObjects = [];
    selectedCube = Selected;
    selectedObjects.push(intersects[0].object.parent);
    outlinePass.selectedObjects = [Selected];
    document.body.style.cursor = "move";
  } else {
    outlinePass.selectedObjects = [];
  }
}

function onModelUp(event) {
  event.preventDefault();
  controls.enabled = true;
  if (Selected) {
    Selected.position.x = (Math.round(Selected.position.x)) / 2.5;
    Selected.position.y = (Math.round(Selected.position.y)) / 2.5;
    Selected.position.z = (Math.round(Selected.position.z)) / 2.5;
  }
  if (Dragged) {
    Dragged = null;
  }
  document.body.style.cursor = "auto";
}

// SHIFT KEY DOWN AND UP EVENT FOR MOVING CUBE UP AND DOWN
window.addEventListener('keydown', (event) => {
  if (event.key === 'Shift') {
    leftShiftPressed = true;
    isMoving = true;
    isDragging = false;
  }
});
window.addEventListener('keyup', (event) => {
  if (event.key === 'Shift') {
    leftShiftPressed = false;
    isMoving = false;
    isDragging = true;
  }
});


// createFloor();
animate();
