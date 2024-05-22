<?php

namespace WPRelay\Tremendous\Src;

use WPRelay\Tremendous\App\Services\Request\Response;
use WPRelay\Tremendous\App\Services\Settings;

class DashboardController
{
    public static function playground()
    {
        $settings = Settings::get('tremendous_settings');


        return Response::success([
            'data' => $_SERVER['SERVER_NAME']
        ]);

    }

}