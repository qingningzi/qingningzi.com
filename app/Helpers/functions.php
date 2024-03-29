<?php

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;

// commands: composer dump-autoload

/**
 * 得到 npm 项目版本
 */
if (!function_exists('getPackageVersion')) {
    /**
     * @return mixed
     */
    function getPackageVersion(): mixed
    {
        return Cache::remember("package_version", 3600 * 24, function () {
            $config = json_decode(file_get_contents(base_path() . "/package.json"), true);
            return Arr::get(collect($config), "version", "1.0.0");
        });
    }
}

if (!function_exists('getArticleRate')) {
    /**
     * @param int $value
     * @return string
     */
    function getArticleRate(int $value = 3): string
    {
        $result = str_repeat("<i class='ci-star-filled'></i>", $value);
        $result .= str_repeat("<i class='ci-star'></i>", 5 - $value);
        return $result;
    }
}
