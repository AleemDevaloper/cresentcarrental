<?php

namespace App\Support;

use App\Models\AppSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectFileStorage
{
    public const STORAGE_PATH_KEY = 'project_storage_path';

    public function settingsPayload(): array
    {
        $configuredPath = $this->configuredBasePath();
        $status = $this->pathStatus($configuredPath);

        return [
            'storagePath' => $configuredPath,
            'storageStatus' => $status['label'],
            'storageStatusMessage' => $status['message'],
            'isStoragePathValid' => $status['valid'],
            'defaultStoragePath' => $this->defaultBasePath(),
        ];
    }

    public function configuredBasePath(): string
    {
        return $this->normalizeConfiguredPath(
            AppSetting::getValue(self::STORAGE_PATH_KEY, $this->defaultBasePath())
        );
    }

    public function defaultBasePath(): string
    {
        return 'C:\ManageCore\Projects';
    }

    public function normalizeConfiguredPath(?string $path): string
    {
        $trimmed = trim((string) $path);

        if ($trimmed === '') {
            return $this->defaultBasePath();
        }

        return rtrim($trimmed, "\\/");
    }

    public function isAbsolutePath(string $path): bool
    {
        return preg_match('/^(?:[A-Za-z]:[\\\\\\/]|\\\\\\\\|\/)/', $path) === 1;
    }

    public function pathStatus(string $path): array
    {
        if (!$this->isAbsolutePath($path)) {
            return [
                'valid' => false,
                'label' => 'Invalid',
                'message' => 'Use a full absolute path like C:\\PMS\\Projects or D:\\CompanyFiles\\Projects.',
            ];
        }

        if (File::exists($path)) {
            if (!File::isDirectory($path)) {
                return [
                    'valid' => false,
                    'label' => 'Invalid',
                    'message' => 'The selected path exists but is not a folder.',
                ];
            }

            if (!is_writable($path)) {
                return [
                    'valid' => false,
                    'label' => 'Invalid',
                    'message' => 'The selected folder is not writable by the backend.',
                ];
            }

            return [
                'valid' => true,
                'label' => 'Ready',
                'message' => 'The folder exists and is writable.',
            ];
        }

        $parent = dirname($path);
        if ($parent === '' || $parent === '.' || !File::exists($parent) || !File::isDirectory($parent)) {
            return [
                'valid' => false,
                'label' => 'Invalid',
                'message' => 'The parent folder does not exist on the server.',
            ];
        }

        if (!is_writable($parent)) {
            return [
                'valid' => false,
                'label' => 'Invalid',
                'message' => 'The parent folder is not writable by the backend.',
            ];
        }

        return [
            'valid' => true,
            'label' => 'Ready',
            'message' => 'The folder will be created automatically on the first upload.',
        ];
    }

    public function validationMessageForConfiguredPath(string $path): ?string
    {
        $status = $this->pathStatus($this->normalizeConfiguredPath($path));

        return $status['valid'] ? null : $status['message'];
    }

    public function storeUploadedFile(UploadedFile $file): array
    {
        $directory = $this->resolveWritableDirectory();
        \Illuminate\Support\Facades\Log::info("Storing file in: " . $directory);
        
        File::ensureDirectoryExists($directory);
        if (!is_writable($directory)) {
            throw new \Exception("Storage directory is not writable: " . $directory);
        }

        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeName = Str::slug($name) ?: 'project-file';
        $extension = $file->getClientOriginalExtension();
        $filename = $safeName.'-'.Str::random(8).($extension ? '.'.$extension : '');

        $size = $file->getSize();
        $file->move($directory, $filename);

        return [
            'path' => $directory.DIRECTORY_SEPARATOR.$filename,
            'size' => $size,
        ];
    }

    private function resolveWritableDirectory(): string
    {
        $configured = $this->configuredBasePath();
        if ($this->isDirectoryWritable($configured)) {
            return $configured;
        }

        // Fallback: use storage/app/public
        $fallback = storage_path('app/public/project-files');
        if ($this->isDirectoryWritable($fallback)) {
            return $fallback;
        }

        // Fallback: use system temp
        $tmpDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'manage-core-project-files';
        File::ensureDirectoryExists($tmpDir);
        return $tmpDir;
    }

    private function isDirectoryWritable(string $path): bool
    {
        try {
            File::ensureDirectoryExists($path);
            return is_writable($path);
        } catch (\Exception $e) {
            return false;
        }
    }

    public function exists(?string $storedPath): bool
    {
        if (!$storedPath) {
            return false;
        }

        if ($this->isAbsolutePath($storedPath)) {
            return File::exists($storedPath);
        }

        return Storage::disk('public')->exists($storedPath);
    }

    public function delete(?string $storedPath): void
    {
        if (!$storedPath) {
            return;
        }

        if ($this->isAbsolutePath($storedPath)) {
            if (File::exists($storedPath)) {
                File::delete($storedPath);
            }

            return;
        }

        Storage::disk('public')->delete($storedPath);
    }

    public function downloadResponse(string $storedPath, string $downloadName)
    {
        if ($this->isAbsolutePath($storedPath)) {
            return response()->download($storedPath, $downloadName);
        }

        return Storage::disk('public')->download($storedPath, $downloadName);
    }

    public function publicUrl(?string $storedPath): ?string
    {
        if (!$storedPath || $this->isAbsolutePath($storedPath)) {
            return null;
        }

        return Storage::disk('public')->url($storedPath);
    }
}
