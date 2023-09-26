<?php

/**
 * Plugin Name: CubX Configurater
 * Plugin URI: cybernest.com
 * Description: Configurator using ThreeJS.
 * Version: 1.0.0
 * Author: Ali Raza
 * Author URI: github.com/aliraxa-hub
 * Text Domain: https://github.com/CyberNestLtd/cubx-configurator
 */

function my_threejs_plugin_enqueue_scripts()
{
  wp_enqueue_style('bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css');
  wp_enqueue_style('my-threejs-plugin-style', plugin_dir_url(__FILE__) . 'css/style.css');
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
  $args = array(
    'post_type' => 'product',
    'posts_per_page' => -1,
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
        $variant_data[] = array(
          'id' => $variation['variation_id'],
          'slug' => $variation_name,
          'price' => $variation['display_price'],
          'image' => $variation['image']['url'],
          'description' => $variation_object->get_description(),
          'gltf_url' => $gltf_url ? $gltf_url : '',
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


// create a function in which 2 function call create post type if not exist and send mail to admin
function handle_send_request()
{
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (post_type_exists('business_customer_orders')) {
      $post_id = wp_insert_post(array(
        'post_title' => $_POST['post_title'],
        'post_content' => $_POST['post_content'],
        'post_status' => 'publish',
        'post_type' => 'business_customer_orders',
      ));

      if ($post_id) {
        $current_user = wp_get_current_user();
        $user_email = $current_user->user_email;
        $to = get_option('admin_email');
        $subject = 'New Business Customer Order';
        $body = 'New Business Customer Order has been placed. Please check the admin panel.';
        $body .= '<br><br><br>';
        $body .= 'Name: ' . $_POST['post_title'];
        $body .= '<br>';
        $body .= 'Email: ' . $user_email;
        $body .= '<br>';
        $body .= 'Phone: ' . $_POST['post_content'];
        $body .= '<br>';
        $body .= 'Address: ' . $_POST['post_content'];
        $body .= '<br>';
        $body .= 'Product Details: ';
        $body .= '<br>';
        $body .= 'Name: ' . $_POST['post_content'];
        $body .= '<br>';
        $body .= 'Cubes Quantity: ' . $_POST['post_content'];
        $body .= '<br>';
        $body .= 'Connecters Quantity: ' . $_POST['post_content'];
        $body .= '<br>';
        $body .= 'Seatcussions Quantity: ' . $_POST['post_content'];
        $body .= '<br>';

        $headers = array('Content-Type: text/html; charset=UTF-8');
        wp_mail($to, $subject, $body, $headers);
      }
    } else {
      create_custom_post_type();
      $post_id = wp_insert_post(array(
        'post_title' => $_POST['post_title'],
        'post_content' => $_POST['post_content'],
        'post_status' => 'publish',
        'post_type' => 'business_customer_orders',
      ));

      if ($post_id) {
        $current_user = wp_get_current_user();
        $user_email = $current_user->user_email;
        $to = get_option('admin_email');
        $subject = 'New Business Customer Order';
        $body = 'New Business Customer Order has been placed. Please check the admin panel.';
        $body .= '<br><br><br>';
        $body .= 'Name: ' . $_POST['post_title'];
        $body .= '<br>';
        $body .= 'Email: ' . $user_email;
        $body .= '<br>';
        $body .= 'Phone: ' . $_POST['post_content'];
        $body .= '<br>';
        $body .= 'Address: ' . $_POST['post_content'];
        $body .= '<br>';
        $body .= 'Product Details: ';
        $body .= '<br>';
        $body .= 'Name: ' . $_POST['post_content'];
        $body .= '<br>';
        $body .= 'Cubes Quantity: ' . $_POST['post_content'];
        $body .= '<br>';
        $body .= 'Connecters Quantity: ' . $_POST['post_content'];
        $body .= '<br>';
        $body .= 'Seatcussions Quantity: ' . $_POST['post_content'];
        $body .= '<br>';

        $headers = array('Content-Type: text/html; charset=UTF-8');
        wp_mail($to, $subject, $body, $headers);
      }
    }
  }
}
add_action('wp_ajax_send_request', 'handle_send_request');
add_action('wp_ajax_nopriv_send_request', 'handle_send_request');

function create_custom_post_type()
{
  $labels = array(
    'name' => 'Business Customer Orders',
    'singular_name' => 'Business Customer Order',
    'add_new' => 'Add New',
    'add_new_item' => 'Add New Business Customer Order',
    'edit_item' => 'Edit Business Customer Order',
    'new_item' => 'New Business Customer Order',
    'view_item' => 'View Business Customer Order',
    'search_items' => 'Search Business Customer Orders',
    'not_found' => 'No Business Customer Orders found',
    'not_found_in_trash' => 'No Business Customer Orders found in Trash',
    'parent_item_colon' => 'Parent Business Customer Order:',
    'menu_name' => 'Business Customer Orders',
  );

  $args = array(
    'labels' => $labels,
    'hierarchical' => false,
    'description' => 'Business Customer Orders',
    'supports' => array('title', 'editor', 'excerpt', 'author', 'thumbnail', 'revisions', 'custom-fields',),
    'taxonomies' => array('category', 'post_tag'),
    'public' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'menu_position' => 5,
    'menu_icon' => 'dashicons-cart',
    'show_in_nav_menus' => true,
    'publicly_queryable' => true,
    'exclude_from_search' => false,
    'has_archive' => true,
    'query_var' => true,
    'can_export' => true,
    'rewrite' => true,
    'capability_type' => 'post',
  );

  register_post_type('business_customer_orders', $args);
}
add_action('init', 'create_custom_post_type');





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
          <div class="modal-body p-0">
            <table class="table m-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cubes Quantity</th>
                  <th>Connecters Quantity</th>
                  <th>Seatcussions Quantity</th>
                </tr>
              </thead>
              <tbody id="productDetailsTable">
                <!-- Product details will be added here dynamically -->
              </tbody>
            </table>
          </div>
          <div class="modal-footer justify-content-center">
            <div type="button" id="sendRequestButton" class="btn btn-link rounded-0 sendRequest text-decoration-none shadow fw-bold">Send Request</div>
          </div>
        </div>
      </div>
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
    </script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/constants.js?v=<?= time() ?>"></script>
    <script type="module" src="<?php echo plugin_dir_url(__FILE__); ?>js/configurater.js?v=<?= time() ?>"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/FileSaver.js?v=<?= time() ?>"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/common.js?v=<?= time() ?>"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/Pass.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/CopyShader.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/EffectComposer.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/OutlinePass.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/ShaderPass.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/RenderPass.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/MaskPass.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/DragControls.js"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>js/postprocessing/FXAAShader.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.9/dat.gui.js?v=<?= time() ?>"></script>
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
