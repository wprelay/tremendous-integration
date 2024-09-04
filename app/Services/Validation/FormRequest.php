<?php

namespace WPRelay\Tremendous\App\Services\Validation;

use WPRelay\Tremendous\App\Services\Request\Request;

interface FormRequest
{
    public function rules(Request $request);

    public function messages(): array;
}