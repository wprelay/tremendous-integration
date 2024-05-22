<?php

namespace WPRelay\Tremendous\Src\Controllers\Admin;

use Error;
use WPRelay\Tremendous\App\Helpers\PluginHelper;
use WPRelay\Tremendous\App\Resources\RewardItemCollection;
use WPRelay\Tremendous\App\Services\Request\Request;
use WPRelay\Tremendous\App\Services\Request\Response;
use WPRelay\Tremendous\Src\Models\Reward;

class ListController
{

    public static function rewardsList(Request $request)
    {
        try {
            $perPage = $request->get('per_page') ? $request->get('per_page') : 10;
            $currentPage = $request->get('current_page') ? $request->get('current_page') : 1;
            $search = $request->get('search', null);
            $status = $request->get('status', null);

            $query = Reward::query()
                ->select('*')
                ->when(!empty($status), function ($query) use ($status) {
                    $statuses = implode("','", $status);
                    return $query->where("status IN ('" . $statuses . "')");
                })
                ->when(!empty($search), function ($query) use ($search) {
                    return $query->where("receipent_email LIKE %s OR order_id LIKE %s", ["%$search%", "%$search"]);
                })
                ->orderBy('id', 'DESC');

            $totalCount = $query->count();

            $rewards = $query->limit($perPage)
                ->offset(($currentPage - 1) * $perPage)
                ->get();

            RewardItemCollection::collection([$rewards, $totalCount, $perPage, $currentPage]);

        } catch (\Exception $exception) {
            PluginHelper::logError('Error Occurred While Fetching Tremendous Data', [__CLASS__, __FUNCTION__], $exception);
            return Response::error();
        }
    }
}