<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/health', function () {
    try {
        $test = DB::select('SELECT * from NGAS_USERS');

        return response(json_encode($test));
    } catch (Throwable $exception) {
        report($exception);

        return response('Database connection failed', 503);
    }
});