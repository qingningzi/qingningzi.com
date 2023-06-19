@extends('layouts.default')
@section('content')
    @section('breadcrumb')
        @if($category->parent())
            <li>
                <a rel="nofollow" href="{{url('categories/'.$category->parent()->id)}}">
                    {{$category->parent()->title}}
                </a>
            </li>
        @endif
        <li>
            {{$category->title}}
        </li>
    @endsection
    <div class="container section-bottom-60">
        <div class="row">
            <div class="col-md-8 text-xs-start">
                @foreach($data as $key=>$item)
                    <div class="blog-post">
                        <div
                                class="blog-post-meta unit unit-xs-horizontal unit-sm-horizontal unit-md-horizontal unit-lg-horizontal">
                            <div class="unit-left">
                                <div class="center-block blog-post-meta-date">
                                    <span class='blog-post-meta-date-big reveal-block'>
                                        {{$item->created_at->format('d')}}
                                    </span>
                                    <span>{{$item->created_at->format('M')}}</span>
                                </div>
                            </div>
                            <div class="unit-body">
                                <h3 class="blog-post-meta-title">
                                    <a href="{{url($item->url)}}" class="text-base"
                                       title="{{$item->title}}">{{$item->username}}</a></h3>
                                <p class="d-none d-sm-block">
                                    <span class='fst-italic'>Posted by </span>
                                    <a>
                                        {{env('APP_NAME')}}
                                    </a> &#8226;
                                    <span class='fst-italic'>Date at</span>
                                    <span class="text-primary">{{$item->created_at->diffForHumans()}}</span>
                                </p>
                            </div>
                        </div>
                        <div class="blog-post-media">
                            @if($key%3 == 0)
                                <a title="{{$item->title}}" data-lightbox="image" href="{{$item->thumb}}"
                                   class="thumbnail">
                                    <img width="770" height="564" alt="{{$item->title}}"
                                         src="{{$item->thumb}}" class="img-fluid"><span
                                            class="caption"></span></a>
                            @else
                                <a href="{{url($item->url)}}"
                                   title="{{$item->title}}">
                                    <img width="770" height="562" alt="{{$item->title}}"
                                         src="{{$item->thumb}}"
                                         class="img-fluid">
                                </a>
                            @endif
                        </div>
                        <p class="desc">{{$item->description}}</p>
                        <div class="reveal-xs-flex range-xs-bottom range-xs-justify">
                            @include('components.social')
                            <div><a href="{{url($item->url)}}" class="btn btn-primary"
                                    rel="nofollow">马上围观</a></div>
                        </div>
                    </div>
                    <hr class="my-5">
                @endforeach
                {{$data->render()}}
            </div>
            @include('components.sidebar')
        </div>
    </div>
@endsection
