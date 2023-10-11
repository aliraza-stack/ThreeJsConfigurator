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
var allSubCubes = [];
var cubeCounter = 0;
var clickedSlug = null;
var totalQuenty = 0;
var eachProductQuantity = {};
var busniess_cart_info = {};


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
outlinePass.edgeGlow = 0;
outlinePass.edgeThickness = 0.5;
outlinePass.pulsePeriod = 5;
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

  const numCubesToAdd = numbersOfCubes(cubex.id);

  function numbersOfCubes(id) {
    if (WP_PRODUCTS[id].cubes !== "") {
      return parseInt(WP_PRODUCTS[id].cubes);
    } else if (WP_PRODUCTS[id].connecters !== "") {
      return parseInt(WP_PRODUCTS[id].connecters);
    } else if (WP_PRODUCTS[id].seatcussions !== "") {
      return parseInt(WP_PRODUCTS[id].seatcussions);
    } else {
      return 0;
    }
  }

  for (let i = 0; i < numCubesToAdd; i++) {
    cubePromises.push(loadAndAddCube(loader, model_url, cubex, i));
  }

  Promise.all(cubePromises).then((cubes) => {
    cubes.forEach((cube, index) => {
      positionCube(cube, index, numCubesToAdd);
    });
  });
}

function loadAndAddCube(loader, model_url, cubex, index) {
  return new Promise((resolve) => {
    loader.load(model_url, (gltf) => {
      const cube = gltf.scene.clone();
      const products = WP_PRODUCTS[cubex.id];
      cube.userData.draggable = false;
      cube.name = cubex.title + "-" + (allCubes.length + 1);
      cube.userData.type = cubex.title;
      cube.userData.id = cubex.id;
      cube.userData.price = products.price;
      cube.userData.category = products.category ?? "";
      cube.userData.slug = clickedSlug;
      cube.userData.cubesQuantity = products.cubes === "" ? 0 : parseInt(products.cubes);
      cube.userData.connectorQuantity = products.connecters === "" ? 0 : parseInt(products.connecters);
      cube.userData.seatcussionQuantity = products.seatcussions === "" ? 0 : parseInt(products.seatcussions);
      allCubes.push(cube);
      allData("allCubes", allCubes);
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
  busniess_cart_info = {};
  // update the cube counter
  jQuery(".cube_counters").html(0);
}

// DELETE SELECTED CUBE
jQuery("#deleteCube").on("click", deleteSelectedCube);
function deleteSelectedCube() {
  for (let i = 0; i < allCubes.length; i++) {
    if (allCubes[i].children[0] === selectedCube) {
      scene.remove(allCubes[i]);
      allCubes.splice(i, 1);
      const slug = busniess_cart_info[selectedCube.parent.userData.slug];
      console.log(selectedCube);
      console.log(slug);
      console.log(busniess_cart_info);
      if (slug.cussionQuantity <= selectedCube.userData.cubesQuantity) {
        var seatcussionQuantity = slug.seatcussionQuantity - 1;
      }
      if (slug) {
        slug.cubesQuantity = slug.cubesQuantity - 1;
        slug.connectorQuantity = slug.connectorQuantity - 1;
        slug.cussionQuantity = seatcussionQuantity;
      }
    }
  }
  jQuery("#cube_counters_" + selectedCube.parent.userData.id).html(allCubes.filter((cube) => cube.userData.id === selectedCube.parent.userData.id).length);
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
    (product) => product.category == "O-Cube" && product.id !== oCube.id && product.name !== INLAY
  );
  let UCubeProducts = Object.values(WP_PRODUCTS).filter(
    (product) => product.category == "U-Cube" && product.id !== uCube.id && product.name !== INLAY
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

  let o_menu_items = OCubeProducts.map((product) => `<a class="dropdown-item" data-product-id="${product.id}" data-name=${product.name}>${product.name}</a>`).join("");
  let u_menu_items = UCubeProducts.map((product) => `<a class="dropdown-item" data-product-id="${product.id}" data-name=${product.name}>${product.name}</a>`).join("");

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

  jQuery("#Textures-" + cubex.id).click(function (e) {
    cloneCube(cubex);
    allData("cubex", cubex);
    clickedSlug = e.target.dataset.slug;
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

jQuery(document).on('click', ".sub-cube-images", function (e) {
  const productId = jQuery(e.target).data("product-id");
  const slug = jQuery(e.target).data("slug");
  allSubCubes.forEach((subProduct) => {
    if (subProduct.id === productId) {
      clickedSlug = slug;
      allData("sub-cube-slug", clickedSlug);
      cloneCube(subProduct);
    }
  })
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  composer.render();
  resizeWindow();
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
  if (selectedCube) {
    selectedCube.rotation.y -= Math.PI / 2;
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
}

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
    outlinePass.selectedObjects = [selected];
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

if (WP_CURRENT_USER_ROLE === BUSINESS_CUSTOMER) {
  jQuery("#requestOffer").html("Request an Offer");
} else {
  jQuery("#requestOffer").html("Add to Cart");
}

jQuery("#uCube").html(UCUBE);
jQuery("#oCube").html(OCUBE);

document.body.addEventListener('click', function (event) {
  if (event.target.tagName === 'IMG' && event.target.hasAttribute('data-product-id')) {
    const productId = event.target.getAttribute('data-product-id');
    const currentCount = parseInt(event.target.getAttribute('data-count')) || 0;
    event.target.setAttribute('data-count', currentCount + 1);
    let productQuantity = parseInt(event.target.getAttribute('data-count'));
    eachProductQuantity[productId] = productQuantity;
    totalQuenty = totalQuenty + 1;
  }
});



jQuery("#requestOffer").click(function () {
  if (WP_CURRENT_USER_ROLE === BUSINESS_CUSTOMER) {
    jQuery("#productDetailsTable").empty();
    var productDetailsMap = {};

    let productRow = '';

    allCubes.forEach((prd) => {
      let product = prd.userData;
      if (busniess_cart_info[product.slug] == undefined) {
        busniess_cart_info[product.slug] = product
      } else {
        const info = busniess_cart_info[product.slug];
        info.id = product.id;
        info.name = product.type;
        info.quantity = (info.cubesQuantity + product.cubesQuantity) / product.cubesQuantity;
        info.cubesQuantity = eachProductQuantity[product.id] * product.cubesQuantity;
        info.connectorQuantity = eachProductQuantity[product.id] * product.connectorQuantity;
        info.cussionQuantity = eachProductQuantity[product.id] * product.seatcussionQuantity;

      }
    });
    for (const key in busniess_cart_info) {
      let product = busniess_cart_info[key];
      productRow = `${productRow}<tr data-slug="${product.slug}">
            <td>${product.type}</td>
            <td class="productCubesQuantity">${product.cubesQuantity ?? 0}</td>
            <td class="productCubesQuantity">${product.connectorQuantity ?? 0}</td>
            <td class="productCubesQuantity">${product.cussionQuantity ?? 0}</td>
            <td class="productVarient">${product.slug}</td>
          </tr>`;
    }
    if (productRow != '') {
      jQuery("#productDetailsTable").html(productRow);

      jQuery("#productDetailsModal").modal("show");

      // Define a flag to track if a request is in progress
      let isRequestInProgress = false;
      // Define a function to handle the click event
      function sendRequest() {
        // Check if a request is already in progress
        if (isRequestInProgress) {
          return; // Do nothing if a request is already ongoing
        }

        // Set the flag to indicate that a request is now in progress
        isRequestInProgress = true;

        jQuery.ajax({
          url: '/wp-admin/admin-ajax.php',
          type: "POST",
          cache: false,
          data: {
            action: "send_request",
            products: busniess_cart_info,
          },
          success: function (response) {
            jQuery("#productDetailsModal").modal("hide");
            alert("Request sent successfully.");
          },
          error: function (error) {
            alert("Error sending request.");
          },
          complete: function () {
            // Reset the flag when the request is complete, whether successful or not
            isRequestInProgress = false;

            // Clear the list and hide the modal
            jQuery("#productDetailsTable").empty();

            // Unbind the click event after the first click
            jQuery("#sendRequestButton").off("click", sendRequest);
          }
        });
      }

      // Attach the click event handler
      jQuery("#sendRequestButton").on("click", sendRequest);

    } else {
      jQuery("#requestOffer").prop("disabled", true);
    }
  } else {
    var productsToAddToCart = [];
    var productDetailsMap = {};

    allCubes.forEach((product) => {
      const quantity = totalQuenty;
      if (quantity > 0) {
        const productName = product.userData.type;
        const price = product.userData.price ?? 0;
        const variants = WP_PRODUCTS[product.userData.id].variants;
        const varient_slug = product.userData.slug;
        const varient = variants.filter((varient) => varient.slug === varient_slug)[0];

        // Check if a product with the same name and variant ID exists in productDetailsMap
        if (productDetailsMap[productName] && productDetailsMap[productName].varientId === varient.id) {
          productDetailsMap[productName].quantity = eachProductQuantity[product.userData.id];
          productDetailsMap[productName].varientId = varient.id;
          productDetailsMap[productName].name = productName;
          productDetailsMap[productName].id = product.userData.id;
        } else {
          productDetailsMap[productName] = {
            id: product.userData.id,
            name: productName,
            quantity: eachProductQuantity[product.userData.id],
            varientId: varient.id,
          };
        }

        // Push the product details into productsToAddToCart
        productsToAddToCart.push({ ...productDetailsMap[productName] });
        window.productsToAddToCart = productsToAddToCart;

      }
    });
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
            alert("Error adding products to the cart.");
          }
        },
      });
    } else {
      jQuery("#requestOffer").prop("disabled", true);
    }
  }
});



// createFloor();
animate();
