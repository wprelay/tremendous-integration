<?php

namespace WPRelay\Tremendous\Src\Models;

class Reward extends Model
{
    protected static $table = 'rewards';

    public function createTable()
    {
        $table = static::getTableName();
        $charset = static::getCharSetCollate();

        return "CREATE TABLE {$table} (
                    id BIGINT UNSIGNED AUTO_INCREMENT,
                    payout_id BIGINT UNSIGNED,
                    affiliate_id BIGINT UNSIGNED,
                    reward_id VARCHAR(255),
                    order_id VARCHAR(255),
                    amount VARCHAR(255),
                    currency VARCHAR(10) NULL,
                    delivery_method VARCHAR(30) NULL,
                    receipent_email VARCHAR(255) NULL,
                    receipent_name VARCHAR(255) NULL,
                    receipent_phone VARCHAR(255) NULL,
                    status VARCHAR(255) NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
                    updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                    PRIMARY KEY (id)
                ) {$charset};";
    }
}
