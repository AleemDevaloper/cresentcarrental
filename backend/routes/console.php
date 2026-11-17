<?php
use Illuminate\Support\Facades\Artisan;
Artisan::command('crescent:status', function () { $this->info('Crescent Car Rental API is installed.'); });
