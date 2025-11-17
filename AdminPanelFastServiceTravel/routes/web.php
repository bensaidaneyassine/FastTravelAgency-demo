<?php

use App\Models\Page;
use App\Models\Slug;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', function () {
    // Hardcoded home page id – may not exist in some environments (fresh DB / not seeded)
    $homeId = '65fef821c7f1137eca08d62d';
    $page = Page::find($homeId);

    if (!$page) {
        // If this backend is being used purely as an API (e.g. via port 18080) return a lightweight JSON
        if (request()->wantsJson() || str_starts_with(request()->path(), 'api') || request()->header('Accept') === 'application/json') {
            return response()->json([
                'status' => 'ok',
                'note'   => 'Home page record not found (seed data missing).',
                'expected_page_id' => $homeId,
            ]);
        }
        // Fallback simple response (avoid fatal error Attempt to read property "slug_id" on null)
        return response('Home page not found – seed the pages table or adjust root route.', 200);
    }

    $slug = $page->slug_id ? Slug::find($page->slug_id) : null;
    return view('index', compact(['page', 'slug']));
})->name('home');

// Simple health check (useful for API base testing without triggering view logic)
Route::get('/health', function(){
    return response()->json(['status' => 'ok', 'ts' => now()->toIso8601String()]);
});

Route::post('/ajax', [App\Http\Controllers\Admin\AjaxController::class, 'ajax'])->name('ajax')->middleware('isAdmin');

Route::get('/lang/{lang}', [App\Http\Controllers\LangController::class, 'lang'])->name('lang');

Route::post('/logout', [App\Http\Controllers\LoginController::class, 'logout'])->name('logout');
Route::get('/login', [App\Http\Controllers\LoginController::class, 'login'])->name('login');
Route::post('/login', [App\Http\Controllers\LoginController::class, 'loginCheck'])->name('login.check');
Route::get('/register', [App\Http\Controllers\LoginController::class, 'registerUser'])->name('register.user');
Route::post('/register', [App\Http\Controllers\LoginController::class, 'register'])->name('register');
Route::get('/me', function(){ return Auth::check() ? Auth::user() : response()->json(null,204); });

