<?php

namespace WPRelay\Tremendous\App\Resources;

class RewardItemCollection extends Collection
{
    public function toArray($items, $totalCount, $perPage, $currentPage)
    {
        $data = [];
        foreach ($items as $item) {
            $data[] = [
                'receiver_email' => $item->receipent_email,
                'affiliate_id' => $item->affiliate_id,
                'payout_id' => $item->payout_id,
                'currency_code' => $item->currency,
                'amount' => $item->amount,
                'status' => $item->status,
                'tremendous_order_id' => $item->order_id,
            ];
        }

        return [
            "total" => $totalCount,
            "per_page" => $perPage,
            "total_pages" => ceil($totalCount / $perPage),
            "current_page" => $currentPage,
            'reward_entries' => $data
        ];
    }
}