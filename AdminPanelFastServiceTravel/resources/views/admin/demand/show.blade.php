@extends('admin.layouts.master')

@section('title')
{{ __('main.Demands') }}
@endsection

@section('content')

  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h4 class="m-0 text-dark">{{ __('main.Demand_Details') }}</h4>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="{{ route('admin.home') }}">{{ __('main.Home') }}</a></li>
              <li class="breadcrumb-item"><a href="{{ route('admin.demand.index') }}">{{ __('main.Demands') }}</a></li>
              <li class="breadcrumb-item active">{{ $demand->id }}</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <div class="content">
    <div class="container-fluid">
        <div class="card">
            <div class="card-header">
                <a href="{{ route('admin.demand.edit', $demand->_id) }}" class="btn btn-success btn-sm float-right">{{ __('main.Edit') }}</a>
            </div>
            <div class="card-body">
                @php
                    // Helper to humanize keys when no translation key exists
                    $humanize = function($key){
                        $key = str_replace(['-', '_'], ' ', $key);
                        $key = preg_replace('/([a-z])([A-Z])/', '$1 $2', $key); // camelCase to words
                        return ucfirst(strtolower($key));
                    };
                @endphp
                <div class="row">
                    <div class="col-md-4">
                        <h5>Basic Information</h5>
                        <table class="table table-sm">
                            @php $st = in_array($demand->status, ['approved','rejected','pending']) ? $demand->status : 'pending'; @endphp
                            <tr><th>Status</th><td><span class="badge badge-{{ $st === 'approved' ? 'success' : ($st === 'rejected' ? 'danger' : 'warning') }}">{{ $st }}</span></td></tr>
                            <tr><th>Type</th><td>{{ $demand->demandType ?? '-' }}</td></tr>
                            <tr class="table-active"><th colspan="2">Account (Signed-in user)</th></tr>
                            <tr><th>Name</th><td>{{ $demand->user->name ?? '-' }}</td></tr>
                            <tr><th>Email</th><td>{{ $demand->user->email ?? '-' }}</td></tr>
                            <tr><th>Phone</th><td>{{ $demand->user->phoneNumber ?? '-' }}</td></tr>
                            <tr class="table-active"><th colspan="2">Applicant</th></tr>
                            <tr><th>Name</th><td>{{ $demand->applicantName ?? '-' }}</td></tr>
                            <tr><th>Email</th><td>{{ $demand->email ?? '-' }}</td></tr>
                            <tr><th>Phone</th><td>{{ $demand->phoneNumber ?? '-' }}</td></tr>
                            <tr><th>Created</th><td>{{ $demand->created_at }}</td></tr>
                        </table>
                    </div>
                    <div class="col-md-8">
                        <h5 class="mb-3">Travelers</h5>
                        @if(count($travelers) === 0)
                            <p class="text-muted">No Data</p>
                        @else
                            @foreach($travelers as $i => $traveler)
                                <div class="card mb-3 border-info">
                                    <div class="card-header py-1">
                                        <strong>Traveler #{{ $i+1 }}</strong>
                                    </div>
                                    <div class="card-body p-2">
                                        <div class="row">
                                            @foreach($traveler as $k => $v)
                                                @php 
                                                    $labelKey = 'main.' . ucfirst($k);
                                                    $translated = __($labelKey);
                                                    $label = $translated === $labelKey ? $humanize($k) : $translated;
                                                @endphp
                                                @if(is_array($v) && isset($v['path']))
                                                    @php $fileUrl = asset('storage/' . $v['path']); @endphp
                                                    <div class="col-md-4 mb-2">
                                                        <div class="border p-2 text-center">
                                                            @if(($v['type'] ?? '') === 'image')
                                                                <img src="{{ $fileUrl }}" alt="{{ $k }}" style="max-width:100%;height:120px;object-fit:cover" class="mb-1">
                                                            @else
                                                                <i class="fas fa-file fa-2x mb-1"></i>
                                                            @endif
                                                            <div class="small text-truncate" title="{{ $label }}">{{ $label }}</div>
                                                            @php $hash = sha1($v['path']); @endphp
                                                            <a class="btn btn-xs btn-outline-primary" href="{{ route('admin.demand.download', [$demand->_id, $hash]) }}">Download</a>
                                                        </div>
                                                    </div>
                                                @elseif(!is_array($v))
                                                    <div class="col-md-4 mb-2">
                                                        <strong>{{ $label }}:</strong>
                                                        <div class="small">{{ $v }}</div>
                                                    </div>
                                                @endif
                                            @endforeach
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        @endif
                    </div>
                </div>
                <!-- Documents section removed (files already visible per traveler) -->
            </div>
        </div>
    </div><!-- /.container-fluid -->
</div><!-- /.content -->

</div>

@endsection

@section('script')

@endsection
