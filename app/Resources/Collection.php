<?php

namespace RelayWP\Tremendous\App\Resources;


use RelayWP\Tremendous\App\Services\Request\Response;

class Collection
{

    public static function collection($data, $to_browser = true)
    {
        $response = (new static)->toArray(...$data);

        if ($to_browser) {
            return Response::success($response);
        }

        return $response;
    }
}