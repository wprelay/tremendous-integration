<?php

namespace WPRelay\Tremendous\App\Hooks;


class CustomHooks extends RegisterHooks
{
    public static function register()
    {
        static::registerHooks('custom-hooks.php');
    }
}