<?php

namespace WPRelay\Tremendous\App;

defined('ABSPATH') or exit;

use WPRelay\Tremendous\App\Setup;

class App extends Container
{

    public static $app;

    public static function make()
    {
        if (!isset(self::$app)) {
            self::$app = new static();
        }

        return self::$app;
    }

    /* Bootstrap plugin
     */
    public function bootstrap()
    {
        Setup::init();
        add_action('plugins_loaded', function () {
            do_action('rwpa_tremendous_before_init');
            Route::register();

            do_action('rwpa_tremendous_after_init');
        }, 1);
    }
}
