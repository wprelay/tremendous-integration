<?php

namespace WPRelay\Tremendous\App\Helpers;

use WPRelay\Tremendous\App\Services\Request\Response;

class Resource
{
    public static function resource(array $params)
    {
        $response = (new static)->toArray(...$params);

       return Response::success($response);
    }
}