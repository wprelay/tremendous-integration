<?php

use WPRelay\Tremendous\Src\Tremendous;

$store_front_hooks = [
    'actions' => [
        'wpr_process_tremendous_payouts' => ['callable' => [Tremendous::class, 'sendPayments'], 'priority' => 11, 'accepted_args' => 1],
    ],
    'filters' => [
        'rwp_payment_process_sources' => ['callable' => [Tremendous::class, 'addTremendousPayment'], 'priority' => 11, 'accepted_args' => 4],
    ]
];

$admin_hooks = [
    'actions' => [],
    'filters' => [

    ]
];

return [
    'store_front_hooks' => $store_front_hooks,
    'admin_hooks' => $admin_hooks
];