import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes, faCheck, faSpinner, faCalculator, faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { coaTokens } from './coaTheme';
import { useApp } from '../../../../context/AppContext';
import {
  createAccount, updateAccount,
  listAccountTypes, listAccountGroups,
} from '../../../../api/fms';

const TYPE_OPTIONS = [
  { code: 'asset', label: 'Asset', normal: 'debit' },
  { code: 'liability', label: 'Liability', normal: 'credit' },
  { code: 'equity', label: 'Equity', normal: 'credit' },
  { code: 'revenue', label: 'Revenue', normal: 'credit' },
  { code: 'expense', label: 'Expense', normal: 'debit' },
];

const STATUS_OPTIONS = ['active', 'inactive', 'archived', 'draft'];

const emptyForm = () => ({
  code: '',
  name: '',
  description: '',
  account_type_id: null,
  account_group_id: null,
  parent_id: null,
  parent_code: '',
  normal_balance: 'debit',
  is_control_account: false,
  is_cash_account: false,
  is_bank_account: false,
  allow_manual_entries: true,
  status: 'active',
  tax_category: '',
  currency: 'USD',
  opening_balance: 0,
});

const AccountFormDrawer = ({ isOpen, onClose, onSaved, account, isDark }) => {
  const { addNotification } = useApp();
  const t = coaTokens(isDark);
  const [form, setForm] = useState(emptyForm());
  const [types, setTypes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (account) {
      setForm({
        code: account.code || '',
        name: account.name || '',
        description: account.description || '',
        account_type_id: account.account_type_id ?? account.type?.id ?? null,
        account_group_id: account.account_group_id ?? account.group?.id ?? null,
        parent_id: account.parent_id ?? account.parent?.id ?? null,
        parent_code: account.parent?.code || '',
        normal_balance: account.normal_balance || 'debit',
        is_control_account: !!account.is_control_account,
        is_cash_account: !!account.is_cash_account,
        is_bank_account: !!account.is_bank_account,
        allow_manual_entries: account.allow_manual_entries !== false,
        status: account.status || 'active',
        tax_category: account.tax_category || '',
        currency: account.currency || 'USD',
        opening_balance: account.opening_balance ?? 0,
      });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
    Promise.all([
      listAccountTypes({ per_page: 200 }).catch(() => ({ data: [] })),
      listAccountGroups({ per_page: 200 }).catch(() => ({ data: [] })),
    ]).then(([tRes, gRes]) => {
      const tData = tRes?.data?.data ?? tRes?.data ?? [];
      const gData = gRes?.data?.data ?? gRes?.data ?? [];
      setTypes(Array.isArray(tData) ? tData : []);
      setGroups(Array.isArray(gData) ? gData : []);
    });
  }, [isOpen, account]);

  const filteredGroups = groups.filter(g => !form.account_type_id || g.account_type_id === form.account_type_id);

  const setField = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.code?.trim()) e.code = 'Required';
    if (!form.name?.trim()) e.name = 'Required';
    if (form.opening_balance !== '' && Number.isNaN(Number(form.opening_balance))) {
      e.opening_balance = 'Must be a number';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        opening_balance: Number(form.opening_balance || 0),
        account_type_id: form.account_type_id || null,
        account_group_id: form.account_group_id || null,
        parent_id: form.parent_id || null,
      };
      if (account?.id) {
        await updateAccount(account.id, payload);
        addNotification?.({ type: 'success', message: 'Account updated' });
      } else {
        await createAccount(payload);
        addNotification?.({ type: 'success', message: 'Account created' });
      }
      onSaved?.();
      onClose?.();
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Save failed';
      addNotification?.({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget && !saving) onClose?.(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1080,
        background: isDark ? 'rgba(2,6,23,0.6)' : 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex', justifyContent: 'flex-end',
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        style={{
          width: 'min(560px, 100%)',
          background: t.surface, color: t.text,
          borderLeft: `1px solid ${t.border}`,
          boxShadow: '-8px 0 24px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.1rem 1.5rem',
            borderBottom: `1px solid ${t.border}`,
            background: t.surfaceAlt,
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: t.primarySoft, color: t.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.05rem',
              }}
            >
              <FontAwesomeIcon icon={faCalculator} />
            </div>
            <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
              {account?.id ? 'Edit Account' : 'New Account'}
            </h5>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            style={{
              background: 'transparent', border: 'none',
              color: t.textMuted, fontSize: '1.1rem',
              padding: 8, borderRadius: 8, cursor: 'pointer',
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          <Field
            label="Code *"
            error={errors.code}
            help="Unique account code, e.g. 1000, 5100, 4100-SUB"
          >
            <input
              className="form-control"
              value={form.code}
              onChange={(e) => setField('code', e.target.value.toUpperCase())}
              placeholder="e.g. 1000"
              style={inputStyle(t, !!errors.code)}
            />
          </Field>

          <Field label="Name *" error={errors.name}>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="e.g. Cash on Hand"
              style={inputStyle(t, !!errors.name)}
            />
          </Field>

          <Field label="Description">
            <textarea
              className="form-control"
              rows={2}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Optional"
              style={inputStyle(t)}
            />
          </Field>

          <div className="row g-2">
            <div className="col-6">
              <Field label="Account Type">
                <select
                  className="form-select"
                  value={form.account_type_id || ''}
                  onChange={(e) => setField('account_type_id', e.target.value ? Number(e.target.value) : null)}
                  style={inputStyle(t)}
                >
                  <option value="">— Select type —</option>
                  {types.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name || opt.code}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="col-6">
              <Field label="Account Group">
                <select
                  className="form-select"
                  value={form.account_group_id || ''}
                  onChange={(e) => setField('account_group_id', e.target.value ? Number(e.target.value) : null)}
                  style={inputStyle(t)}
                >
                  <option value="">— None —</option>
                  {filteredGroups.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name || opt.code}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-6">
              <Field label="Parent Code">
                <input
                  className="form-control"
                  value={form.parent_code}
                  onChange={(e) => setField('parent_code', e.target.value)}
                  placeholder="e.g. 1000"
                  style={inputStyle(t)}
                />
              </Field>
            </div>
            <div className="col-6">
              <Field label="Normal Balance">
                <select
                  className="form-select"
                  value={form.normal_balance}
                  onChange={(e) => setField('normal_balance', e.target.value)}
                  style={inputStyle(t)}
                >
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-6">
              <Field label="Currency">
                <input
                  className="form-control"
                  value={form.currency}
                  onChange={(e) => setField('currency', e.target.value.toUpperCase())}
                  style={inputStyle(t)}
                />
              </Field>
            </div>
            <div className="col-6">
              <Field label="Opening Balance" error={errors.opening_balance}>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.opening_balance}
                  onChange={(e) => setField('opening_balance', e.target.value)}
                  style={inputStyle(t, !!errors.opening_balance)}
                />
              </Field>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-6">
              <Field label="Status">
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setField('status', e.target.value)}
                  style={inputStyle(t)}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </Field>
            </div>
            <div className="col-6">
              <Field label="Tax Category">
                <input
                  className="form-control"
                  value={form.tax_category}
                  onChange={(e) => setField('tax_category', e.target.value)}
                  placeholder="Optional"
                  style={inputStyle(t)}
                />
              </Field>
            </div>
          </div>

          <Field label="Account Properties">
            <div className="d-flex flex-wrap gap-2">
              <ToggleChip
                t={t}
                active={form.is_cash_account}
                onClick={() => setField('is_cash_account', !form.is_cash_account)}
                label="Cash account"
              />
              <ToggleChip
                t={t}
                active={form.is_bank_account}
                onClick={() => setField('is_bank_account', !form.is_bank_account)}
                label="Bank account"
              />
              <ToggleChip
                t={t}
                active={form.is_control_account}
                onClick={() => setField('is_control_account', !form.is_control_account)}
                label="Control account"
              />
              <ToggleChip
                t={t}
                active={form.allow_manual_entries}
                onClick={() => setField('allow_manual_entries', !form.allow_manual_entries)}
                label="Manual entries"
              />
            </div>
          </Field>
        </div>

        <div
          style={{
            display: 'flex', justifyContent: 'flex-end', gap: 8,
            padding: '1rem 1.5rem',
            borderTop: `1px solid ${t.border}`,
            background: t.surfaceAlt,
          }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              background: 'transparent', border: `1px solid ${t.border}`,
              color: t.text, padding: '0.5rem 1rem', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 500,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            style={{
              background: t.primary, border: 'none', color: '#fff',
              padding: '0.5rem 1.1rem', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              opacity: saving ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            }}
          >
            {saving ? <><FontAwesomeIcon icon={faSpinner} spin /> Saving…</> : <><FontAwesomeIcon icon={faCheck} /> {account?.id ? 'Update' : 'Create'}</>}
          </button>
        </div>
      </aside>
    </div>
  );
};

const Field = ({ label, error, help, children }) => (
  <div className="mb-3">
    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'inherit', marginBottom: 6, display: 'block' }}>
      {label}
    </label>
    {children}
    {help && !error && <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: 4 }}>{help}</div>}
    {error && (
      <div style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
      </div>
    )}
  </div>
);

const inputStyle = (t, hasError = false) => ({
  background: t.surface,
  color: t.text,
  border: `1px solid ${hasError ? '#ef4444' : t.border}`,
  borderRadius: 8,
  fontSize: '0.85rem',
});

const ToggleChip = ({ t, active, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: '0.4rem 0.75rem',
      borderRadius: 999,
      border: `1px solid ${active ? t.primary : t.border}`,
      background: active ? t.primarySoft : t.surface,
      color: active ? t.primary : t.textMuted,
      fontSize: '0.78rem', fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.15s',
    }}
  >
    {active && <FontAwesomeIcon icon={faCheck} style={{ marginRight: 4, fontSize: '0.7rem' }} />}
    {label}
  </button>
);

export default AccountFormDrawer;
