<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Demand;

$demand = new Demand();
$demand->status = 'pending';
$demand->demandType = 'visa';
$demand->applicantName = 'Test User';
$demand->email = 'test@example.com';
$demand->phoneNumber = '+0000000000';
$demand->save();

echo "Inserted demand with id: ".$demand->_id."\n";
