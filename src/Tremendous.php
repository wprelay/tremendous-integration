<?php

namespace WPRelay\Tremendous\Src;

use RelayWp\Affiliate\Core\Models\Affiliate;
use RelayWp\Affiliate\Core\Models\Member;
use RelayWp\Affiliate\Core\Payments\RWPPayment;
use RelayWp\Affiliate\Core\Models\Payout;
use RelayWp\Affiliate\Core\Models\Transaction;
use WPRelay\Tremendous\App\Helpers\PluginHelper;
use WPRelay\Tremendous\App\Services\Request\Response;
use WPRelay\Tremendous\App\Services\Settings;

class Tremendous extends RWPPayment
{
    protected $payout = null;

    public static function addTremendousPayment($paymentMethods)
    {
        $paymentMethods['tremendous'] = new self();

        return $paymentMethods;
    }

    public function getPaymentSource()
    {
        return [
            'name' => 'Tremendous',
            'value' => 'tremendous',
            'label' => 'Tremendous Payment',
            'description' => 'Process Payouts for your affiliates through Tremendous',
            'note' => 'Retrieve the Private API Keys from your Tremendous account and ensure the selected access level is This step is essential for successful integration with tremendous',
            'target_url' => PluginHelper::getAdminDashboard(),
        ];
    }

    /**
     * @param $payout
     * @return void
     */
    public function process($payout_ids)
    {
        if (\ActionScheduler::is_initialized()) {
            as_schedule_single_action(strtotime("now"), 'wpr_process_paypal_payouts', [$payout_ids]);
        } else {
            error_log('ActionScheduler not initialized so Unable to process Payouts Via Paypal');
        }
    }

    public static function sendPayments($payout_ids)
    {
        $ids = implode("','", $payout_ids);

        $memberTable = Member::getTableName();
        $affiliateTable = Affiliate::getTableName();
        $payoutTable = Payout::getTableName();


        $payouts = Payout::query()
            ->select("{$payoutTable}.*, {$memberTable}.email as affiliate_email, {$affiliateTable}.payment_email as paypal_email")
            ->leftJoin($affiliateTable, "$affiliateTable.id = $payoutTable.affiliate_id")
            ->leftJoin($memberTable, "$memberTable.id = $affiliateTable.member_id")
            ->where("{$payoutTable}.id in ('" . $ids . "')")
            ->get();

        $data = [];

        foreach ($payouts as $payout) {
            if (in_array($payout->id, $payout_ids)) {
                $data[] = [
                    'affiliate_email' => $payout->paypal_email,
                    'commission_amount' => $payout->amount,
                    'currency' => $payout->currency,
                    'affiliate_id' => $payout->affiliate_id,
                    'affiliate_payout_id' => $payout->id,
                ];
            }
        }

        $client = new TremendousClient();

        if ($client->authenticate()) {
            $response = $client->sendRewards();

            if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
                $body = $response->getBody();
                $contents = $body->getContents();
                $data = json_decode($contents, true);

                if (!empty($data)) {
                    static::payoutSucceeded();
                }
            }

            Response::success([
                'contents' => $data
            ]);
        }

        static::payoutFailed($payouts, $payout_ids);
        return false;


//      $client->sendRewards();;

    }

    public static function payoutFailed($payouts, $payout_ids)
    {
        if (empty($status)) {
            foreach ($payouts as $payout) {
                if (in_array($payout->id, $payout_ids)) {
                    Transaction::create([
                        'affiliate_id' => $payout->affiliate_id,
                        'type' => Transaction::CREDIT,
                        'currency' => $payout->currency,
                        'amount' => $payout->amount,
                        'transactionable_id' => $payout->id,
                        'transactionable_type' => 'payout',
                        'system_note' => "Payout Failed #{$payout->id} so Refunded",
                    ]);

                    Payout::update(['status' => 'failed'], ['id' => $payout->id]);
                }
            }

        }
    }


    public function payoutSucceeded($payouts, $payout_ids)
    {

    }
}