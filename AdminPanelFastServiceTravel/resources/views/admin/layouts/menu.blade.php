<aside class="main-sidebar sidebar-dark-primary elevation-4">
  <!-- Brand Logo -->
  <a href="{{ url('/') }}" class="brand-link">
    <img src="{{ asset('admin') }}/img/weecode.jpg" alt="WeeCode Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
    <span class="brand-text font-weight-light"><b>Fast</b> Service Travel</span>
  </a>

  <!-- Sidebar -->
  <div class="sidebar">
    <!-- Sidebar user panel (optional) -->
    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
      <div class="image">
        <img src="{{ asset('admin') }}/img/avatar5.png" class="img-circle elevation-2" alt="User Image">
      </div>
      <div class="info">
        <a href="#" class="d-block">{{ $auth->name . " " . $auth->surname }}</a>
      </div>
    </div>

    <!-- Sidebar Menu -->
    <nav class="mt-2">
      <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        <!-- Dashboard -->
        <li class="nav-item">
          <a href="{{ route('admin.home') }}" class="nav-link @if(Request::segment(2) == 'home') active @endif">
            <i class="nav-icon fas fa-tachometer-alt"></i>
            <p>{{ __('main.Dashboard') }}</p>
          </a>
        </li>

        <!-- Visa Section (Visible to Admin and User) -->
        @if($auth->role === 'admin')
        <li class="nav-item has-treeview @if(Request::segment(2) == 'visa') menu-open @endif">
          <a href="{{ route('admin.visa.country.index') }}" class="nav-link @if(Request::segment(3) == 'country') active @endif">
            <i class="nav-icon fas fa-copy"></i>
            <p>{{ __('main.Visas') }} <i class="right fas fa-angle-left"></i></p>
          </a>
          <ul class="nav nav-treeview" style="@if(Request::segment(2) == 'visa') display:block; @endif">
            <li class="nav-item">
              <a href="{{ route('admin.visa.country.index') }}" class="nav-link @if(Request::segment(2) == 'visa' && Request::segment(3) == 'country') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Countries') }}</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="{{ route('admin.visa.category.index') }}" class="nav-link @if(Request::segment(2) == 'visa' && Request::segment(3) == 'category') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Categories') }}</p>
              </a>
            </li>
          </ul>
        </li>
        @endif

        <!-- Media Section (Visible to Admin and User) -->
        @if($auth->role === 'admin')
        <li class="nav-item has-treeview @if(Request::segment(2) == 'media') menu-open @endif">
          <a href="{{ route('admin.media.index') }}" class="nav-link @if(Request::segment(2) == 'media') active @endif">
            <i class="nav-icon fas fa-photo-video"></i>
            <p>{{ __('main.Media') }} <i class="right fas fa-angle-left"></i></p>
          </a>
          <ul class="nav nav-treeview" style="@if(Request::segment(2) == 'media') display:block; @endif">
            <li class="nav-item">
              <a href="{{ route('admin.media.index') }}" class="nav-link @if(Request::segment(2) == 'media' && Request::segment(3) != 'create') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.All Media') }}</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="{{ route('admin.media.create') }}" class="nav-link @if(Request::segment(2) == 'media' && Request::segment(3) == 'create') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Upload') }}</p>
              </a>
            </li>
          </ul>
        </li>
        @endif

        <!-- Pages Section (Visible to Admin and User) -->
        @if($auth->role === 'admin')
        <li class="nav-item has-treeview @if(Request::segment(2) == 'page') menu-open @endif">
          <a href="{{ route('admin.page.index') }}" class="nav-link @if(Request::segment(2) == 'page') active @endif">
            <i class="nav-icon fas fa-copy"></i>
            <p>{{ __('main.Pages') }} <i class="right fas fa-angle-left"></i></p>
          </a>
          <ul class="nav nav-treeview" style="@if(Request::segment(2) == 'page') display:block; @endif">
            <li class="nav-item">
              <a href="{{ route('admin.page.index') }}" class="nav-link @if(Request::segment(2) == 'page' && Request::segment(3) != 'create') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.All Pages') }}</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="{{ route('admin.page.create') }}" class="nav-link @if(Request::segment(2) == 'page' && Request::segment(3) == 'create') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Add New') }}</p>
              </a>
            </li>
          </ul>
        </li>
        @endif

        <!-- Sales Section (Visible to Admin Only) -->
        @if($auth->role === 'admin')
        <li class="nav-item has-treeview @if(Request::segment(2) == 'sales') menu-open @endif">
          <a href="{{ route('admin.sales.order.index') }}" class="nav-link @if(Request::segment(2) == 'sales') active @endif">
            <i class="nav-icon fas fa-money-bill"></i>
            <p>{{ __('main.Sales') }} <i class="right fas fa-angle-left"></i></p>
          </a>
          <ul class="nav nav-treeview" style="@if(Request::segment(2) == 'sales') display:block; @endif">
            <li class="nav-item">
              <a href="{{ route('admin.sales.order.index') }}" class="nav-link @if(Request::segment(2) == 'sales' && Request::segment(3) == 'order') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Orders') }}</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="{{ route('admin.sales.invoice.index') }}" class="nav-link @if(Request::segment(2) == 'sales' && Request::segment(3) == 'invoice') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Invoices') }}</p>
              </a>
            </li>
          </ul>
        </li>
        @endif

        <!-- Demand Section (Visible to Admin Only) -->
        @if($auth->role === 'admin' || $auth->role === 'user')
        <li class="nav-item has-treeview @if(Request::segment(2) == 'demand') menu-open @endif">
          <a href="{{ route('admin.demand.index') }}" class="nav-link @if(Request::segment(2) == 'demand') active @endif">
            <i class="nav-icon fas fa-money-bill"></i>
            <p>{{ __('main.Demands') }} <i class="right fas fa-angle-left"></i></p>
          </a>
          <ul class="nav nav-treeview" style="@if(Request::segment(2) == 'demand') display:block; @endif">
            <li class="nav-item">
              <a href="{{ route('admin.demand.index') }}" class="nav-link @if(Request::segment(2) == 'demand' && Request::segment(3) != 'list') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Demands') }}</p>
              </a>
            </li>
          </ul>
        </li>
        @endif

        <!-- Users Section (Visible to Admin Only) -->
        @if($auth->role === 'admin')
        <li class="nav-item has-treeview @if(Request::segment(2) == 'user') menu-open @endif">
          <a href="{{ route('admin.user.index') }}" class="nav-link @if(Request::segment(2) == 'user') active @endif">
            <i class="nav-icon fas fa-user"></i>
            <p>{{ __('main.Users') }} <i class="right fas fa-angle-left"></i></p>
          </a>
          <ul class="nav nav-treeview" style="@if(Request::segment(2) == 'user') display:block; @endif">
            <li class="nav-item">
              <a href="{{ route('admin.user.index') }}" class="nav-link @if(Request::segment(2) == 'user' && Request::segment(3) != 'create') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.All Users') }}</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="{{ route('admin.user.create') }}" class="nav-link @if(Request::segment(2) == 'user' && Request::segment(3) == 'create') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Add New') }}</p>
              </a>
            </li>
          </ul>
        </li>
        @endif

        <!-- Options Section (Visible to Admin Only) -->
        @if($auth->role === 'admin')
        <li class="nav-item has-treeview @if(Request::segment(2) == 'option') menu-open @endif">
          <a href="{{ route('admin.option.index') }}" class="nav-link @if(Request::segment(2) == 'option') active @endif">
            <i class="nav-icon fas fa-cog"></i>
            <p>{{ __('main.Options') }} <i class="right fas fa-angle-left"></i></p>
          </a>
          <ul class="nav nav-treeview" style="@if(Request::segment(2) == 'option') display:block; @endif">
            <li class="nav-item">
              <a href="{{ route('admin.option.index') }}" class="nav-link @if(Request::segment(2) == 'option' && Request::segment(3) == 'index') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.General Options') }}</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="{{ route('admin.option.menu.index') }}" class="nav-link @if(Request::segment(2) == 'option' && Request::segment(3) == 'menu') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Menus') }}</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="{{ route('admin.option.contact') }}" class="nav-link @if(Request::segment(2) == 'option' && Request::segment(3) == 'contact') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Contact Information') }}</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="{{ route('admin.option.social') }}" class="nav-link @if(Request::segment(2) == 'option' && Request::segment(3) == 'social') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Social Media') }}</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="{{ route('admin.option.redirect.index') }}" class="nav-link @if(Request::segment(2) == 'option' && Request::segment(3) == 'redirect') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Redirects') }}</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="{{ route('admin.option.link.index') }}" class="nav-link @if(Request::segment(2) == 'option' && Request::segment(3) == 'link') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>{{ __('main.Auto Linkers') }}</p>
              </a>
            </li>
            <li class="nav-item">
              @php $unreadContacts = \App\Models\Contact::where('status','new')->count(); @endphp
              <a href="{{ route('admin.contact-messages.index') }}" class="nav-link @if(Request::segment(2) == 'contact-messages') active @endif">
                <ion-icon name="return-down-forward-outline"></ion-icon>
                <p>Contact Messages @if($unreadContacts>0)<span class="badge badge-danger">{{ $unreadContacts }}</span>@endif</p>
              </a>
            </li>
          </ul>
        </li>
        @endif

        <!-- Logout -->
        <li class="nav-item">
          <form action="{{ route('logout') }}" method="POST">
            @csrf
            <a href="{{ route('logout') }}" class="nav-link" onclick="event.preventDefault(); this.closest('form').submit();">
              <i class="nav-icon fas fa-power-off"></i>
              <p>{{ __('main.Logout') }}</p>
            </a>
          </form>
        </li>
      </ul>
    </nav>
    <!-- /.sidebar-menu -->
  </div>
  <!-- /.sidebar -->
</aside>