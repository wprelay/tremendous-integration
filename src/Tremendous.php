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
use WPRelay\Tremendous\Src\Models\Reward;

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
            as_schedule_single_action(strtotime("now"), 'wpr_process_tremendous_payouts', [$payout_ids]);
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


        foreach ($data as $item) {
            Reward::query()->create([
                'affiliate_id' => $item['affiliate_id'],
                'payout_id' => $item['affiliate_payout_id'],
                'amount' => $item['commission_amount'],
                'currency' => $item['currency'],
                'receipent_email' => $item['affiliate_email'],
                'receipent_name' => $item['affiliate_email'],
                'status' => 'pending'
            ]);

            $affiliate_id = $item['affiliate_id'];
            $payout_id = $item['affiliate_payout_id'];


            if (\ActionScheduler::is_initialized()) {
                as_schedule_single_action(strtotime("now"), 'wpr_send_single_tremendous_reward', [$payout_id]);
            } else {
                Reward::query()->update([
                    'status' => 'failed',
                ], [
                    'payout_id' => $payout_id
                ]);
                error_log('ActionScheduler not initialized so Unable to process Payouts Via Paypal');
            }
        }
    }

    public static function payoutFailed($payouts)
    {
        foreach ($payouts as $payout) {
            do_action('rwp_payment_mark_as_failed', $payout->id, ['message' => 'Tremendous Payment Failed']);
        }
    }

    public static function payoutSucceeded($payouts)
    {
        foreach ($payouts as $payout) {
            do_action('rwp_payment_mark_as_succeeded', $payout->id, ['message' => 'Tremendous Payment Failed']);
        }
    }

    public static function getCustomFieldValue($custom_fields, $key)
    {
        foreach ($custom_fields as $field) {
            if ($field['id'] == $key)
                return $field['value'];
        }

        return null;
    }

    public static function sendSingleReward($payout_id)
    {

        $payout = Payout::query()->where("id = %d", [$payout_id])->first();

        if(empty($payout)) return;

        $data = [
            'affiliate_email' => $payout->paypal_email,
            'commission_amount' => $payout->amount,
            'currency' => $payout->currency,
            'affiliate_id' => $payout->affiliate_id,
            'affiliate_payout_id' => $payout->id,
        ];

        $client = new TremendousClient();

        $status = 'failure';

        if ($client->authenticate()) {
            $response = $client->sendRewards($data);

            if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
                $body = $response->getBody();
                $contents = $body->getContents();
                $data = json_decode($contents, true);

                if (!empty($data)) {
                    $order = $data['order'];

                    $order_status = $order['status'];

                    $order_rewards = $order['rewards'];

                    if (in_array($order_status, ['CANCELED', 'FAILED'])) {
                        $status = 'failed';
                    } else {
                        $status = 'success';
                    }

                    foreach ($order_rewards as $item) {
                        $custom_fields = $item['custom_fields'];
                        $affiliate_id = static::getCustomFieldValue($custom_fields, 'affiliate_id');
                        $payout_id = static::getCustomFieldValue($custom_fields, 'payout_id');
                        $reward_id = $item['reward_id'];
                        $order_id = $item['order_id'];
                        $deliver_at = $item['deliver_at'];

                        Reward::query()->update([
                            'reward_id' => $reward_id,
                            'order_id' => $order_id,
                            'deliver_at' => $deliver_at,
                            'status' => $status,
                        ], [
                            'affiliate_id' => $affiliate_id,
                            'payout_id' => $payout_id,
                        ]);
                    }
                }
            }
        }

        if ($status == 'success') {
            static::payoutSucceeded([$payout]);
            return true;
        } else {
            static::payoutFailed([$payout]);
            return false;
        }
    }
}