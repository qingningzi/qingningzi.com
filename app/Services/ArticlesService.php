<?php

namespace App\Services;

use App\Enums\ContentType;
use App\Models\Article;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Support\Facades\Cache;

class ArticlesService extends BaseService
{

    public function rates($url, $rate)
    {
        $max = ($rate > 5) ? 5 : $rate;
        return Cache::remember($url . $rate, $this->duration, function () use ($max) {
            $result = str_repeat("<i class='fa fa-star'></i>", $max);
            $result .= str_repeat("<i class='fa fa-star-o'></i>", 5 - $max);
            return $result;
        });
    }

    public function item($id)
    {
        $category = Category::find($id);
        return Cache::remember('item_' . $category->url, $this->duration, function () use ($category) {
            if ($category->content_type === ContentType::ARTICLE) {
                return Article::where('category_id', $category->id)->inRandomOrder()->first();
            }
            return Post::where('category_id', $category->id)->inRandomOrder()->first();
        });
    }

    public function items($id, $len)
    {
        $category = Category::find($id);
        $direction = $len < 10 ? 'asc' : 'desc';
        return Cache::remember($category->url . $len, $this->duration, function () use ($category, $len, $direction) {
            if ($category->content_type === ContentType::ARTICLE) {
                return Article::where('category_id', $category->id)->orderBy('created_at', $direction)->take($len)->get();
            }
            return Post::where('category_id', $category->id)->orderBy('created_at', $direction)->take($len)->get();
        });
    }

    public function find(int $id)
    {
        return Cache::remember('find_' . $id, $this->duration, function () use ($id) {
            return Post::find($id);
        });
    }
}
