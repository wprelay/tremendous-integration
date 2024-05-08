<?php

namespace WPRelay\Tremendous\Src\Controllers;

use Error;
use WPRelay\Tremendous\App\Helpers\WordpressHelper;
use WPRelay\Tremendous\App\Route;
use WPRelay\Tremendous\App\Services\Request\Request;
use WPRelay\Tremendous\App\Services\Request\Response;

class LocalDataController
{

    public function getLocalData(Request $request)
    {
        try {
            $currentUserData = wp_get_current_user();

            $localData = [
                'plugin_name' => WPR_TREMENDOUS_PLUGIN_NAME,
                'user' => [
                    'nick_name' => $currentUserData->user_nicename,
                    'email' => $currentUserData->user_email,
                    'url' => $currentUserData->user_url,
                    'is_admin' => $currentUserData->caps['administrator']
                ],
                'nonces' => [
                    'wpr_tremendous_nonce' => WordpressHelper::createNonce('tremendous_nonce'),
                ],
                'home_url' => get_home_url(),
                'admin_url' => admin_url(),
                'ajax_url' => admin_url('admin-ajax.php'),
                'ajax_name' => Route::AJAX_NAME,
                'version' => WPR_TREMENDOUS_VERSION,
            ];

            $localize = apply_filters('wpr_tremendous_local_data', $localData);

            return Response::success($localize);
        } catch (\Exception|Error $exception) {

            return Response::error([
                'message' => 'Unable to Fetch the Local Data'
            ]);
        }
    }

}