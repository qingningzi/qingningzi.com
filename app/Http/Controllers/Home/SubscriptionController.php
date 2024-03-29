<?php

namespace App\Http\Controllers\Home;

use App\Http\Requests\Home\SubscriptionRequest;
use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends BaseController
{
    public function store(SubscriptionRequest $request)
    {
        $subscribed = $request->input('subscribed');
        $data = $request->except(['_token', 'keywords', 'description', 'subscribed', 'allow_registration']);
        $record = Subscription::where('email', $data['email'])->first();
        if ($record) {
            if (!$record->subscribed) {
                $record->subscribed = true;
                $record->save();
            }
            return response()->json(['message' => '该邮箱已经订阅!!!'], 404);
        }

        if (!$subscribed) {
            return response()->json(['message' => '系统订阅功能暂时停用!!!'], 404);
        }

        $data['subscribed'] = true;
        Subscription::create($data);
        return response()->json(['message' => '订阅成功!!!'], 200);
    }

    public function update(Request $request)
    {
        // TODO: unsubscribe
    }
}
