<?php

//All routes actions will be performed in Route::handleAuthRequest method.

defined('ABSPATH') or exit;

use WPRelay\Tremendous\Src\DashboardController;

return [
    'playground' => ['callable' => [DashboardController::class, 'playground']],
];
