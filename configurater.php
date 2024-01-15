<?php

/**
 * Plugin Name: Cubx-furniture 3D Configurator
 * Plugin URI: https://cubx-furniture.com/konfigurator/
 * Description: Cubx-furniture 3D Configurator
 * Version: 1.0.1
 * Author: Cyber Nest
 * Author URI: cybernest.com
 * Text Domain: 
 */

define('CUBX_VERSION', '1.0.2');

function my_threejs_plugin_enqueue_scripts()
{
  wp_enqueue_style('bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css');
  wp_enqueue_style('my-threejs-plugin-style', plugin_dir_url(__FILE__) . 'css/style.css?v=' . CUBX_VERSION );
  wp_enqueue_script('jquery', 'https://code.jquery.com/jquery-3.2.1.slim.min.js', array(), '3.2.1', true);
  wp_enqueue_script('popper', 'https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js', array('jquery'), '1.12.9', true);
  wp_enqueue_script('bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js', array('jquery'), '4.0.0', true);
  wp_enqueue_script('file-saver', plugin_dir_url(__FILE__) . 'js/FileSaver.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'my_threejs_plugin_enqueue_scripts');

function get_web_data()
{
  $web_data = array(
    'web_url' => get_site_url(),
    'web_path' => get_site_url(),
  );

  return $web_data;
}

function get_wp_roles()
{
  global $wp_roles;
  $all_roles = $wp_roles->roles;
  $editable_roles = apply_filters('editable_roles', $all_roles);
  return $editable_roles;
}

function get_product_data()
{
	$current_language = ICL_LANGUAGE_CODE;

  $args = array(
    'post_type' => 'product',
    'posts_per_page' => -1,
    'orderby' => 'title',
    'order' => 'ASC',
    'lang' => $current_language,
  );

  $products = get_posts($args);

  $product_data = array();

  foreach ($products as $product) {
    $product_obj = wc_get_product($product->ID);

    $attributes = $product_obj->get_attributes();
    $attribute_data = array();

    foreach ($attributes as $attribute) {
      $attribute_name = $attribute->get_name();
      $attribute_values = $product_obj->get_attribute($attribute_name);

      if ($attribute->is_taxonomy()) {
        $attribute_taxonomy = $attribute->get_taxonomy_object();
        if ($attribute_taxonomy->attribute_type === 'color') {
          $terms = get_terms(array(
            'taxonomy' => $attribute_taxonomy->name,
            'hide_empty' => false,
          ));

          $attribute_values = explode(',', $attribute_values);
          $attribute_values = array_map('trim', $attribute_values);

          $term_names = array();

          foreach ($attribute_values as $attribute_value) {
            foreach ($terms as $term) {
              if ($term->name === $attribute_value) {
                $meta_values = get_term_meta($term->term_id);
                $product_attribute_colors = isset($meta_values['product_attribute_color']) ? $meta_values['product_attribute_color'] : array();
                $color = !empty($product_attribute_colors) ? $product_attribute_colors[0] : 'black';

                if (!isset($term_names[$term->slug])) {
                  $term_names[] = array(
                    'name' => $term->name,
                    'id' => $term->term_id,
                    'color' => $color,
                    'slug' => $term->slug,
                  );
                }
                break;
              }
            }
          }
        }
      }

      $attribute_data[$attribute_name] = $term_names;
    }

    $variant_data = array();

    if ($product_obj->is_type('variable')) {
      $variations = $product_obj->get_available_variations();

      foreach ($variations as $variation) {
        $variation_object = wc_get_product($variation['variation_id']);
        $attributes = $variation_object->get_variation_attributes();
        $variation_name = implode(' - ', $attributes);
        $gltf_url = get_post_meta($variation['variation_id'], 'gltf_text_field', 'true');
        $gltf_url_2 = get_post_meta($variation['variation_id'], 'gltf_text_field_2', 'true');
        
        if (strpos($gltf_url, "cubx-furniture.com") !== false || strpos($gltf_url, "www.cubx-furniture.com") !== false) {
          $gltf_url = str_replace(array("cubx-furniture.com", "www.cubx-furniture.com"), "d6734qda5szbb.cloudfront.net", $gltf_url);
        }
        if (strpos($gltf_url_2, "cubx-furniture.com") !== false || strpos($gltf_url_2, "www.cubx-furniture.com") !== false) {
          $gltf_url_2 = str_replace(array("cubx-furniture.com", "www.cubx-furniture.com"), "d6734qda5szbb.cloudfront.net", $gltf_url_2);
        }

        $variant_data[] = array(
          'id' => $variation['variation_id'],
          'slug' => $variation_name,
          'price' => $variation['display_price'],
          'image' => $variation['image']['url'],
          'description' => $variation_object->get_description(),
          'gltf_url' => $gltf_url ? $gltf_url : '',
          'gltf_url_2' => $gltf_url_2 ? $gltf_url_2 : ''
        );
      }
    }

    $product_data[$product->ID] = array(
      'id' => $product->ID,
      'name' => $product->post_title,
      'slug' => $product->post_name,
      'image' => get_the_post_thumbnail_url($product->ID),
      'category' => get_the_terms($product->ID, 'product_cat')[0]->name,
      'variants' => $variant_data,
      'attributes' => $attribute_data,
      'tag' => get_the_terms($product->ID, 'product_tag')[0]->name,
      'cubes' => get_post_meta($product->ID, 'no_of_cubes', 'true'),
      'connecters' => get_post_meta($product->ID, 'no_of_cusions', 'true'),
      'seatcussions' => get_post_meta($product->ID, 'no_of_seatcusions', 'true'),
      'price' => $product_obj->get_price(),
      'show_in_configurator' => get_post_meta($product->ID, 'show_in_configurator', 'true') === '1' ? true : false,
      'language' => apply_filters('wpml_element_language_code', null, array('element_id' => $product->ID, 'element_type' => 'product')),
    );
  }
  return $product_data;
}

// get the current user role
function get_current_user_role()
{
  global $wp_roles;
  $current_user = wp_get_current_user();
  $roles = $current_user->roles;
  $role = array_shift($roles);
  return isset($wp_roles->role_names[$role]) ? $wp_roles->role_names[$role] : '';
}




function my_threejs_plugin_output()
{
  $products = get_product_data();
  $cubx_data = get_web_data();
  $wp_roles = get_wp_roles();
  $current_user_role = get_current_user_role();
  ob_start();
?>
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <title>Configurater</title>
    <meta charset="utf-8" />
    <link rel="shortcut icon" />
    <link rel="stylesheet" href="<?php echo plugin_dir_url(__FILE__); ?>css/style.css?v=<?= time() ?>" />
    <script>var _CONFIGURATOR_SETTINGS = {};</script>
  </head>

  <body>
    <div class="left-toolbar-box position-fixed">
      <ul>
        <li>
          <button class="item move-btn" id="moveCube">
            <img src="<?php echo plugin_dir_url(__FILE__); ?>img/move.png" alt="" />
            <div>move</div>
          </button>
        </li>
        <li>
          <div class="item" id="deleteCube">
            <img src="<?php echo plugin_dir_url(__FILE__); ?>img/close.png" alt="" />
            <div>delete</div>
          </div>
        </li>
        <li>
          <div class="item" id="deleteAllCube">
            <img src="<?php echo plugin_dir_url(__FILE__); ?>img/close.png" alt="" />
            <div>delete <br> all</div>
          </div>
        </li>
      </ul>
    </div>
    <div id="progress-bar" class="screen">
      <div class="loader">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
    <div class="request-box position-absolute">
      <div class="d-flex justify-content-end border border-1 border-white">
        <div id="requestOffer" class="w-100 btn btn-link fs-5 text-decoration-none addToCart rounded-0 fw-bold"></div>
      </div>
    </div>
    <div class="right-box position-absolute" id="divA">
      <div class="d-flex justify-content-around cube-tabs">
        <button id="uCube" class="btn btn-link btn-switch-cube fs-10 text-decoration-none rounded-0"></button>
        <button id="oCube" class="btn btn-link btn-switch-cube fs-10 text-decoration-none rounded-0 active"></button>
      </div>
      <div id="cubex" class="fs-6 position-absolute CubeSet" style="font-size: small"></div>
    </div>
    <div class="position-absolute d-flex align-items-center bottom-toolbar">
      <div class="rotate-btn mx-4">
        <button id="rotateSingleCube">
          <img src="<?php echo plugin_dir_url(__FILE__); ?>img/rotate_cube.png" />
          <span class="d-block">rotate cube</span>
        </button>
      </div>
      <div class="zoom-btn">
        <div class="d-flex justify-content-around">
          <button class="mx-2" id="zoomOut"><img src="<?php echo plugin_dir_url(__FILE__); ?>img/zoom-out.png" /></button>
          <input type="range" name="volume" min="29" max="44" value="29">
          <button class="mx-2" id="zoomIn"><img src="<?php echo plugin_dir_url(__FILE__); ?>img/zoom-in.png" /></button>
        </div>
      </div>
      <div class="rotate-btn mx-4">
        <button id="rotateCube">
          <img src="<?php echo plugin_dir_url(__FILE__); ?>img/360.png" />
          <span class="d-block">rotate</span>
        </button>
      </div>
    </div>
    <div class="snacks" style="display: none;" id="danger-alert">
      <div class="fade_snakes alert_snakes alert-danger show">
        There is an error in loading this model, Please Refresh the page and add it again
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="productDetailsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold" id="exampleModalLabel">Product Details</h5>
            <div type="button" class="close fs-3 fw-bold" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </div>
          </div>
          <div class="modal-body p-5">
            <div class="table-responsive">
              <table class="table table-bordered border border-1 border-gray">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Varient Color with Quantity</th>
                  </tr>
                </thead>
                <tbody id="productDetailsTable">
                  <!-- Product details will be added here dynamically -->
                </tbody>
              </table>
            </div>

            <div class="py-5">
              <label for="exampleFormControlTextarea1" class="form-label">Note</label>
              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <div type="button" id="sendRequestButton" class="btn btn-link rounded-0 sendRequest text-decoration-none shadow fw-bold">Send Request</div>
          </div>
        </div>
      </div>
    </div>

    <div id="requestAlert1" class="alert-success-1">
      Request sent successfully.
    </div>
    <div id="requestAlert1" class="alert-error-1">
      Failed to send request.
    </div>

    <div id="requestAlert1" class="alert-cart-error-1">
      Failed to add in cart.
    </div>



    <div id="output" style="position: absolute; display: none;"></div>
    <script type="module" src="<?php echo plugin_dir_url(__FILE__); ?>libs/draco/gltf/draco_decoder.js"></script>
    <script type="module" src="<?php echo plugin_dir_url(__FILE__); ?>libs/draco/gltf/draco_encoder.js"></script>
    <script type="module" src="<?php echo plugin_dir_url(__FILE__); ?>libs/draco/gltf/draco_wasm_wrapper.js"></script>
    <script type="application/wasm" src="<?php echo plugin_dir_url(__FILE__); ?>libs/draco/gltf/draco_decoder.wasm"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/three.module_res_res.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/OrbitControls_res_res.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/GltfLoader_res_res.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/DracoLoader_res_res.js"></script>
    <script>
      var WP_PRODUCTS = <?= json_encode($products) ?>;
      var WP_CUBX_DATA = <?= json_encode($cubx_data) ?>;
      var WP_ROLES = <?= json_encode($wp_roles) ?>;
      var WP_CURRENT_USER_ROLE = <?= json_encode($current_user_role) ?>;
      var WP_DRECO_PATH = '<?php echo plugin_dir_url(__FILE__); ?>libs/draco/gltf/';
      var ALL_DATA = {};
      var CONFIGURATOR_ENG = {};
    </script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/constants.js?v=<?= CUBX_VERSION ?>"></script>
    <script type="module" src="<?php echo plugin_dir_url(__FILE__); ?>js/configurater.js?v=<?= CUBX_VERSION ?>"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/FileSaver.js?v=<?= CUBX_VERSION ?>"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/common.js?v=<?= CUBX_VERSION ?>"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/Pass.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/CopyShader.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/EffectComposer.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/OutlinePass.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/ShaderPass.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/RenderPass.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/MaskPass.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/DragControls.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/FXAAShader.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.9/dat.gui.js"></script>
    <script>console.log('v', '<?= CUBX_VERSION ?>')</script>
  </body>

  </html>
<?php
  return ob_get_clean();
}

function my_threejs_plugin_shortcode()
{
  return my_threejs_plugin_output();
}
add_shortcode('configurater_threejs', 'my_threejs_plugin_shortcode');
