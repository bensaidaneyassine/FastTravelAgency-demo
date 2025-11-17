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
            <h4 class="m-0 text-dark">{{ __('main.Demands') }}</h4>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="{{ route('admin.home') }}">{{ __('main.Home') }}</a></li>
              <li class="breadcrumb-item active">{{ __('main.Demands') }}</li>
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
                <div class="card-body">
                    <table id="table1" class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{{ __('main.Statu') }}</th>
                                <th>{{ __('main.Name') }}</th>
                                <th>{{ __('main.Customer_Name') }}</th>
                                <th>{{ __('main.E-mail') }}</th>
                                <th>{{ __('main.Phone') }}</th>
                                <th>{{ __('main.Creation Date') }}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($demands as $demand)
                                <tr>
                                    <td>
                                      @php $st = in_array($demand->status, ['approved','rejected','pending']) ? $demand->status : 'pending'; @endphp
                                      <span class="badge badge-{{ $st === 'approved' ? 'success' : ($st === 'rejected' ? 'danger' : 'warning') }}">{{ $st }}</span>
                                    </td>
                                    <td>{{ $demand->demandType }}</td>
                                    <td>{{ $demand->account_name ?? $demand->applicantName ?? ($demand->user->name ?? "--") }}</td>
                                    <td>{{ $demand->account_email ?? $demand->email ?? ($demand->user->email ?? "--")  }}</td>
                                    <td>{{ $demand->account_phone ?? $demand->phoneNumber ?? ($demand->user->phoneNumber ?? "--")  }}</td>
                                    <td>{{ $demand->created_at }}</td>
                                    <td>
                                        <a href="{{ route('admin.demand.show',$demand->_id) }}" title="{{ __('main.Show') }}" class="btn btn-success btn-xs"><i class="fas fa-arrow-right"></i></a>
                                        <a href="{{ route('admin.demand.edit',$demand->_id) }}" title="{{ __('main.Edit') }}" class="btn btn-primary btn-xs"><i class="fas fa-pencil-alt"></i></a>
                    <form id="delete_{{$demand->_id}}" action="{{route('admin.demand.destroy',$demand->_id)}}" method="post" class="d-inline">
                                            @method('DELETE')
                                            @csrf
                      <a href="javascript:void(0)" onclick="validate('{{$demand->_id}}')" title="{{ __('main.Delete') }}" class="btn btn-danger btn-xs"><i class="far fa-times-circle"></i></a>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div><!-- /.container-fluid -->
    </div><!-- /.content -->
</div>

@endsection

@section('script')

@endsection
