<?php

namespace WPRelay\Tremendous\App\Resources;

class MassPayoutItemCollection extends Collection
{
    public function toArray($items, $totalCount, $perPage, $currentPage)
    {
        $data = [];
        foreach ($items as $item) {
            $data[] = [
                'receiver_email' => $item->receiver_email,
                'affiliate_id' => $item->affiliate_id,
                'mass_pay_transaction_id' => $item->masspay_txn_id ? $item->masspay_txn_id : null,
                'unique_id' => $item->unique_id ? $item->unique_id : null,
                'payout_id' => $item->payout_id,
                'currency_code' => $item->mc_currency ? $item->mc_currency : null,
                'amount' => $item->payment_gross ? $item->payment_gross : null,
                'status' => $item->status,
            ];
        }

        return [
            "total" => $totalCount,
            "per_page" => $perPage,
            "total_pages" => ceil($totalCount / $perPage),
            "current_page" => $currentPage,
            'mass_payout_items' => $data
        ];
    }
}