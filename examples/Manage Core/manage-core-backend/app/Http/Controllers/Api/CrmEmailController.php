<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmEmailAccount;
use App\Models\CrmEmailThread;
use App\Models\CrmEmail;
use App\Models\CrmEmailTemplate;
use App\Models\CrmEmailSignature;
use App\Models\CrmEmailWebhook;
use App\Models\CrmEmailEvent;
use App\Services\Crm\Email\EmailProviderFactory;
use App\Services\Crm\CrmEmailService;
use App\Jobs\Crm\SyncEmailAccountJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class CrmEmailController extends Controller
{
    public function __construct(
        private CrmEmailService $emailService
    ) {
    }

    // ============ Email Accounts ============
    public function indexAccounts(Request $request): JsonResponse
    {
        $query = CrmEmailAccount::query();
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('account_name', 'like', "%{$search}%")
                  ->orWhere('email_address', 'like', "%{$search}%");
            });
        }
        foreach (['provider', 'status', 'user_id'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        $sort = $request->input('sort', '-created_at');
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $query->orderBy(ltrim($sort, '-'), $direction);
        $items = $query->paginate($request->input('per_page', 25));
        // Strip tokens before response
        $items->getCollection()->transform(fn($a) => $a->makeHidden(['access_token', 'refresh_token', 'smtp_password', 'imap_password']));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function storeAccount(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'account_name' => 'required|string|max:255',
            'email_address' => 'required|email|max:255',
            'display_name' => 'nullable|string|max:255',
            'provider' => 'required|in:gmail,microsoft,smtp,imap',
            'connection_type' => 'nullable|in:oauth,smtp,imap',
            'code' => 'nullable|string',
            'smtp_host' => 'nullable|string',
            'smtp_port' => 'nullable|integer',
            'smtp_username' => 'nullable|string',
            'smtp_password' => 'nullable|string',
            'smtp_encryption' => 'nullable|in:tls,ssl,none',
            'imap_host' => 'nullable|string',
            'imap_port' => 'nullable|integer',
            'imap_username' => 'nullable|string',
            'imap_password' => 'nullable|string',
            'imap_encryption' => 'nullable|in:ssl,tls,none',
            'is_default' => 'nullable|boolean',
            'track_opens' => 'nullable|boolean',
            'track_clicks' => 'nullable|boolean',
        ]);

        $data = collect($validated)->only([
            'account_name', 'email_address', 'display_name', 'provider',
            'smtp_host', 'smtp_port', 'smtp_username', 'smtp_encryption',
            'imap_host', 'imap_port', 'imap_username', 'imap_encryption',
            'is_default', 'track_opens', 'track_clicks',
        ])->toArray();

        if (!empty($validated['is_default'])) {
            CrmEmailAccount::query()->update(['is_default' => false]);
        }

        if ($validated['provider'] === 'smtp' || $validated['provider'] === 'imap') {
            $data['connection_type'] = $validated['provider'];
        } else {
            $data['connection_type'] = 'oauth';
        }

        // Try to connect
        try {
            $provider = EmailProviderFactory::make($validated['provider']);
            $creds = $provider->connect(array_merge($validated, [
                'smtp_password' => $validated['smtp_password'] ?? null,
                'imap_password' => $validated['imap_password'] ?? null,
            ]));
            $data = array_merge($data, $creds);
        } catch (\Throwable $e) {
            if ($validated['provider'] !== 'smtp' && $validated['provider'] !== 'imap') {
                return response()->json(['success' => false, 'message' => 'Connection failed: ' . $e->getMessage()], 422);
            }
        }

        $data['user_id'] = auth()->id();
        $data['status'] = 'active';

        $account = CrmEmailAccount::create($data);
        return response()->json(['success' => true, 'data' => $account->makeHidden(['access_token', 'refresh_token', 'smtp_password', 'imap_password'])], 201);
    }

    public function showAccount($id): JsonResponse
    {
        $account = CrmEmailAccount::findOrFail($id);
        return response()->json(['success' => true, 'data' => $account->makeHidden(['access_token', 'refresh_token', 'smtp_password', 'imap_password'])]);
    }

    public function updateAccount(Request $request, $id): JsonResponse
    {
        $account = CrmEmailAccount::findOrFail($id);
        $validated = $request->validate([
            'account_name' => 'sometimes|string|max:255',
            'display_name' => 'nullable|string',
            'is_default' => 'nullable|boolean',
            'track_opens' => 'nullable|boolean',
            'track_clicks' => 'nullable|boolean',
            'status' => 'nullable|in:active,paused,disconnected,error',
        ]);
        if (!empty($validated['is_default'])) {
            CrmEmailAccount::where('id', '!=', $id)->update(['is_default' => false]);
        }
        $account->update($validated);
        return response()->json(['success' => true, 'data' => $account->fresh()->makeHidden(['access_token', 'refresh_token', 'smtp_password', 'imap_password'])]);
    }

    public function destroyAccount($id): JsonResponse
    {
        $account = CrmEmailAccount::findOrFail($id);
        $account->delete();
        return response()->json(['success' => true, 'message' => 'Account disconnected']);
    }

    public function syncAccount($id): JsonResponse
    {
        $account = CrmEmailAccount::findOrFail($id);
        SyncEmailAccountJob::dispatch($account->id);
        $account->update(['sync_status' => 'queued']);
        return response()->json(['success' => true, 'message' => 'Sync queued']);
    }

    public function pauseSync($id): JsonResponse
    {
        $account = CrmEmailAccount::findOrFail($id);
        $account->update(['sync_status' => 'paused']);
        return response()->json(['success' => true, 'data' => $account]);
    }

    public function resumeSync($id): JsonResponse
    {
        $account = CrmEmailAccount::findOrFail($id);
        $account->update(['sync_status' => 'idle']);
        SyncEmailAccountJob::dispatch($account->id);
        return response()->json(['success' => true, 'data' => $account]);
    }

    public function testAccount($id): JsonResponse
    {
        $account = CrmEmailAccount::findOrFail($id);
        try {
            $provider = EmailProviderFactory::for($account);
            // For OAuth providers, test by refreshing token
            if ($account->isOAuth()) {
                $provider->refreshToken($account);
            }
            return response()->json(['success' => true, 'message' => 'Connection OK']);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function getOAuthUrl(Request $request): JsonResponse
    {
        $provider = $request->input('provider', 'gmail');
        if ($provider === 'gmail') {
            $clientId = config('services.gmail.client_id', env('GMAIL_CLIENT_ID'));
            $redirect = config('services.gmail.redirect', env('GMAIL_REDIRECT_URI'));
            if (!$clientId || !$redirect) {
                return response()->json(['success' => false, 'message' => 'Gmail OAuth not configured'], 422);
            }
            $params = http_build_query([
                'client_id' => $clientId,
                'redirect_uri' => $redirect,
                'response_type' => 'code',
                'scope' => 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
                'access_type' => 'offline',
                'prompt' => 'consent',
                'state' => csrf_token(),
            ]);
            return response()->json(['success' => true, 'data' => ['url' => "https://accounts.google.com/o/oauth2/v2/auth?{$params}"]]);
        }
        if ($provider === 'microsoft') {
            $clientId = config('services.microsoft.client_id', env('MS_CLIENT_ID'));
            $redirect = config('services.microsoft.redirect', env('MS_REDIRECT_URI'));
            $tenant = config('services.microsoft.tenant_id', env('MS_TENANT_ID', 'common'));
            if (!$clientId || !$redirect) {
                return response()->json(['success' => false, 'message' => 'Microsoft OAuth not configured'], 422);
            }
            $params = http_build_query([
                'client_id' => $clientId,
                'response_type' => 'code',
                'redirect_uri' => $redirect,
                'response_mode' => 'query',
                'scope' => 'openid profile email offline_access Mail.ReadWrite Mail.Send',
                'state' => csrf_token(),
            ]);
            return response()->json(['success' => true, 'data' => ['url' => "https://login.microsoftonline.com/{$tenant}/oauth2/v2.0/authorize?{$params}"]]);
        }
        return response()->json(['success' => false, 'message' => 'Provider does not require OAuth'], 422);
    }

    // ============ Inbox / Emails ============
    public function inbox(Request $request): JsonResponse
    {
        $query = CrmEmail::query();
        $folder = $request->input('folder', 'inbox');
        $query->where('folder', $folder);
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('from_email', 'like', "%{$search}%")
                  ->orWhere('from_name', 'like', "%{$search}%")
                  ->orWhere('to_emails', 'like', "%{$search}%")
                  ->orWhere('body_text', 'like', "%{$search}%");
            });
        }
        foreach (['is_read', 'is_starred', 'entity_type', 'email_account_id'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        if ($request->input('unread_only') === 'true') $query->where('is_read', false);

        $sort = $request->input('sort', '-received_at');
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $query->orderBy(ltrim($sort, '-'), $direction);

        $items = $query->paginate($request->input('per_page', 25));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function showEmail($id): JsonResponse
    {
        $email = CrmEmail::with(['attachments', 'events', 'account:id,email_address,display_name', 'template:id,name'])->findOrFail($id);
        if (!$email->is_read) {
            $email->update(['is_read' => true]);
            $email->thread?->where('unread_count', '>', 0)->decrement('unread_count');
            CrmEmailEvent::create(['email_id' => $email->id, 'event_type' => 'read', 'occurred_at' => now()]);
        }
        return response()->json(['success' => true, 'data' => $email]);
    }

    public function sendEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'to' => 'required|string',
            'cc' => 'nullable|string',
            'bcc' => 'nullable|string',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'body_html' => 'nullable|string',
            'account_id' => 'nullable|integer|exists:crm_email_accounts,id',
            'template_id' => 'nullable|integer|exists:crm_email_templates,id',
            'signature_id' => 'nullable|integer|exists:crm_email_signatures,id',
            'entity_type' => 'nullable|string',
            'entity_id' => 'nullable|integer',
            'schedule_at' => 'nullable|date',
            'track_opens' => 'nullable|boolean',
            'track_clicks' => 'nullable|boolean',
            'attachments' => 'nullable|array',
        ]);

        $account = CrmEmailAccount::find($validated['account_id'] ?? null)
            ?? CrmEmailAccount::where('status', 'active')->where('is_default', true)->first()
            ?? CrmEmailAccount::where('status', 'active')->first();
        if (!$account) {
            return response()->json(['success' => false, 'message' => 'No active email account'], 422);
        }

        $body = $validated['body'] ?? '';
        if (!empty($validated['signature_id'])) {
            $sig = CrmEmailSignature::find($validated['signature_id']);
            if ($sig) $body .= "\n\n" . $sig->body;
        }

        $email = CrmEmail::create([
            'email_account_id' => $account->id,
            'template_id' => $validated['template_id'] ?? null,
            'direction' => 'outbound',
            'folder' => 'sent',
            'from_email' => $account->email_address,
            'from_name' => $account->display_name ?? $account->email_address,
            'to_emails' => $validated['to'],
            'cc_emails' => $validated['cc'] ?? null,
            'bcc_emails' => $validated['bcc'] ?? null,
            'subject' => $validated['subject'],
            'body_html' => $body,
            'body_text' => strip_tags($body),
            'status' => !empty($validated['schedule_at']) ? 'scheduled' : 'queued',
            'is_scheduled' => !empty($validated['schedule_at']),
            'scheduled_at' => $validated['schedule_at'] ?? null,
            'track_opens' => $validated['track_opens'] ?? true,
            'track_clicks' => $validated['track_clicks'] ?? true,
            'user_id' => auth()->id(),
            'entity_type' => $validated['entity_type'] ?? null,
            'entity_id' => $validated['entity_id'] ?? null,
        ]);

        if (!empty($validated['schedule_at'])) {
            // scheduled
        } else {
            SendEmailJob::dispatch($email->id);
        }

        return response()->json(['success' => true, 'data' => $email->fresh()], 201);
    }

    public function replyEmail(Request $request, $id): JsonResponse
    {
        $original = CrmEmail::findOrFail($id);
        $validated = $request->validate([
            'subject' => 'required|string',
            'body' => 'required|string',
            'reply_all' => 'nullable|boolean',
        ]);

        $to = $original->from_email;
        $cc = $original->cc_emails;
        if (empty($validated['reply_all'])) $cc = null;

        $request->merge([
            'to' => $to,
            'cc' => $cc,
            'subject' => str_starts_with($validated['subject'], 'Re:') ? $validated['subject'] : 'Re: ' . $validated['subject'],
            'body' => $validated['body'],
            'entity_type' => $original->entity_type,
            'entity_id' => $original->entity_id,
        ]);

        return $this->sendEmail($request);
    }

    public function updateEmail(Request $request, $id): JsonResponse
    {
        $email = CrmEmail::findOrFail($id);
        $validated = $request->validate([
            'is_read' => 'nullable|boolean',
            'is_starred' => 'nullable|boolean',
            'folder' => 'nullable|in:inbox,sent,drafts,scheduled,archive,trash,spam',
        ]);
        $email->update($validated);
        return response()->json(['success' => true, 'data' => $email->fresh()]);
    }

    public function destroyEmail($id): JsonResponse
    {
        $email = CrmEmail::findOrFail($id);
        $email->delete();
        return response()->json(['success' => true, 'message' => 'Email deleted']);
    }

    public function bulkEmailAction(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'action' => 'required|in:read,unread,star,unstar,archive,delete,move',
            'folder' => 'nullable|string',
        ]);

        $count = 0;
        foreach (CrmEmail::whereIn('id', $validated['ids'])->get() as $email) {
            switch ($validated['action']) {
                case 'read': $email->update(['is_read' => true]); break;
                case 'unread': $email->update(['is_read' => false]); break;
                case 'star': $email->update(['is_starred' => true]); break;
                case 'unstar': $email->update(['is_starred' => false]); break;
                case 'archive': $email->update(['folder' => 'archive']); break;
                case 'move': $email->update(['folder' => $validated['folder'] ?? 'archive']); break;
                case 'delete': $email->delete(); break;
            }
            $count++;
        }
        return response()->json(['success' => true, 'count' => $count]);
    }

    public function folderStats(Request $request): JsonResponse
    {
        $folders = ['inbox', 'sent', 'drafts', 'scheduled', 'archive', 'trash', 'spam'];
        $stats = [];
        foreach ($folders as $f) {
            $stats[] = [
                'folder' => $f,
                'total' => CrmEmail::where('folder', $f)->count(),
                'unread' => CrmEmail::where('folder', $f)->where('is_read', false)->count(),
            ];
        }
        return response()->json(['success' => true, 'data' => $stats]);
    }

    public function createFromRecord(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'entity_type' => 'required|string',
            'entity_id' => 'required|integer',
            'create_type' => 'required|in:lead,contact,deal,task,followup',
        ]);

        $modelClass = match ($validated['entity_type']) {
            'lead' => \App\Models\CrmLead::class,
            'contact' => \App\Models\CrmContact::class,
            'deal' => \App\Models\CrmDeal::class,
            'customer' => \App\Models\CrmCustomer::class,
            default => null,
        };
        if (!$modelClass) return response()->json(['success' => false, 'message' => 'Invalid entity'], 422);
        $entity = $modelClass::find($validated['entity_id']);
        if (!$entity) return response()->json(['success' => false, 'message' => 'Record not found'], 404);

        switch ($validated['create_type']) {
            case 'lead':
                $count = \App\Models\CrmLead::count() + 1;
                $lead = \App\Models\CrmLead::create([
                    'code' => 'LEAD-' . str_pad((string) $count, 5, '0', STR_PAD_LEFT),
                    'name' => $entity->name ?? ($entity->first_name ?? '') . ' ' . ($entity->last_name ?? ''),
                    'email' => $entity->email ?? null,
                    'phone' => $entity->phone ?? null,
                    'company' => $entity->company ?? null,
                    'source' => 'email',
                    'status' => 'new',
                    'created_by' => auth()->id(),
                ]);
                return response()->json(['success' => true, 'data' => $lead], 201);
            case 'task':
                $task = \App\Models\CrmTask::create([
                    'title' => 'Task from email',
                    'description' => 'Auto-created from email',
                    'due_date' => now()->addDay(),
                    'status' => 'todo',
                    'assigned_to' => auth()->id(),
                    'created_by' => auth()->id(),
                ]);
                return response()->json(['success' => true, 'data' => $task], 201);
            case 'followup':
                $followup = \App\Models\CrmFollowUp::create([
                    'subject' => 'Follow-up from email',
                    'type' => 'email',
                    'status' => 'pending',
                    'due_at' => now()->addDays(2),
                    'lead_id' => $entity instanceof \App\Models\CrmLead ? $entity->id : null,
                    'contact_id' => $entity instanceof \App\Models\CrmContact ? $entity->id : null,
                    'customer_id' => $entity instanceof \App\Models\CrmCustomer ? $entity->id : null,
                    'assigned_to' => auth()->id(),
                    'created_by' => auth()->id(),
                ]);
                return response()->json(['success' => true, 'data' => $followup], 201);
        }
        return response()->json(['success' => false, 'message' => 'Unknown create type'], 422);
    }

    // ============ Threads ============
    public function showThread($id): JsonResponse
    {
        $thread = CrmEmailThread::with(['emails.attachments', 'account:id,email_address'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $thread]);
    }

    public function indexThreads(Request $request): JsonResponse
    {
        $query = CrmEmailThread::query();
        if ($search = $request->input('search')) {
            $query->where('subject', 'like', "%{$search}%");
        }
        foreach (['is_starred', 'is_archived', 'is_trash', 'entity_type'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        $query->orderBy('last_message_at', 'desc');
        $items = $query->paginate($request->input('per_page', 25));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    // ============ Templates ============
    public function indexTemplates(Request $request): JsonResponse
    {
        $query = CrmEmailTemplate::query();
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });
        }
        if ($request->filled('category')) $query->where('category', $request->input('category'));
        $items = $query->paginate($request->input('per_page', 25));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function storeTemplate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'category' => 'nullable|string|max:50',
            'is_shared' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'variables' => 'nullable|array',
        ]);
        $validated['owner_id'] = auth()->id();
        $validated['created_by'] = auth()->id();
        $template = CrmEmailTemplate::create($validated);
        return response()->json(['success' => true, 'data' => $template], 201);
    }

    public function updateTemplate(Request $request, $id): JsonResponse
    {
        $template = CrmEmailTemplate::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'subject' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'category' => 'nullable|string|max:50',
            'is_shared' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'variables' => 'nullable|array',
        ]);
        $template->update($validated);
        return response()->json(['success' => true, 'data' => $template->fresh()]);
    }

    public function destroyTemplate($id): JsonResponse
    {
        $template = CrmEmailTemplate::findOrFail($id);
        $template->delete();
        return response()->json(['success' => true, 'message' => 'Template deleted']);
    }

    public function duplicateTemplate($id): JsonResponse
    {
        $template = CrmEmailTemplate::findOrFail($id);
        $new = $template->replicate();
        $new->name = $template->name . ' (Copy)';
        $new->save();
        return response()->json(['success' => true, 'data' => $new], 201);
    }

    public function previewTemplate(Request $request, $id): JsonResponse
    {
        $template = CrmEmailTemplate::findOrFail($id);
        $variables = $request->input('variables', []);
        $subject = $template->subject;
        $body = $template->body;
        foreach ($variables as $k => $v) {
            $subject = str_replace('{{' . $k . '}}', $v, $subject);
            $body = str_replace('{{' . $k . '}}', $v, $body);
        }
        return response()->json(['success' => true, 'data' => ['subject' => $subject, 'body' => $body]]);
    }

    // ============ Signatures ============
    public function indexSignatures(Request $request): JsonResponse
    {
        $query = CrmEmailSignature::query();
        if ($request->filled('user_id')) $query->where('user_id', $request->input('user_id'));
        $items = $query->paginate($request->input('per_page', 25));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }

    public function storeSignature(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'body' => 'required|string',
            'is_default' => 'nullable|boolean',
            'is_shared' => 'nullable|boolean',
        ]);
        $validated['user_id'] = auth()->id();
        $validated['created_by'] = auth()->id();
        if (!empty($validated['is_default'])) {
            CrmEmailSignature::where('user_id', auth()->id())->update(['is_default' => false]);
        }
        $sig = CrmEmailSignature::create($validated);
        return response()->json(['success' => true, 'data' => $sig], 201);
    }

    public function updateSignature(Request $request, $id): JsonResponse
    {
        $sig = CrmEmailSignature::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'is_default' => 'nullable|boolean',
            'is_shared' => 'nullable|boolean',
        ]);
        if (!empty($validated['is_default'])) {
            CrmEmailSignature::where('user_id', $sig->user_id)->update(['is_default' => false]);
        }
        $sig->update($validated);
        return response()->json(['success' => true, 'data' => $sig->fresh()]);
    }

    public function destroySignature($id): JsonResponse
    {
        $sig = CrmEmailSignature::findOrFail($id);
        $sig->delete();
        return response()->json(['success' => true, 'message' => 'Signature deleted']);
    }

    // ============ Tracking ============
    public function trackOpen($id): \Illuminate\Http\Response
    {
        $email = CrmEmail::findOrFail($id);
        $this->emailService->trackOpen($email->id, request()->ip(), request()->userAgent());
        return $this->pixel();
    }

    protected function pixel(): \Illuminate\Http\Response
    {
        $pixel = base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        return response($pixel, 200, ['Content-Type' => 'image/gif']);
    }

    public function trackClick(Request $request, $id): \Illuminate\Http\RedirectResponse
    {
        $email = CrmEmail::findOrFail($id);
        $url = $request->input('url', '/');
        $this->emailService->trackClick($email->id, $url, request()->ip(), request()->userAgent());
        return redirect()->away($url);
    }

    // ============ Webhooks ============
    public function gmailWebhook(Request $request): JsonResponse
    {
        $webhook = CrmEmailWebhook::create([
            'provider' => 'gmail',
            'event_id' => $request->input('message.messageId', uniqid()),
            'event_type' => 'message.created',
            'payload' => $request->all(),
            'received_at' => now(),
        ]);
        \App\Jobs\Crm\ProcessEmailWebhookJob::dispatch($webhook->id);
        return response()->json(['success' => true]);
    }

    public function microsoftWebhook(Request $request): JsonResponse
    {
        $webhook = CrmEmailWebhook::create([
            'provider' => 'microsoft',
            'event_id' => uniqid(),
            'event_type' => 'created',
            'payload' => $request->all(),
            'received_at' => now(),
        ]);
        \App\Jobs\Crm\ProcessEmailWebhookJob::dispatch($webhook->id);
        return response()->json(['success' => true]);
    }

    public function indexWebhooks(Request $request): JsonResponse
    {
        $query = CrmEmailWebhook::query();
        foreach (['provider', 'event_type', 'processed'] as $f) {
            if ($request->filled($f)) $query->where($f, $request->input($f));
        }
        $items = $query->orderBy('received_at', 'desc')->paginate($request->input('per_page', 25));
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(), 'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(), 'total' => $items->total(),
            ],
        ]);
    }
}