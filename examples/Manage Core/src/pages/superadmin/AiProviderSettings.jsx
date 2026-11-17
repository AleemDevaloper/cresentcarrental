import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Card, CardContent, Button, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Switch, FormControlLabel, Chip, Tooltip, Alert, Snackbar,
    Select, MenuItem, InputLabel, FormControl,
} from '@mui/material';
import {
    Add, Edit, Delete, CheckCircle, RadioButtonUnchecked,
    Cloud, Code, Refresh, PlayArrow,
} from '@mui/icons-material';
import { listAiProviders, createAiProvider, updateAiProvider, deleteAiProvider, testAiProvider } from '../../api/ai';

const PROVIDER_TYPES = ['openrouter', 'openai', 'anthropic', 'google', 'custom'];

export default function AiProviderSettings() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialog, setDialog] = useState({ open: false, mode: 'add', data: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listAiProviders();
            setProviders(data);
        } catch {
            showSnackbar('Failed to load providers', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    function showSnackbar(message, severity = 'success') {
        setSnackbar({ open: true, message, severity });
    }

    async function handleSave(data) {
        try {
            if (dialog.mode === 'add') {
                await createAiProvider(data);
                showSnackbar('Provider created');
            } else {
                await updateAiProvider(dialog.data.id, data);
                showSnackbar('Provider updated');
            }
            setDialog({ open: false, mode: 'add', data: null });
            fetch();
        } catch (e) {
            showSnackbar(e.response?.data?.message || 'Operation failed', 'error');
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this provider?')) return;
        try {
            await deleteAiProvider(id);
            showSnackbar('Provider deleted');
            fetch();
        } catch {
            showSnackbar('Failed to delete', 'error');
        }
    }

    async function handleTest(id) {
        try {
            const res = await testAiProvider(id);
            showSnackbar(res.message || 'Test successful');
        } catch (e) {
            showSnackbar(e.response?.data?.message || 'Test failed', 'error');
        }
    }

    async function handleSetDefault(provider) {
        if (provider.is_default) return;
        try {
            await updateAiProvider(provider.id, { is_default: true });
            showSnackbar('Default provider updated');
            fetch();
        } catch {
            showSnackbar('Failed to set default', 'error');
        }
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    AI Provider Settings
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setDialog({ open: true, mode: 'add', data: null })}
                    sx={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                    Add Provider
                </Button>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 2 }}>
                {providers.map(p => (
                    <Card key={p.id} sx={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(12px)',
                        border: p.is_default ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 3,
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Cloud sx={{ color: p.is_active ? '#6366f1' : 'text.disabled' }} />
                                    <Typography variant="h6" fontWeight={600}>{p.name}</Typography>
                                    {p.is_default && <Chip label="Default" size="small" color="primary" />}
                                </Box>
                                <Box>
                                    <IconButton size="small" onClick={() => setDialog({ open: true, mode: 'edit', data: p })}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(p.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                <Chip label={p.provider_type} size="small" variant="outlined" />
                                <Chip label={p.default_model || 'No default model'} size="small" variant="outlined" />
                                {p.has_api_key && <Chip label="API Key set" size="small" color="success" variant="outlined" />}
                            </Box>

                            {p.base_url && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontFamily: 'monospace', fontSize: 12 }}>
                                    {p.base_url}
                                </Typography>
                            )}

                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Tooltip title="Test connection">
                                    <Button size="small" variant="outlined" startIcon={<PlayArrow />} onClick={() => handleTest(p.id)}>
                                        Test
                                    </Button>
                                </Tooltip>
                                {!p.is_default && (
                                    <Button size="small" variant="outlined" startIcon={<CheckCircle />} onClick={() => handleSetDefault(p)}>
                                        Set Default
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {!loading && providers.length === 0 && (
                <Card sx={{ p: 4, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                    <Cloud sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">No AI providers configured yet</Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>Add an OpenRouter or OpenAI provider to get started</Typography>
                </Card>
            )}

            <ProviderDialog
                open={dialog.open}
                mode={dialog.mode}
                data={dialog.data}
                onClose={() => setDialog({ open: false, mode: 'add', data: null })}
                onSave={handleSave}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function ProviderDialog({ open, mode, data, onClose, onSave }) {
    const [form, setForm] = useState({
        name: '', provider_type: 'openrouter', api_key: '', base_url: '',
        default_model: '', available_models: '', is_active: true, is_default: false,
    });

    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || '',
                provider_type: data.provider_type || 'openrouter',
                api_key: '',
                base_url: data.base_url || '',
                default_model: data.default_model || '',
                available_models: (data.available_models || []).join(', '),
                is_active: data.is_active ?? true,
                is_default: data.is_default ?? false,
            });
        } else {
            setForm({ name: '', provider_type: 'openrouter', api_key: '', base_url: '', default_model: '', available_models: '', is_active: true, is_default: false });
        }
    }, [data, open]);

    function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            ...form,
            api_key: form.api_key || undefined,
            available_models: form.available_models ? form.available_models.split(',').map(s => s.trim()).filter(Boolean) : [],
        };
        if (mode === 'edit' && !payload.api_key) delete payload.api_key;
        onSave(payload);
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{mode === 'add' ? 'Add Provider' : 'Edit Provider'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField label="Provider Name" required fullWidth value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        <FormControl fullWidth>
                            <InputLabel>Provider Type</InputLabel>
                            <Select value={form.provider_type} label="Provider Type"
                                onChange={e => setForm(f => ({ ...f, provider_type: e.target.value }))}>
                                {PROVIDER_TYPES.map(t => <MenuItem key={t} value={t}>{t.toUpperCase()}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField label="API Key" fullWidth type="password" value={form.api_key}
                            placeholder={mode === 'edit' ? 'Leave blank to keep existing' : ''}
                            onChange={e => setForm(f => ({ ...f, api_key: e.target.value }))} />
                        <TextField label="Base URL" fullWidth value={form.base_url}
                            placeholder="https://openrouter.ai/api/v1"
                            onChange={e => setForm(f => ({ ...f, base_url: e.target.value }))} />
                        <TextField label="Default Model" fullWidth value={form.default_model}
                            placeholder="openrouter/free"
                            onChange={e => setForm(f => ({ ...f, default_model: e.target.value }))} />
                        <TextField label="Available Models (comma-separated)" fullWidth multiline rows={2}
                            value={form.available_models}
                            placeholder="openai/gpt-4o, anthropic/claude-3.5-sonnet"
                            onChange={e => setForm(f => ({ ...f, available_models: e.target.value }))} />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControlLabel control={
                                <Switch checked={form.is_active}
                                    onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                            } label="Active" />
                            <FormControlLabel control={
                                <Switch checked={form.is_default}
                                    onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))} />
                            } label="Default" />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {mode === 'add' ? 'Create' : 'Update'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
