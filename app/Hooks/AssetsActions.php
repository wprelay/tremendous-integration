<?php

namespace WPRelay\Tremendous\App\Hooks;

use WPRelay\Tremendous\App\Helpers\PluginHelper;
use WPRelay\Tremendous\App\Helpers\WordpressHelper;
use WPRelay\Tremendous\App\Services\Settings;

defined('ABSPATH') or exit;

class AssetsActions
{
    public static function register()
    {
        static::enqueue();
    }

    /**
     * Enqueue scripts
     */
    public static function enqueue()
    {
        add_action('admin_enqueue_scripts', [__CLASS__, 'addAdminPluginAssets']);
//        add_action('wp_enqueue_scripts', [__CLASS__, 'addStoreFrontScripts']);
    }

    public static function addAdminPluginAssets($hook)
    {
        if (strpos($hook, WPR_TREMENDOUS_PLUGIN_SLUG) !== false) {
            $reactDistUrl = PluginHelper::getReactAssetURL();
            $resourceUrl = PluginHelper::getResourceURL();

            wp_enqueue_style('wp-relay-tremendous-plugin-styles', "{$reactDistUrl}/main.css", [], WPR_TREMENDOUS_VERSION);
            wp_enqueue_script('wp-relay-tremendous-plugin-script', "{$reactDistUrl}/main.bundle.js", array('wp-element'), WPR_TREMENDOUS_VERSION, true);
            wp_enqueue_style('wp-relay-tremendous-plugin-styles-font-awesome', "{$resourceUrl}/admin/css/wpr-fonts.css", [], WPR_TREMENDOUS_VERSION);
            remove_all_actions('admin_notices');
        }
    }
}