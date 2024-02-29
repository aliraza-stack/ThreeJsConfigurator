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
                    <span class="cubeX__tooltiptext">Click to Add</span>
                    <div class="">
                        <div class="image-container">
                            <img id="Textures-${cubex.id}" src='${cubex.image}' alt="${cubex.title}" data-model-url="${cubex.model_url}" data-product-id="${cubex.id}" data-slug="" data-count="0" class='cubeImage'>
                            <div class="loading-spinner">
                                <i class="fa fa-spinner fs-2 text-dark animatio_spin" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                    <div class="cubeX__tooltip">
                      <img id="Textures-tooltip-${cubex.id}" data-product-id="${cubex.id}" src="https://d6734qda5szbb.cloudfront.net/wp-content/uploads/2023/10/add-to-cart.png" />
                      </div>
                  </div>
                <div class="right-side">
                  <div class="selectors">
                      <div>1 x connectors</div>
                          <ul data-product-id="${cubex.id}">${cubex.connector_div}</ul>
                  </div>
                  <div class="selectors">
                      <div>1 x ${cubex.title === OCUBE ? 'o-' : 'u-'}cube</div>
                      <ul data-product-id="${cubex.id}">${cubex.title === OCUBE ? cubex.o_surface_div : cubex.u_surface_div}</ul>
                  </div>
                </div>
            </div>
            <div id="other-cubes"></div>

        </div>
        `;
  selectFirstColors(cubex);
  CubeModel.init_dropdown(cubex);
  document.getElementById("Textures-" + cubex.id).setAttribute("onload", "hideLoadingSpinner(this)");

};
CubeModel.init_dropdown = function (cubex) {
  
  cubex.menu_items.forEach((item) => {
    const product = WP_PRODUCTS[item.id];
    let attributes = product.attributes;
    setCounters(product);

    let colorSelector = "";
    for (let key in attributes) {
      if (key === "pa_set_seatcushion") {
        continue;
      }
      colorSelector += `<div class="selectors">
          <div>${product.connecters} ${getAttributeName(key)}</div>
          <ul data-product-id="${product.id}" class="${product.tag + " " + key}">`;
      for (let i = 0; i < attributes[key].length; i++) {
        colorSelector += `<li
            data-slug="${product.tag === PTAG ? jQuery("#uCube").hasClass("active") ? attributes[key][i].slug + ' - ' + attributes[key][i].slug : 'black - ' + attributes[key][i].slug : attributes[key][i].slug}"
            data-name="${product.name.slice(-1)}"
            onclick="toggleActive(this)">
            <span style="background-color: ${attributes[key][i].color};
            cursor: pointer;" ></span>
            </li>`;
      }
      colorSelector += `</ul></div>`;
    }

    let colorSelector2 = `<div class="selectors"><div class="uCube_count_${item.id}"> x u-cube</div><ul data-product-id=""><li data-slug="vanilla" class=""><span style="background-color: #d8bea7; cursor: pointer;"></span></li></ul></div>`;

    let colorSelector3 = `<div class="selectors"><div class="oCube_count_${item.id}"> x o-cube</div><ul data-product-id=""><li data-slug="black" class=""><span style="background-color: #141414; cursor: pointer;"></span></li></ul></div>`;

    

    // ${product.tag === PTAG ? '0' : ''}
    // class="config__counter set-id-${product.id}"

    const otherCubes = document.getElementById("other-cubes");
    otherCubes.innerHTML += `<div id="cubex-variants-${product.id}" class="d-flex mt-5">
                <div class="left-side sub__tooltip">
                    <div class="title">${product.name} (<div id="cube_counters_${product.id}" class="cube_counters">0</div>)</div>
                    <span class="cubeX__tooltiptext">Click to Add</span>
                      <div class="">
                        <div class="image-container">
                            <img id="Sub-Textures-${product.id}" data-product-id="${product.id}" src="${product.image}" alt="${product.name}" data-model-url="${product.model_url}" data-slug="" data-count="0" class="sub-cube-images cubeImage">
                            <div class="loading-spinner">
                                <i class="fa fa-spinner fs-2 text-dark animatio_spin" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div class="cubeX__tooltip" >
                          <img class="Sub-Textures-tooltip" data-product-id="${product.id}" src="https://d6734qda5szbb.cloudfront.net/wp-content/uploads/2023/10/add-to-cart.png" />
                          </div>
                      </div>
                </div>
                <div class="right-side">
                    ${colorSelector}
                    
                      ${jQuery("#uCube").hasClass("active") ? product.tag === PTAG ? colorSelector2 : '' : product.tag === PTAG ? colorSelector3 : ''}
                    
                </div>
            </div>`;

    selectFirstColors(product);
    setCounters(product);

    document.getElementById("Sub-Textures-" + product.id).setAttribute("onload", "hideLoadingSpinner(this)");

    function getAttributeName(key) {
      if (key === "pa_connecter-single" || key === "pa_set_connecters") {
        return "x connecters";
      } else if (key === "pa_seatcushions-single" || key === "pa_set_seatcushion") {
        return "1 x seatcushion";
      } else if (key === "pa_cube-surface" || key === "pa_o-cube-surface") {
        return " x cube";
      }
      return "";
    }
  });
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
  imageElement.dataset.modelUrl2 = matchedVariant ? matchedVariant.gltf_url_2 : product.gltf_url_2;
  imageElement.dataset.slug = matchedVariant ? matchedVariant.slug : product.slug;




  // Get the image and loading spinner elements
  const image = document.getElementById(`Textures-${productId}`);
  const image2 = document.getElementById(`Sub-Textures-${productId}`);
  var loadingSpinner;
  if (image) {
    image.src = imageElement.src;
    loadingSpinner = image.nextElementSibling;
  } else {
    image2.src = imageElement.src;
    loadingSpinner = image2.nextElementSibling;
  }

  loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner(image) {
  const loadingSpinner = image.nextElementSibling;
  if (loadingSpinner) {
    loadingSpinner.style.display = 'none';
  }
}

function setCounters(product) {
  if (product.category == UCUBE || product.category == "U-Wuerfel") {
    jQuery(".uCube_count_" + product.id).text(product.connecters + " x u-cube");
  } else if (product.category == OCUBE || product.category == "O-Wuerfel") {
    jQuery(".oCube_count_" + product.id).text(product.connecters + " x o-cube");
  } else {
    jQuery(".uCube_count_" + product.id).text("1 x u-cube");
    jQuery(".oCube_count_" + product.id).text("1 x o-cube");
  }
}

// const c = jQuery(".image-container");
// const isLeftIcon = true;

// if (c) {
//   c.addEventListener('click', () => {
//       if (divA.style.right === '' || divA.style.right === '-70%') {
//           divA.style.right = '0';
//       } else {
//           divA.style.right = '-70%';
//       }
//       if (isLeftIcon) {
//           openerBtn.innerHTML = "<i class='fas fa-caret-right'></i>";
//           jQuery('.left-toolbar-box').hide();
//           jQuery(".rotate-btn").hide();
//       } else {
//           openerBtn.innerHTML = "<i class='fas fa-caret-left'></i>";
//           jQuery('.left-toolbar-box').show();
//           jQuery(".rotate-btn").show();
//       }
//       isLeftIcon = !isLeftIcon;
//   });
// }

// function setsCounter(product) {
//   jQuery(".Sets.pa_set_seatcushion").each(function () {
//     jQuery(this).find("li").each(function () {
//       var slug = jQuery(this).data("slug");
//       var name = jQuery(this).data("name");
//       var span = jQuery(this).find("span");
//       if (product.category == UCUBE || product.category == "U-Wuerfel") {
//         span.addClass("config__counter fw-bolder set-id-" + product.id);
//         span.text(ALL_DATA.UCUBESETS[slug][name]['seatcushion']);
//       } else {
//         span.addClass("config__counter text-white fw-bolder set-id-" + product.id);
//         span.text(ALL_DATA.OCUBESETS['slug'][name]['seatcushion']);
//       }
//     });
//   })
//   jQuery(".Sets.pa_set_connecters").each(function () {
//     jQuery(this).find("li").each(function () {
//       var slug = jQuery(this).data("slug");
//       var name = jQuery(this).data("name");
//       var span = jQuery(this).find("span");
//       if (product.category == UCUBE || product.category == "U-Wuerfel") {
//         span.addClass("config__counter fw-bolder set-id-" + product.id);
//         span.text(ALL_DATA.UCUBESETS[slug][name]['connecter']);
//       } else {
//         span.addClass("config__counter text-white fw-bolder set-id-" + product.id);
//         span.text(ALL_DATA.OCUBESETS['slug'][name]['connecter']);
//       }
//     });
//   })
// }



// var counter_arrays = {};

// jQuery(document).ready(function () {
//   var sets = jQuery(".Sets.pa_set_connecters");

//   sets.each(function () {
//     var product = WP_PRODUCTS[jQuery(this).data("product-id")];
//     jQuery(this).find("li").each(function () {
//       var span = jQuery(this).find("span");
//       span.addClass("config__counter set-id-" + product.id);
//       span.text("0");
//     });

//     // add a minus button to each li inside ul with class "Sets" and "pa_set_connecters"
//     var minusButton = jQuery("<span class='minus-button' data-product-id='" + product.id + "'><i class='fa fa-minus' aria-hidden='true'></i></span>");
//     minusButton.addClass("set-minus-" + product.id);
//     minusButton.css({
//       margin: "10px 0px 0px 10px",
//       fontSize: "20px",
//       opacity: 0.5,
//       cursor: "not-allowed",
//       width: "auto",
//     });

//     // add a plus button to each li inside ul with class "Sets" and "pa_set_connecters"
//     var plusButton = jQuery("<span class='plus-button' data-product-id='" + product.id + "'><i class='fa fa-plus' aria-hidden='true'></i></span>");
//     plusButton.addClass("set-plus-" + product.id);
//     plusButton.css({
//       margin: "10px 0px 0px 10px",
//       fontSize: "20px",
//       cursor: "pointer",
//       width: "auto",
//     });

//     // append the minus and plus button to the ul with class "Sets" and "pa_set_connecters"
//     jQuery(this).append(
//       minusButton,
//       plusButton
//     );

//     plusButton.click(function (e) {
//       e.preventDefault();
//       var counterId = jQuery(this).data("product-id");
//       var counters = jQuery(".Sets.pa_set_connecters li .config__counter.set-id-" + counterId);
//       var url = jQuery("")
//       const maxCount = product.connecters;
//       var activeCounter = jQuery(".Sets.pa_set_connecters li.active .config__counter.set-id-" + counterId);
//       var count = parseInt(activeCounter.text()) + 1;

//       var sumCounters = 0;
//       counters.each(function () {
//         sumCounters += parseInt(jQuery(this).text());
//       });

//       var remaningCount = maxCount - sumCounters;

//       if (remaningCount > 0) {
//         activeCounter.text(count);
//         setConfiguratorEng(counterId, 'connecters', jQuery('.Sets.pa_set_connecters li.active').data('slug'), count, maxCount);
//       }

//       if (remaningCount == 1) {
//         jQuery(".Sets.pa_set_connecters .plus-button.set-plus-" + product.id).css({
//           opacity: 0.5,
//           cursor: "not-allowed",
//         });
//       }

//       if (remaningCount <= (maxCount + 1)) {
//         jQuery(".Sets.pa_set_connecters .minus-button.set-minus-" + product.id).css({
//           opacity: 1,
//           cursor: "pointer",
//         });
//       }

//     });

//     minusButton.click(function (e) {
//       e.preventDefault();
//       var counterId = jQuery(this).data("product-id");
//       var counters = jQuery(".Sets.pa_set_connecters li .config__counter.set-id-" + counterId);
//       const maxCount = product.connecters;

//       var activeCounter = jQuery(".Sets.pa_set_connecters li.active .config__counter.set-id-" + product.id);
//       var count = parseInt(activeCounter.text()) - 1;
//       if (count >= 0) {
//         activeCounter.text(count);
//         setConfiguratorEng(counterId, 'connecters', jQuery('.Sets.pa_set_connecters li.active').data('slug'), count, maxCount);
//       }

//       var sumCounters = 0;
//       counters.each(function () {
//         sumCounters += parseInt(jQuery(this).text());
//       }
//       );

//       var remaningCount = maxCount - sumCounters;

//       if (remaningCount > 0) {
//         jQuery(".Sets.pa_set_connecters .plus-button.set-plus-" + product.id).css({
//           opacity: 1,
//           cursor: "pointer",
//         });
//       }
//       if (remaningCount == maxCount) {
//         jQuery(".Sets.pa_set_connecters .minus-button.set-minus-" + product.id).css({
//           opacity: 0.5,
//           cursor: "not-allowed",
//         });
//       }
//     });

//   });
// });


// jQuery(document).ready(function () {
//   var sets = jQuery(".Sets.pa_set_seatcushion");

//   sets.each(function () {
//     var product = WP_PRODUCTS[jQuery(this).data("product-id")];
//     jQuery(this).find("li").each(function () {
//       var span = jQuery(this).find("span");
//       span.addClass("config__counter set-id-" + product.id);
//       span.text("0");
//     });

//     // add a minus button to each li inside ul with class "Sets" and "pa_set_seatcushion"
//     var minusButton = jQuery("<span class='minus-button' data-product-id='" + product.id + "'><i class='fa fa-minus' aria-hidden='true'></i></span>");
//     minusButton.addClass("set-minus-" + product.id);
//     minusButton.css({
//       margin: "10px 0px 0px 10px",
//       fontSize: "20px",
//       opacity: 0.5,
//       cursor: "not-allowed",
//       width: "auto",
//     });

//     // add a plus button to each li inside ul with class "Sets" and "pa_set_seatcushion"
//     var plusButton = jQuery("<span class='plus-button' data-product-id='" + product.id + "'><i class='fa fa-plus' aria-hidden='true'></i></span>");
//     plusButton.addClass("set-plus-" + product.id);
//     plusButton.css({
//       margin: "10px 0px 0px 10px",
//       fontSize: "20px",
//       cursor: "pointer",
//       width: "auto",
//     });

//     // append the minus and plus button to the ul with class "Sets" and "pa_set_seatcushion"
//     jQuery(this).append(
//       minusButton,
//       plusButton
//     );

//     plusButton.click(function (e) {
//       e.preventDefault();
//       var counterId = jQuery(this).data("product-id");
//       var counters = jQuery(".Sets.pa_set_seatcushion li .config__counter.set-id-" + counterId);
//       const maxCount = product.seatcussions;
//       var activeCounter = jQuery(".Sets.pa_set_seatcushion li.active .config__counter.set-id-" + counterId);
//       var count = parseInt(activeCounter.text()) + 1;

//       var sumCounters = 0;
//       counters.each(function () {
//         sumCounters += parseInt(jQuery(this).text());
//       });

//       var remaningCount = maxCount - sumCounters;

//       if (remaningCount > 0) {
//         activeCounter.text(count);
//         setConfiguratorEng(counterId, 'seatcushion', jQuery('.Sets.pa_set_seatcushion li.active').data('slug'), count, maxCount);
//       }

//       if (remaningCount == 1) {
//         jQuery(".Sets.pa_set_seatcushion .plus-button.set-plus-" + product.id).css({
//           opacity: 0.5,
//           cursor: "not-allowed",
//         });
//       }

//       if (remaningCount <= (maxCount + 1)) {
//         jQuery(".Sets.pa_set_seatcushion .minus-button.set-minus-" + product.id).css({
//           opacity: 1,
//           cursor: "pointer",
//         });
//       }

//     });



//     minusButton.click(function (e) {
//       e.preventDefault();
//       var counterId = jQuery(this).data("product-id");
//       var counters = jQuery(".Sets.pa_set_seatcushion li .config__counter.set-id-" + counterId);
//       const maxCount = product.connecters;

//       var activeCounter = jQuery(".Sets.pa_set_seatcushion li.active .config__counter.set-id-" + product.id);

//       var count = parseInt(activeCounter.text()) - 1;
//       if (count >= 0) {
//         activeCounter.text(count);
//         setConfiguratorEng(counterId, 'seatcushion', jQuery('.Sets.pa_set_seatcushion li.active').data('slug'), count, maxCount);
//       }

//       var sumCounters = 0;
//       counters.each(function () {
//         console.log(jQuery(this).data());
//         sumCounters += parseInt(jQuery(this).text());
//       }
//       );

//       var remaningCount = maxCount - sumCounters;

//       if (remaningCount > 0) {
//         jQuery(".Sets.pa_set_seatcushion .plus-button.set-plus-" + product.id).css({
//           opacity: 1,
//           cursor: "pointer",
//         });
//       }
//       if (remaningCount == maxCount) {
//         jQuery(".Sets.pa_set_seatcushion .minus-button.set-minus-" + product.id).css({
//           opacity: 0.5,
//           cursor: "not-allowed",
//         });
//       }


//     });

//   });
// });


// function setConfiguratorEng(counterId, type, slug, count, maxCount) {
//   if (undefined == CONFIGURATOR_ENG[counterId]) {
//     CONFIGURATOR_ENG[counterId] = {};
//   }
//   if (undefined == CONFIGURATOR_ENG[counterId][type]) {
//     CONFIGURATOR_ENG[counterId][type] = {};
//   }
//   if (undefined == CONFIGURATOR_ENG[counterId][type][slug]) {
//     CONFIGURATOR_ENG[counterId][type][slug] = count;
//     CONFIGURATOR_ENG[counterId][type].maxCount = maxCount
//   }
//   else {
//     CONFIGURATOR_ENG[counterId][type][slug] = count; //{ count: count, maxCount: maxCount }
//   }
// }
