<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $prefix;

    protected $guarded = [];

    public function __construct()
    {
        $this->prefix = "s/";
    }

    public function platform(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo('App\Models\Platform', 'platform_id', 'id');
    }

    public function category(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo('App\Models\Category', 'category_id', 'id');
    }

    public function getShortcodeAttribute(): string
    {
        return $this->prefix . $this->attributes['shortcode'];
    }

    public function tags()
    {
        return $this->morphMany('App\Models\Tag', 'taggable');
    }

    public function attachment()
    {
        return $this->hasOne('App\Models\Attachment', 'article_id', 'id');
    }

    public function comments()
    {
        return $this->hasMany('App\Models\Comment', 'article_id', 'id');
    }
}
