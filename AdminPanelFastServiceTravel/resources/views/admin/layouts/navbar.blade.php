<nav class="main-header navbar navbar-expand navbar-white navbar-light">
  <!-- Left navbar links -->
  <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
    </li>
    @if($auth->role === 'admin')
    <li class="nav-item dropdown d-none d-sm-inline-block">
      <a id="dropdownSubMenu2" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="nav-link dropdown-item dropdown-toggle">{{ __('main.Add New') }}</a>
      <ul aria-labelledby="dropdownSubMenu2" class="dropdown-menu border-0 shadow">
        <li><a href="{{route('admin.page.create')}}" class="dropdown-item">{{ __('main.Sale') }}</a></li>
        <li><a href="{{route('admin.article.create')}}" class="dropdown-item">{{ __('main.Post') }}</a></li>
        <li><a href="{{route('admin.category.create')}}" class="dropdown-item">{{ __('main.Category') }}</a></li>
        <li><a href="{{route('admin.media.create')}}" class="dropdown-item">{{ __('main.Media') }}</a></li>
        <li><a href="{{route('admin.user.create')}}" class="dropdown-item">{{ __('main.User') }}</a></li>
      </ul>
    </li>
    @endif
  </ul>

  <!-- Right navbar links -->
  <ul class="navbar-nav ml-auto">
    @if($auth->role === 'admin')
    <li class="nav-item mr-2">
      <a href="{{ url('/') }}" class="btn btn-outline-primary btn-sm mt-1" target="_blank" rel="noopener">
        <i class="fas fa-external-link-alt"></i> Go to Website
      </a>
    </li>
    @endif
    <!-- Notifications Dropdown Menu -->
    <li class="nav-item dropdown">
      <a class="nav-link" data-toggle="dropdown" href="#">
        <i class="far fa-bell"></i>
        <span class="badge badge-warning navbar-badge">{{ isset($notificationCount) ? $notificationCount : 0 }}</span>
      </a>
      <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
        @if(isset($notificationCount) && $notificationCount > 0)
          <span class="dropdown-header">{{ $notificationCount }} {{ __('main.Notifications') }}</span>
          <div class="dropdown-divider"></div>
          @foreach(($recentNotifications ?? collect()) as $n)
            <a href="{{ $n['route'] }}" class="dropdown-item">
              @if($n['type'] === 'demand')
                <i class="fas fa-passport mr-2"></i>
              @else
                <i class="fas fa-envelope mr-2"></i>
              @endif
              {{ $n['title'] }}
              <span class="float-right text-muted text-sm">{{ $n['created_at'] }}</span>
              <br>
              <small>{{ $n['subtitle'] }}</small>
            </a>
            <div class="dropdown-divider"></div>
          @endforeach
          <a href="{{ route('admin.demand.index') }}" class="dropdown-item dropdown-footer">{{ __('main.See All') }}</a>
        @else
          <span class="dropdown-header">{{ __("main.No Notification") }}</span>
        @endif
      </div>
    </li>
    <!--
        <li class="nav-item">
          <a class="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button"><i class="fas fa-th-large"></i></a>
        </li> 
-->
  </ul>
</nav>