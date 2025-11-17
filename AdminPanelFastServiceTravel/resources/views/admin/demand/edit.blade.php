@extends('admin.layouts.master')

@section('title')
{{ __('main.Edit Demand') }}
@endsection

@section('content')

    <div class="content-wrapper">
        <div class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <h4 class="m-0 text-dark">{{ __('main.Edit Demand') }}</h4>
                    </div>
                    <div class="col-sm-6">
                        <ol class="breadcrumb float-sm-right">
                            <li class="breadcrumb-item"><a href="{{ route('admin.home') }}">{{ __('main.Home') }}</a></li>
                            <li class="breadcrumb-item"><a href="{{ route('admin.demand.index') }}">{{ __('main.Demands') }}</a></li>
                            <li class="breadcrumb-item active">{{ $demand->_id }}</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>

        <div class="content">
            <div class="container-fluid">
                <div class="card">
                    <div class="card-body">
                        <form id="form" method="POST" action="{{ route('admin.demand.update', $demand->_id) }}">
                            @csrf
                            @method('PUT')

                            <div class="form-group">
                                <label for="status">{{ __('main.Statu') }}</label>
                                <select id="status" name="status" class="form-control">
                                    <option value="pending" {{ $demand->status == 'pending' ? 'selected' : '' }}>pending</option>
                                    <option value="approved" {{ $demand->status == 'approved' ? 'selected' : '' }}>approved</option>
                                    <option value="rejected" {{ $demand->status == 'rejected' ? 'selected' : '' }}>rejected</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="applicantName">{{ __('main.Customer_Name') }}</label>
                                <input type="text" class="form-control" id="applicantName" name="applicantName" value="{{ $demand->applicantName }}">
                            </div>

                            <div class="form-group">
                                <label for="email">{{ __('main.E-mail') }}</label>
                                <input type="email" class="form-control" id="email" name="email" value="{{ $demand->email }}">
                            </div>

                            <div class="form-group">
                                <label for="phoneNumber">{{ __('main.Phone') }}</label>
                                <input type="text" class="form-control" id="phoneNumber" name="phoneNumber" value="{{ $demand->phoneNumber }}">
                            </div>

                            <button type="submit" id="submit" class="btn btn-primary">{{ __('main.Save') }}</button>
                            <a href="{{ route('admin.demand.show', $demand->_id) }}" class="btn btn-secondary">{{ __('main.Cancel') }}</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

@section('script')
@endsection
