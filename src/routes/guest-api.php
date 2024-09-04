<?php

//All routes actions will be performed in Route::handleAuthRequest method.


use RelayWP\Tremendous\Src\DashboardController;

return [
    'playground' => ['callable' => [DashboardController::class, 'playground']],
];

