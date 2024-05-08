<?php

namespace WPRelay\Tremendous\App;

use WPRelay\Tremendous\App\Helpers\PluginHelper;
use WPRelay\Tremendous\App\Helpers\WordpressHelper;
use WPRelay\Tremendous\App\Hooks\AdminHooks;
use WPRelay\Tremendous\App\Hooks\AssetsActions;
use WPRelay\Tremendous\App\Hooks\CustomHooks;
use WPRelay\Tremendous\App\Hooks\WPHooks;
use WPRelay\Tremendous\App\Services\Request\Request;
use WPRelay\Tremendous\App\Services\Request\Response;

class Route
{
    //declare the below constants with unique reference for your plugin
    const AJAX_NAME = 'wp_relay_tremendous';
    const AJAX_NO_PRIV_NAME = 'wp_relay_tremendous_guest_apis';

    public static function register()
    {
        add_action('wp_ajax_nopriv_' . static::AJAX_NO_PRIV_NAME, [__CLASS__, 'handleGuestRequests']);
        add_action('wp_ajax_' . static::AJAX_NAME, [__CLASS__, 'handleAuthRequests']);

        AdminHooks::register();
        AssetsActions::register();
        error_log('invoked');
        CustomHooks::register();
        WPHooks::register();
    }

    public static function handleAuthRequests()
    {
        $request = Request::make();
        $method = $request->get('method');

        $nonce_key = $request->get('_wp_nonce_key');
        $nonce = $request->get('_wp_nonce');


        if ($method != 'get_local_data' && $method != 'playground' && $method != 'new_affiliate_registration' && $method != 'get_wc_states_for_store_front') {
//            static::verifyNonce($nonce_key, $nonce); // to verify nonce
        }

        //loading auth routes
        $handlers = require(PluginHelper::pluginRoutePath() . '/auth-api.php');

        if (!isset($handlers[$method])) {
            Response::error(['message' => 'Method not exists']);
        }

        $targetAction = $handlers[$method];


        return static::handleRequest($targetAction, $request);
    }

    public static function handleGuestRequests()
    {

        $request = Request::make();

        $method = $request->get('method');

        //loading guest routes
        $handlers = require(PluginHelper::pluginRoutePath() . '/guest-api.php');

        if (!isset($handlers[$method])) {
            wp_send_json_error(['message' => 'Method not exists'], 404);
        }

        $targetAction = $handlers[$method];

        return static::handleRequest($targetAction, $request);
    }

    private static function verifyNonce($nonceKey, $nonce)
    {
        if (empty($nonce) || !WordpressHelper::verifyNonce($nonceKey, $nonce)) {
            Response::error(['message' => 'Security Check Failed']);
        }
    }


    public static function handleRequest($targetAction, $request)
    {

        $target = $targetAction['callable'];

        $class = $target[0];

        $targetMethod = $target[1];

        $controller = new $class();

        $response = $controller->{$targetMethod}($request);

        return wp_send_json_success($response);
    }

}