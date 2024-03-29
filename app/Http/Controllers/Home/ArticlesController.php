<?php

namespace App\Http\Controllers\Home;

use App\Events\ArticleViewed;
use App\Jobs\ProcessQrcode;
use App\Models\Article;
use Artesaos\SEOTools\Facades\SEOMeta;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Cache;

/**
 * @Controller: ArticlesController
 */
class ArticlesController extends BaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @param Request $request
     * @param $id
     * @return Redirector|Application|RedirectResponse
     */
    public function redirect(Request $request, $id): \Illuminate\Routing\Redirector|Application|\Illuminate\Http\RedirectResponse
    {

        return redirect()->to("/s/{$id}.html");
    }

    /**
     * @param Request $request
     * @param $id
     * @return Factory|View|Application
     */
    public function show(Request $request, $id): \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Contracts\Foundation\Application
    {
        $data = Article::where('shortcode', $id)->first();
        if (!$data) {
            abort(404);
        }

        if (!$data->status || !$data->detail || !$data->title) {
            $data->status = false;
            $data->save();
            abort(404);
        }

        $tags = $data->tags()->pluck('name');
        $keywords = $tags->count() > 0 ? $tags->join(',') : $request->input('keywords');

        // seo
        SEOMeta::setTitle($data->title);
        SEOMeta::addKeyword($keywords);
        SEOMeta::setDescription($data->description);
        SEOMeta::setCanonical($request->getRequestUri());

        $parentId = $data->category->parent_id === 0 ? $data->category->id : $data->category->parent_id;

        // get previous and next records
        $previous = Cache::remember('previous_article_' . $data->shortcode, $this->duration, function () use ($data) {
            return Article::where('id', '<', $data->id)->orderBy('id', 'desc')->first();
        });
        $next = Cache::remember('next_article_' . $data->shortcode, $this->duration, function () use ($data) {
            return Article::where('id', '>', $data->id)->orderBy('id')->first();
        });

        // comments
        $comments = $data->comments()->paginate();

        // event => ArticleViewed || job => qrcode
        event(new ArticleViewed($data));
        !$data->qrcode && ProcessQrcode::dispatch($data)->delay(now()->addMinute())->onQueue('qrcode');

        return view($this->tmpl . 'articles.id', [
            'data' => $data,
            'category' => $data->category,
            'parent_id' => $parentId,
            'tags' => $tags,
            'previous' => $previous,
            'next' => $next,
            'attachment' => $data->attachment,
            'comments' => $comments,
        ]);
    }
}
