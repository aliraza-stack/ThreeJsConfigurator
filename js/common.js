var CubeModel = {};

CubeModel.init = function (cubex) {
  CubeModel.init_cube(cubex);
};

CubeModel.init_cube = function (cubex) {
  document.getElementById("cubex").innerHTML = `
        <div>
            <div id="cubex-variants-${cubex.id}" class="d-flex">
                <div class="left-side">
                  <div class="title">${cubex.title} (<div id="cube_counters_${cubex.id}" class="cube_counters">0</div>)</div>
                  <div>
                    <img id="Textures-${cubex.id}" src='${cubex.image}' alt="${cubex.title}" data-model-url="${cubex.model_url}" data-slug="" class='cubeImage quantity-cubes'>
                  </div>
                </div>
                <div class="right-side">
                  <div class="selectors">
                      <div>Connectors</div>
                          <ul data-product-id="${cubex.id}">${cubex.connector_div}</ul>
                  </div>
                  <div class="selectors">
                      <div>Cube Surface</div>
                      <ul data-product-id="${cubex.id}">${cubex.title === OCUBE ? cubex.o_surface_div : cubex.u_surface_div}</ul>
                  </div>
                </div>
            </div>
            <div id="other-cubes"></div>
            <div class="dropdown add-more">
                <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src="https://cubx.cybernest.co/wp-content/uploads/2023/07/plus.png" />
                </a>

                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                ${cubex.menu_items}
                </div>
            </div>
        </div>
        `;
  selectFirstColors(cubex);
  CubeModel.init_dropdown(cubex);
};
CubeModel.init_dropdown = function (cubex) {
  jQuery(".dropdown-menu").click((e) => {
    let product = WP_PRODUCTS[e.target.dataset.productId];
    let attributes = product.attributes;

    let colorSelector = "";
    for (let key in attributes) {
      colorSelector += `<div class="selectors">
      <div>${getAttributeName(key)}</div>
      <ul data-product-id="${product.id}">`;
      for (let i = 0; i < attributes[key].length; i++) {
        colorSelector += `<li
        data-slug="${attributes[key][i].slug}"
        onclick="toggleActive(this)">
        <span style="background-color: ${attributes[key][i].color};
        cursor: pointer;">
        </span>
        </li>`;
      }
      colorSelector += `</ul></div>`;
    }

    const otherCubes = document.getElementById("other-cubes");
    otherCubes.innerHTML += `<div id="cubex-variants-${product.id}" class="d-flex mt-5">
            <div class="left-side">
                <div class="title">${product.name} (<div id="cube_counters_${product.id}" class="cube_counters">0</div>)</div>
                <div><img id="Sub-Textures-${product.id}" data-product-id="${product.id}" src="${product.image}"
                alt="${product.name}" data-model-url="${product.model_url}" data-slug="" class="cubeImage sub-cube-images quantity-cubes"></div>
            </div>
            <div class="right-side">
                ${colorSelector}
            </div>
        </div>`;

    selectFirstColors(product);
    removeDropdownItem(product);
  });


  function getAttributeName(key) {
    if (key === "pa_connecter-single" || key === "pa_connecter") {
      return "Connectors";
    } else if (key === "pa_seatcushion" || key === "pa_seatcushions-single") {
      return "Seat Cussions";
    } else if (key === "pa_cube-surface" || key === "pa_o-cube-surface") {
      return "Cube Surface";
    }
    return "";
  }
};

function selectFirstColors(product) {
  jQuery("#cubex-variants-" + product.id + " ul li:first-child").click();
}

function toggleActive(element) {
  const parentUl = jQuery(element).closest("ul");
  parentUl.children("li").removeClass("active");
  jQuery(element).addClass("active");
  updateVariantImage(parentUl.data("product-id"));
}

function updateVariantImage(productId) {
  const cubexVariants = document.getElementById("cubex-variants-" + productId);
  const variantUls = cubexVariants.querySelectorAll(
    "ul[data-product-id='" + productId + "']"
  );
  const selectedSlugs = [];
  let ulsWithoutSelection = 0;

  variantUls.forEach((ul) => {
    const activeLi = ul.querySelector("li.active");
    if (activeLi) {
      selectedSlugs.push(activeLi.dataset.slug);
    } else {
      ulsWithoutSelection++;
    }
  });

  if (variantUls.length === 2 && ulsWithoutSelection > 0) {
    return;
  }

  const product = WP_PRODUCTS[productId];
  let matchedVariant;
  if (variantUls.length === 2) {
    const slug1 = `${selectedSlugs[0]} - ${selectedSlugs[1]}`;
    const slug2 = `${selectedSlugs[1]} - ${selectedSlugs[0]}`;

    matchedVariant = product.variants.find(
      (variant) => variant.slug.includes(slug1) || variant.slug.includes(slug2)
    );
  } else {
    matchedVariant = product.variants.find((variant) =>
      selectedSlugs.every((slug) => variant.slug.includes(slug))
    );
  }

  const imageElement = cubexVariants.querySelector(".cubeImage");
  imageElement.src = matchedVariant ? matchedVariant.image : product.image;

  imageElement.dataset.modelUrl = matchedVariant ? matchedVariant.gltf_url : product.gltf_url;

  imageElement.dataset.slug = matchedVariant ? matchedVariant.slug : product.slug;
}


function removeDropdownItem(product) {
  const dropdownItem = document.querySelector(
    ".dropdown-menu [data-product-id='" + product.id + "']"
  );
  if (dropdownItem) {
    dropdownItem.remove();
  }
}



