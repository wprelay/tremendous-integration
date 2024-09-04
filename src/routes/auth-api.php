<?php

//All routes actions will be performed in Route::handleAuthRequest method.

use RelayWP\Tremendous\Src\Controllers\Admin\ListController;
use RelayWP\Tremendous\Src\Controllers\Admin\SettingsController;
use RelayWP\Tremendous\Src\Controllers\LocalDataController;

return [
    'get_local_data' => ['callable' => [LocalDataController::class, 'getLocalData']],
    'verify_tremendous_api_key' => ['callable' => [SettingsController::class, 'verifyApiKey']],
    'save_tremendous_settings' => ['callable' => [SettingsController::class, 'saveSettings']],
    'get_tremendous_settings' => ['callable' => [SettingsController::class, 'getSettings']],
    'tremendous_rewards_list' => ['callable' => [ListController::class, 'rewardsList']],
];