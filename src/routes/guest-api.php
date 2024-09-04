<?php

//All routes actions will be performed in Route::handleAuthRequest method.


use WPRelay\Tremendous\Src\DashboardController;

return [
    'playground' => ['callable' => [DashboardController::class, 'playground']],
];