// Admin and User (Sub-Admin) routes
Route::prefix('admin')->name('admin.')->middleware(['isAdminOrUser','admin.2fa'])->group(function () {
    // Two-Factor routes (middleware allows these without being verified)
    Route::get('/2fa/challenge', [App\Http\Controllers\Admin\TwoFactorController::class, 'challenge'])->name('2fa.challenge');
    Route::post('/2fa/send', [App\Http\Controllers\Admin\TwoFactorController::class, 'send'])->name('2fa.send');
    Route::post('/2fa/verify', [App\Http\Controllers\Admin\TwoFactorController::class, 'verify'])->name('2fa.verify');
    Route::get('/home', [App\Http\Controllers\LoginController::class, 'admin'])->name('home');
    Route::post('/media/storeMedia', [App\Http\Controllers\Admin\FileController::class, 'storeMedia'])->name('media.storeMedia');
    Route::resource('/media', 'App\Http\Controllers\Admin\FileController');
    Route::resource('/category', 'App\Http\Controllers\Admin\CategoryController');
    Route::resource('/slide', 'App\Http\Controllers\Admin\SlideController');

    Route::get('/article/switch', [App\Http\Controllers\Admin\ArticleController::class, 'switch'])->name('article.switch');
    Route::get('/article/trash', [App\Http\Controllers\Admin\ArticleController::class, 'trash'])->name('article.trash');
    Route::get('/article/delete/{id}', [App\Http\Controllers\Admin\ArticleController::class, 'delete'])->name('article.delete');
    Route::get('/article/recover/{id}', [App\Http\Controllers\Admin\ArticleController::class, 'recover'])->name('article.recover');
    Route::resource('/article', 'App\Http\Controllers\Admin\ArticleController');

    Route::get('/page/switch', [App\Http\Controllers\Admin\PageController::class, 'switch'])->name('page.switch');
    Route::get('/page/trash', [App\Http\Controllers\Admin\PageController::class, 'trash'])->name('page.trash');
    Route::get('/page/delete/{id}', [App\Http\Controllers\Admin\PageController::class, 'delete'])->name('page.delete');
    Route::get('/page/recover/{id}', [App\Http\Controllers\Admin\PageController::class, 'recover'])->name('page.recover');
    Route::resource('/page', 'App\Http\Controllers\Admin\PageController');

    Route::get('/comment/switch', [App\Http\Controllers\Admin\CommentController::class, 'switch'])->name('comment.switch');
    Route::get('/comment/trash', [App\Http\Controllers\Admin\CommentController::class, 'trash'])->name('comment.trash');
    Route::get('/comment/delete/{id}', [App\Http\Controllers\Admin\CommentController::class, 'delete'])->name('comment.delete');
    Route::get('/comment/recover/{id}', [App\Http\Controllers\Admin\CommentController::class, 'recover'])->name('comment.recover');
    Route::resource('/comment', 'App\Http\Controllers\Admin\CommentController');

    Route::get('/user/trash', [App\Http\Controllers\Admin\UserController::class, 'trash'])->name('user.trash');
    Route::get('/user/delete/{id}', [App\Http\Controllers\Admin\UserController::class, 'delete'])->name('user.delete');
    Route::get('/user/recover/{id}', [App\Http\Controllers\Admin\UserController::class, 'recover'])->name('user.recover');
    Route::resource('/user', 'App\Http\Controllers\Admin\UserController');

    Route::prefix('/visa')->name('visa.')->group(function(){
        Route::resource('/category', 'App\Http\Controllers\Admin\VisaCategoryController');
        Route::resource('/country', 'App\Http\Controllers\Admin\VisaCountryController');
        Route::resource('/student', 'App\Http\Controllers\Admin\VisaStudentController');
        Route::resource('/announcement', 'App\Http\Controllers\Admin\VisaAnnouncementController');
    Route::get('/country/{country}/delete', [App\Http\Controllers\Admin\VisaCountryController::class, 'destroy'])->name('country.delete');
        Route::get('/country/{country}/topic/{topic}', [App\Http\Controllers\Admin\VisaLessonController::class, 'create'])->name('lesson.create');
        Route::get('/lesson/{lesson}', [App\Http\Controllers\Admin\VisaLessonController::class, 'edit'])->name('lesson.edit');
        Route::post('/lesson/{lesson}', [App\Http\Controllers\Admin\VisaLessonController::class, 'update'])->name('lesson.update');
        Route::get('/lesson/{lesson}/delete', [App\Http\Controllers\Admin\VisaLessonController::class, 'delete'])->name('lesson.delete');
        Route::post('/country/{country}/topic/{topic}', [App\Http\Controllers\Admin\VisaLessonController::class, 'store'])->name('lesson.store');
        Route::get('/country/{country}/topic/{topic}/zoom', [App\Http\Controllers\Admin\VisaZoomController::class, 'create'])->name('zoom.create');
        Route::get('/zoom', [App\Http\Controllers\Admin\VisaZoomController::class, 'index'])->name('zoom.index');
        Route::get('/zoom/{lesson}', [App\Http\Controllers\Admin\VisaZoomController::class, 'edit'])->name('zoom.edit');
        Route::post('/zoom/{lesson}', [App\Http\Controllers\Admin\VisaZoomController::class, 'update'])->name('zoom.update');
        Route::get('/zoom/{lesson}/delete', [App\Http\Controllers\Admin\VisaZoomController::class, 'delete'])->name('zoom.delete');
        Route::post('/country/{country}/topic/{topic}/zoom', [App\Http\Controllers\Admin\VisaZoomController::class, 'store'])->name('zoom.store');
    });

    Route::prefix('/sales')->name('sales.')->group(function(){
        Route::resource('/order', 'App\Http\Controllers\Admin\SalesOrderController');
        Route::resource('/invoice', 'App\Http\Controllers\Admin\SalesInvoiceController');
    });

    Route::prefix('/option')->name('option.')->group(function(){
        Route::get('/index', [App\Http\Controllers\Admin\OptionController::class, 'index'])->name('index');
        Route::post('/update', [App\Http\Controllers\Admin\OptionController::class, 'update'])->name('update');

        Route::get('/contact', [App\Http\Controllers\Admin\OptionController::class, 'contact'])->name('contact');
        Route::post('/contactUpdate', [App\Http\Controllers\Admin\OptionController::class, 'contactUpdate'])->name('contactUpdate');

    // (moved contact messages routes out of option group)

        Route::get('/social', [App\Http\Controllers\Admin\OptionController::class, 'social'])->name('social');
        Route::post('/socialUpdate', [App\Http\Controllers\Admin\OptionController::class, 'socialUpdate'])->name('socialUpdate');

        Route::get('/menu/position', [App\Http\Controllers\Admin\MenuController::class, 'position'])->name('menu.position');
        Route::get('/menu/delete/{menu}', [App\Http\Controllers\Admin\MenuController::class, 'delete'])->name('menu.delete');
        Route::post('/menu/menu-name', [App\Http\Controllers\Admin\MenuController::class, 'menuName'])->name('menu.menuName');
        Route::resource('/menu', 'App\Http\Controllers\Admin\MenuController');

        Route::get('/widget', [App\Http\Controllers\Admin\OptionController::class, 'widget'])->name('widget');
        Route::post('/widgetUpdate', [App\Http\Controllers\Admin\OptionController::class, 'widgetUpdate'])->name('widgetUpdate');

        Route::resource('/redirect', 'App\Http\Controllers\Admin\RedirectController');
        Route::resource('/link', 'App\Http\Controllers\Admin\LinkController');
    });

    Route::prefix('/demand')->name('demand.')->group(function(){
        Route::get('/index', [App\Http\Controllers\Admin\DemandController::class, 'index'])->name('index');
        Route::get('/show/{id}', [App\Http\Controllers\Admin\DemandController::class, 'show'])->name('show');
    Route::get('/edit/{id}', [App\Http\Controllers\Admin\DemandController::class, 'edit'])->name('edit');
    Route::put('/update/{id}', [App\Http\Controllers\Admin\DemandController::class, 'update'])->name('update');
    Route::delete('/{id}', [App\Http\Controllers\Admin\DemandController::class, 'destroy'])->name('destroy');
    Route::get('/download/{id}/{hash}', [App\Http\Controllers\Admin\DemandController::class, 'download'])->where('hash','[A-Za-z0-9=\-_]+')->name('download');
    });

    // Contact messages (top-level under /admin)
    Route::prefix('/contact-messages')->name('contact-messages.')->group(function(){
        Route::get('/', [App\Http\Controllers\Admin\ContactMessageController::class, 'index'])->name('index');
        Route::get('/{id}', [App\Http\Controllers\Admin\ContactMessageController::class, 'show'])->name('show');
    });
});

// Catch-all route for dynamic URLs
Route::get(
    '/{url}/{url2?}/{url3?}/',
    [App\Http\Controllers\RouteController::class, 'route']
)->middleware('slashes')->middleware('redirect')->name('route');