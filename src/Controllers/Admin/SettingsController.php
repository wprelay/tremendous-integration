<?php

namespace WPRelay\Tremendous\Src\Controllers\Admin;

use WPRelay\Tremendous\App\Helpers\PluginHelper;
use WPRelay\Tremendous\App\Services\Request\Request;
use WPRelay\Tremendous\App\Services\Request\Response;
use WPRelay\Tremendous\Src\TremendousClient;

class SettingsController
{
    public static function getSettings(Request $request)
    {
        try {
            $data = get_option('wpr_tremendous_settings', '{}');
            $settings = json_decode($data, true);
            $settings = $settings['tremendous_settings'] ?? [];

            $sandbox_mode = $settings['sandbox_mode'] ?? '';
            $api_key = $settings['api_key'] ?? '';
            $campaign_id = $settings['campaign_id'] ?? '';
            $funding_source = $settings['funding_source'] ?? '';

            Response::success([
                'sandbox_mode' => $sandbox_mode,
                'campaign_id' => $campaign_id,
                'api_key' => $api_key,
                'funding_source' => $funding_source,
            ]);
        } catch (\Exception|\Error $exception) {
            PluginHelper::logError('Error Occurred While Processing', [__CLASS__, __FUNCTION__], $exception);
            return Response::error();
        }
    }

    public static function saveSettings(Request $request)
    {
        $request->validate([
            'sandbox_mode' => ['required'],
            'campaign_id' => ['required'],
            'funding_source' => ['required'],
            'api_key' => ['required'],
        ]);

        try {
            $sandbox_mode = $request->get('sandbox_mode');

            $api_key = $request->get('api_key');
            $campaign_id = $request->get('campaign_id');
            $funding_source = $request->get('funding_source');

            $settings = [
                'sandbox_mode' => (bool)$sandbox_mode,
                'campaign_id' => $campaign_id,
                'api_key' => $api_key,
                'funding_source' => $funding_source,
            ];

            $settings = json_encode(['tremendous_settings' => $settings]);

            update_option('wpr_tremendous_settings', $settings);
        } catch (\Exception|\Error $exception) {
            PluginHelper::logError('Error Occurred While Processing', [__CLASS__, __FUNCTION__], $exception);
            return Response::error();
        }
    }

    public static function verifyApiKey(Request $request)
    {
        $request->validate([
            'api_key' => ['required']
        ]);

        try {
            $api_key = $request->get('api_key');

            $client = (new TremendousClient())->setApiKey($api_key);

            $response = $client->authenticate();

            if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
                $fundingSources = $client->getFundingSources();
                $campaigns = $client->getCampaigns();

                return [
                    'funding_sources' => $fundingSources,
                    'campaigns' => $campaigns
                ];
            } else {
                $body = $response->getBody();
                $contents = $body->getContents();

                Response::error(json_decode($contents, true), 401);
            }

        } catch (\Exception|\Error $exception) {
            PluginHelper::logError('Error Occurred While Processing', [__CLASS__, __FUNCTION__], $exception);
            return Response::error([
                'message' => $exception->getMessage()
            ]);
        }
    }
}