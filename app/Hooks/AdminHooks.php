<?php

namespace WPRelay\Tremendous\App\Hooks;

use WPRelay\Tremendous\App\Helpers\PluginHelper;
use WPRelay\Tremendous\Src\Controllers\Admin\PageController;

class AdminHooks extends RegisterHooks
{
    public static function register()
    {
        static::registerHooks('admin-hooks.php');
    }

    public static function init()
    {

    }

    public static function head()
    {

    }

    public static function addMenu()
    {
        add_submenu_page(
            null,
            esc_html__(WPR_TREMENDOUS_PLUGIN_NAME, WPR_TREMENDOUS_PLUGIN_SLUG),
            esc_html__(WPR_TREMENDOUS_PLUGIN_NAME, WPR_TREMENDOUS_PLUGIN_SLUG),
            'manage_options',
            WPR_TREMENDOUS_MAIN_PAGE,
            [PageController::class, 'show'],
            100
        );
    }
}