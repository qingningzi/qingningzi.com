<?php

namespace App\Http\Middleware;

use App\Models\Site;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SiteMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse) $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $data = Cache::remember('site_config', now()->addMonths(3), function () {
            return Site::first();
        });
        $request->merge(['keywords' => $data->keywords]);
        $request->merge(['description' => $data->description]);
        $request->merge(['subscribed' => $data->subscribed]);
        $request->merge(['allow_registration' => $data->allow_registration]);
        return $next($request);
    }
}
