<?php

namespace WPRelay\Tremendous\Src;

use WPRelay\Tremendous\App\Services\Request\Response;

class DashboardController
{
    public static function playground()
    {
        $client = new TremendousClient();

        if ($client->authenticate()) {
            $response = $client->sendRewards();

            $body = $response->getBody();

            $contents = $body->getContents();

            $data = json_decode($contents, true);

            Response::success([
               'contents' => $data
            ]);
        }

        return [
            'message' => 'Order not created due to some issues'
        ];

//      $client->sendRewards();
    }

}