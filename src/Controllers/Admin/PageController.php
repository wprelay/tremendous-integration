<?php
namespace WPRelay\Tremendous\Src\Controllers\Admin;

use WPRelay\Tremendous\App\Services\View;

class PageController
{
    /*
     *
     * instead of return just use echo when returning page in word-press plugin
     */

    public static function show()
    {
        echo View::render('admin');
    }

    public static function localData()
    {

    }
}