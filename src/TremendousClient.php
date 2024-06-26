<?php

namespace WPRelay\Tremendous\Src;

use GuzzleHttp\Client;
use WPRelay\Tremendous\App\Helpers\PluginHelper;
use WPRelay\Tremendous\App\Services\Request\Response;
use WPRelay\Tremendous\App\Services\Settings;

class TremendousClient
{

    public $http_client;

    public $api_key;


    public function __construct()
    {
        $base_uri = static::isSandboxMode() ? static::getSandboxEndpoint() : static::getProductionEndpoint();

        $this->http_client = new Client([
            'base_uri' => $base_uri,
            'http_errors' => false
        ]);
    }

    public static function make()
    {
        return new self();
    }

    public function sendRewards($item)
    {
        $token = $this->getApiKey();

        //construct the rewards using affiliate data

        $campaign_id = Settings::get('tremendous_settings.campaign_id');


        $rewards = [
            "campaign_id" => $campaign_id,
            'payout_id' => $item['affiliate_payout_id'],
            "value" => [
                "denomination" => $item['commission_amount'],
                "currency_code" => $item['currency']
            ],
            "delivery" => [
                "method" => "EMAIL"
            ],
            "recipient" => [
                "name" => "Jane Doe",
                "email" => $item['affiliate_email']
            ],
        ];

        $response = $this->http_client->request('POST', '/api/v2/orders', [
            'headers' => [
                'accept' => 'application/json',
                'content-type' => 'application/json',
                'Authorization' => "Bearer {$token}"
            ],
            'json' =>
                [
                    "payment" => [
                        "funding_source_id" => "BALANCE"
                    ],
                    "rewards" => $rewards
                ]
        ]);

        return $response;
    }

    public function getApiKey()
    {
        if ($this->api_key) return $this->api_key;

        //query from database and store in $this->api_key

        $api_key = Settings::get('tremendous_settings.api_key');

        $this->setApiKey($api_key);

        return $api_key;

    }

    public function authenticate()
    {
        $token = $this->getApiKey();

        $response = $this->http_client->request('GET', '/api/v2/ping', [
            'timeout' => 20,
            'headers' => [
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json'
            ],
            'body' => '',
            'cookies' => array()
        ]);

        return $response;
    }

    public static function isSandboxMode()
    {
        return Settings::get('tremendous_settings.sandbox_mode') ?? true;
    }

    public static function getSandboxEndpoint()
    {
        return "https://testflight.tremendous.com";
    }

    public static function getProductionEndpoint()
    {
        return "https://api.tremendous.com";
    }

    public function getCampaigns()
    {
        $token = $this->getApiKey();

        $response = $this->http_client->request('GET', '/api/v2/campaigns', [
            'timeout' => 20,
            'headers' => [
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json'
            ],
            'body' => '',
            'cookies' => array()
        ]);

        $campaigns = [];
        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {

            $body = $response->getBody();
            $contents = $body->getContents();
            $data = json_decode($contents, true);

            $campaigns_data = $data['campaigns'];

            foreach ($campaigns_data as $item) {
                $campaigns[] = [
                    'label' => $item['name'],
                    'value' => $item['id']
                ];
            }

            return $campaigns;

        } else {
            Response::error([
                'message' => 'Unable to Fetch Campaigns'
            ]);
        }
    }

    public function getFundingSources()
    {
        $token = $this->getApiKey();


        $response = $this->http_client->request('GET', '/api/v2/funding_sources', [
            'timeout' => 20,
            'headers' => [
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json'
            ],
            'cookies' => array()
        ]);

        $funding_sources = [];

        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {

            $body = $response->getBody();
            $contents = $body->getContents();
            $data = json_decode($contents, true);

            $funding_sources_data = $data['funding_sources'];
            foreach ($funding_sources_data as $item) {
                $funding_sources[] = [
                    'label' => strtoupper($item['method']),
                    'value' => $item['id']
                ];
            }

            return $funding_sources;

        } else {
            Response::error([
                'message' => 'Unable to Fetch Funding Sources'
            ]);
        }
    }

    public function setApiKey($key)
    {
        $this->api_key = $key;

        return $this;
    }

}