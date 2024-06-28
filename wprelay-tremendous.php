<?php


/**
 * Plugin Name:         WPRelay - Tremendous
 * Description:          Gift Cards for WPRelay
 * Version:              0.0.7
 * Requires at least:    5.9
 * Requires PHP:         7.3
 * Author:               WPRelay * Author URI:           https://www.wprelay.com
 * Text Domain:          flycart.org
 * Domain Path:          /i18n/languages
 * License:              GPL v3 or later
 * License URI:          https://www.gnu.org/licenses/gpl-3.0.html
 *
 * WC requires at least: 7.0
 * WC tested up to:      8.1
 *
 * WPRelay: 1.0.1
 * WPRelay Page Link: wprelay-tremendous
 */


defined('ABSPATH') or exit;

defined('WPR_TREMENDOUS_PLUGIN_PATH') or define('WPR_TREMENDOUS_PLUGIN_PATH', plugin_dir_path(__FILE__));
defined('WPR_TREMENDOUS_PLUGIN_URL') or define('WPR_TREMENDOUS_PLUGIN_URL', plugin_dir_url(__FILE__));
defined('WPR_TREMENDOUS_PLUGIN_FILE') or define('WPR_TREMENDOUS_PLUGIN_FILE', __FILE__);
defined('WPR_TREMENDOUS_PLUGIN_NAME') or define('WPR_TREMENDOUS_PLUGIN_NAME', "WPRelay-Tremendous");
defined('WPR_TREMENDOUS_PLUGIN_SLUG') or define('WPR_TREMENDOUS_PLUGIN_SLUG', "wprelay-tremendous");
defined('WPR_TREMENDOUS_VERSION') or define('WPR_TREMENDOUS_VERSION', "0.0.7");
defined('WPR_TREMENDOUS_PREFIX') or define('WPR_TREMENDOUS_PREFIX', "prefix_");
defined('WPR_TREMENDOUS_MAIN_PAGE') or define('WPR_TREMENDOUS_MAIN_PAGE', "wprelay-tremendous");

/**
 * Required PHP Version
 */
if (!defined('WPR_TREMENDOUS_REQUIRED_PHP_VERSION')) {
    define('WPR_TREMENDOUS_REQUIRED_PHP_VERSION', 7.2);
}

$php_version = phpversion();


if (version_compare($php_version, WPR_TREMENDOUS_REQUIRED_PHP_VERSION) > 1) {
    error_log("Minimum PHP Version Required Is " . WPR_TREMENDOUS_REQUIRED_PHP_VERSION);
    return;
}

if (file_exists(WPR_TREMENDOUS_PLUGIN_PATH . '/vendor/autoload.php')) {
    require WPR_TREMENDOUS_PLUGIN_PATH . '/vendor/autoload.php';
} else {
    error_log('Vendor directory is not found');
    return;
}

if (defined('WC_VERSION')) {
    /**
     * To set plugin is compatible for WC Custom Order Table (HPOS) feature.
     */
    add_action('before_woocommerce_init', function () {
        if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
            \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
        }
    });
}

if (!function_exists('wpr_check_is_wp_relay_pro_installed')) {
    function wpr_check_is_wp_relay_pro_installed()
    {
        $plugin_path = trailingslashit(WP_PLUGIN_DIR) . 'wprelay-pro/wprelay-pro.php';
        return in_array($plugin_path, wp_get_active_and_valid_plugins());
    }
}

if (function_exists('wpr_check_is_wp_relay_pro_installed')) {
    if (!wpr_check_is_wp_relay_pro_installed()) {

        $class = 'notice notice-warning';
        $name = WPR_TREMENDOUS_PLUGIN_NAME;
        $status = 'warning';
        $message = __("Error you did not installed the WPRelay Plugin to work with {$name}", 'text-domain');
        add_action('admin_notices', function () use ($message, $status) {
            ?>
            <div class="notice notice-<?php echo esc_attr($status); ?>">
                <p><?php echo wp_kses_post($message); ?></p>
            </div>
            <?php
        }, 1);
        return;
    }
}

//Loading woo-commerce action schedular
require_once(plugin_dir_path(__FILE__) . '../woocommerce/packages/action-scheduler/action-scheduler.php');

if (class_exists('WPRelay\Tremendous\App\App')) {
    //If the Directory Exists it means it's a pro pack;
    //Check Whether it is PRO USER

    $app = \WPRelay\Tremendous\App\App::make();

    $app->bootstrap(); // to load the plugin
} else {
//    wp_die('Plugin is unable to find the App class.');
    return;
}


add_action('admin_head', function () {
    $page = !empty($_GET['page']) ? $_GET['page'] : '';
    $main_page_name = WPR_TREMENDOUS_MAIN_PAGE;
    if (in_array($page, array($main_page_name))) {
        ?>
        <script type="text/javascript">
            jQuery(document).ready(function ($) {
                self = window;
            });
        </script>
        <?php
    }
}, 11);

add_action('rwp_after_init', function () {
    if (class_exists('Puc_v4_Factory')) {
        $myUpdateChecker = \Puc_v4_Factory::buildUpdateChecker(
            'https://github.com/wprelay/tremendous-integration',
            __FILE__,
            'wprelay-tremendous'
        );
        $myUpdateChecker->getVcsApi()->enableReleaseAssets();
    }
});

