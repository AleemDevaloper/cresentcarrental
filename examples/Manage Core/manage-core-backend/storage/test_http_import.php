<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

// Create a fake logged-in user
$user = null;
try {
    $user = User::first();
} catch (\Throwable $e) {
    // tenant connection might not be set up
}
if (!$user) {
    echo "No user found in default connection, trying central\n";
    try {
        $user = \App\Models\User::on('central')->first() ?? \App\Models\User::on('mysql')->first();
    } catch (\Throwable $e) {
        echo "Couldn't find any user, aborting: " . $e->getMessage() . "\n";
        exit(1);
    }
}

$path = 'C:\xampp\htdocs\Manage Core\chart_of_accounts_template (1).csv';
echo "File exists: " . (file_exists($path) ? 'yes' : 'no') . "\n";

$tmp = tempnam(sys_get_temp_dir(), 'imp_') . '.csv';
copy($path, $tmp);

$uploaded = new UploadedFile($tmp, 'chart_of_accounts_template.csv', 'text/csv', null, true);

$request = Request::create('/api/v1/fms/chart-of-accounts-import', 'POST');
$request->files->set('file', $uploaded);
$request->headers->set('Accept', 'application/json');
$request->headers->set('Authorization', 'Bearer test-token');

// Manually authenticate
auth()->login($user);
$request->setUserResolver(fn() => $user);

try {
    $response = $kernel->handle($request);
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Content-Type: " . $response->headers->get('Content-Type') . "\n";
    echo "Body (first 1000):\n" . substr($response->getContent(), 0, 1000) . "\n";
} catch (\Throwable $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
} finally {
    @unlink($tmp);
}
