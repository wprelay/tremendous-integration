<?php

namespace RelayWP\Tremendous\App\Services\Validation;

use RelayWP\Tremendous\App\Services\Request\Request;

interface FormRequest
{
    public function rules(Request $request);

    public function messages(): array;
}