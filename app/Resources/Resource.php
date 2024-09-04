<?php

namespace RelayWP\Tremendous\App\Helpers;

use RelayWP\Tremendous\App\Services\Request\Response;

class Resource
{
    public static function resource(array $params)
    {
        $response = (new static)->toArray(...$params);

       return Response::success($response);
    }
}