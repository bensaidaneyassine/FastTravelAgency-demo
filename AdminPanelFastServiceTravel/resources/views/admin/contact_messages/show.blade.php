@extends('admin.layouts.master')
@section('title','Contact Message')
@section('content')
<div class="content-wrapper">
  <div class="content-header">
    <div class="container-fluid"><h4>Contact Message</h4></div>
  </div>
  <div class="content">
    <div class="container-fluid">
      <div class="card">
        <div class="card-body">
          <dl class="row">
            <dt class="col-sm-2">Date</dt><dd class="col-sm-10">{{ $message->created_at?->format('Y-m-d H:i') }}</dd>
            <dt class="col-sm-2">Name</dt><dd class="col-sm-10">{{ $message->name }}</dd>
            <dt class="col-sm-2">Email</dt><dd class="col-sm-10">{{ $message->email }}</dd>
            <dt class="col-sm-2">Subject</dt><dd class="col-sm-10">{{ $message->subject }}</dd>
            <dt class="col-sm-2">Message</dt><dd class="col-sm-10"><pre style="white-space:pre-wrap">{{ $message->message }}</pre></dd>
            <dt class="col-sm-2">Status</dt><dd class="col-sm-10"><span class="badge badge-@if($message->status==='new')warning @else secondary @endif">{{ $message->status }}</span></dd>
          </dl>
          <a href="{{ route('admin.contact-messages.index') }}" class="btn btn-secondary btn-sm">Back</a>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection
