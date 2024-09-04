<?php

namespace RelayWP\Tremendous\App\Services;

use RelayWP\Tremendous\App\Helpers\Functions;
use RelayWP\Tremendous\App\Services\Request\Response;

class Settings
{
    private static $settings = [];

    public static function get($key, $default = null)
    {
        if (empty(static::$settings)) {
            static::$settings = static::fetchSettings();
        }

        return Functions::dataGet(static::$settings, $key, $default);
    }

    public static function fetchSettings()
    {
        $wpr_settings = get_option('wpr_tremendous_settings', '{}');

        return json_decode($wpr_settings, true);

    }
}
