@extends('admin.layouts.master')
@section('title','Contact Messages')
@section('content')
<div class="content-wrapper">
  <div class="content-header">
    <div class="container-fluid"><h4>Contact Messages</h4></div>
  </div>
  <div class="content">
    <div class="container-fluid">
      <div class="card">
        <div class="card-body table-responsive p-0">
          <table class="table table-hover">
            <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th></th></tr></thead>
            <tbody>
              @forelse($messages as $m)
                <tr class="@if($m->status==='new') table-warning @endif">
                  <td>{{ $m->created_at?->format('Y-m-d H:i') }}</td>
                  <td>{{ $m->name }}</td>
                  <td>{{ $m->email }}</td>
                  <td>{{ $m->subject }}</td>
                  <td><span class="badge badge-@if($m->status==='new')warning @else secondary @endif">{{ $m->status }}</span></td>
                  <td><a class="btn btn-sm btn-primary" href="{{ route('admin.contact-messages.show',$m->id) }}">View</a></td>
                </tr>
              @empty
                <tr><td colspan="6" class="text-center">No messages.</td></tr>
              @endforelse
            </tbody>
          </table>
        </div>
        <div class="card-footer">{{ $messages->links() }}</div>
      </div>
    </div>
  </div>
</div>
@endsection
