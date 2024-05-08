<?php

namespace WPRelay\Tremendous\App\Hooks;

class WPHooks extends RegisterHooks
{
    public static function register()
    {
        static::registerHooks('wp-hooks.php');
    }
}