<?php

namespace App\Http\Controllers\Home;

use App\Models\Article;
use App\Models\Post;
use App\Models\Tag;
use Artesaos\SEOTools\Facades\SEOMeta;
use Illuminate\Http\Request;

class SearchController extends BaseController
{
    public function index(Request $request)
    {
        $domain = env("APP_DOMAIN");
        $keyword = $request->get("tag");
        if ($keyword) {
            $tag = Tag::whereHasMorph("taggable", [Post::class, Article::class])->where('name', 'like', "%$keyword%")->first();
            if (!$tag) {
                $url = "https://www.so.com/s?q=" . $keyword . "&ie=utf8&src=" . $domain . "&site=" . $domain . "&rg=1";
                return redirect($url, 302);
            }

            // update tags hit_count
            // $tag->incrementEach(['hit_count' => 1, 'views_count' => 1]); error
            $tag->increment('hit_count');
            $tag->increment('views_count');

            SEOMeta::setTitle($tag->name);
            SEOMeta::addKeyword($tag->name);
            SEOMeta::setDescription($tag->name);
            SEOMeta::setCanonical($request->getRequestUri());
            $data = $tag->taggable()->where('status', true)->select(['title', 'description', 'thumb', 'shortcode', 'qrcode', 'category_id', 'platform_id', 'views_count', 'created_at'])->paginate(15);;

            return view('pages.tags.index', [
                'data' => $data,
                'parent_id' => 0,
                'tag' => $tag,
            ]);
        }

        $keyword = $request->get("keyword") ?? env("APP_NAME");
        $url = "https://www.so.com/s?q=" . $keyword . "&ie=utf8&src=" . $domain . "&site=" . $domain . "&rg=1";
        return redirect($url, 302);
    }
}
