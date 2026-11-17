<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use App\Services\Ams\ChartOfAccountsImportExportService;

$svc = new ChartOfAccountsImportExportService();

$path = 'C:\xampp\htdocs\Manage Core\chart_of_accounts_template (1).csv';
$tmpPath = tempnam(sys_get_temp_dir(), 'coa_test_') . '.csv';
copy($path, $tmpPath);
echo "Reading: $path\n";
echo "Temp: $tmpPath\n";

$uploaded = new UploadedFile($tmpPath, 'chart_of_accounts_template.csv', 'text/csv', null, true);
$request = Request::create('/import', 'POST');
$request->files->set('file', $uploaded);

echo "Calling importCsv...\n";
try {
    $response = $svc->importCsv($request);
    echo "Response class: " . get_class($response) . "\n";
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Content-Type: " . $response->headers->get('Content-Type') . "\n";
    $body = $response->getContent();
    echo "Body (first 500 chars):\n";
    echo substr($body, 0, 500) . "\n";
    echo "---\n";
    echo "Decoded:\n";
    $decoded = json_decode($body, true);
    var_export($decoded);
} catch (\Throwable $e) {
    echo "EXCEPTION: " . get_class($e) . "\n";
    echo "Message: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

@unlink($tmpPath);
