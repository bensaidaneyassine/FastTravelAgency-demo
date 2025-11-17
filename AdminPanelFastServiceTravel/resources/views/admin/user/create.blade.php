@extends('admin.layouts.master')

@section('title')
{{ __('main.Add User') }}
@endsection

@section('content')
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h4 class="m-0 text-dark">{{ __('main.Add User') }}</h4>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><a href="{{ route('admin.home') }}">{{ __('main.Home') }}</a></li>
                <li class="breadcrumb-item"><a href="{{ route('admin.user.index') }}">{{ __('main.Users') }}</a></li>
              <li class="breadcrumb-item active">{{ __('main.Add User') }}</li>
            </ol>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <div class="content">
        <div class="container-fluid">
                        @if ($errors->any())
                            <div class="alert alert-danger">{{ $errors->first() }}</div>
                        @endif
                        @if (session('message'))
                            <div class="alert alert-{{ session('type','info') }}">{{ session('message') }}</div>
                        @endif
            <form action="{{ route('admin.user.store') }}" method="post" id="form">
                @csrf
                <div class="row">
                    <div class="col-md-9">
                        <div class="card">
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="title">{{ __('main.E-mail') }}</label>
                                    <input type="text" class="form-control form-control-sm" id="title" name="email" value="" required>
                                </div>
                                <div class="form-group">
                                    <label for="name">{{ __('main.Name') }}</label>
                                    <input type="text" class="form-control form-control-sm" id="name" name="name" value="">
                                </div>
                                <div class="form-group">
                                    <label for="surname">{{ __('main.Surname') }}</label>
                                    <input type="text" class="form-control form-control-sm" id="surname" name="surname" value="">
                                </div>
                                <div class="form-group">
                                    <label for="phoneNumber">{{ __('main.Phone Number') }}</label>
                                    <input type="text" class="form-control form-control-sm" id="phoneNumber" name="phoneNumber" value="" placeholder="+212612345678">
                                    <small class="text-muted">E.164 format recommended (e.g., +212612345678)</small>
                                </div>
                                <div class="form-group">
                                    <label for="role">{{ __('main.Role') }}</label>
                                    <select name="role" id="role" class="form-control form-control-sm">
                                        <option value="user">{{ __('main.User') }}</option>
                                        <option value="user">{{ __('main.Sales') }}</option>
                                        <option value="admin">{{ __('main.Admin') }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="password">{{ __('main.Password') }}</label>
                                    <input type="text" class="form-control form-control-sm" id="password" name="password" value="">
                                </div>
                                <div class="form-group form-check">
                                    <input type="hidden" name="two_factor_enabled" value="0">
                                    <input type="checkbox" class="form-check-input" id="two_factor_enabled" name="two_factor_enabled" value="1" @if(old('two_factor_enabled')) checked @endif>
                                    <label class="form-check-label" for="two_factor_enabled">Enable 2FA (SMS) <small class="text-muted">(admin/user only)</small></label>
                                    <small class="text-muted d-block">Requires a valid phone number in E.164 format to work.</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">

                    </div>
                    <div class="card" id="save-card">
                        <div class="card-body">
                            <a href="javascript:void(0);" class="btn btn-success btn-sm float-right" id="submit">{{ __('main.Save') }}</a>
                        </div>
                    </div>
                </div>
            </form>
        </div><!-- /.container-fluid -->
    </div><!-- /.content -->
</div>

@endsection

@section('script')

@endsection
