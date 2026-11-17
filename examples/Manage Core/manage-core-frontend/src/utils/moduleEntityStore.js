const ACTIVE_PREFIX = 'manage_core_module_active__';
const TRASH_PREFIX = 'manage_core_module_trash__';
const RESET_FLAG_PREFIX = 'manage_core_module_reset__';
const RESET_VERSION = 1;

const activeKey = (system, entity) => `${ACTIVE_PREFIX}${system}__${entity}`;
const trashKey = (system) => `${TRASH_PREFIX}${system}`;

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function loadEntityList(system, entity, seed = []) {
  try {
    const raw = localStorage.getItem(activeKey(system, entity));
    if (raw === null) {
      writeEntityList(system, entity, seed);
      return Array.isArray(seed) ? [...seed] : [];
    }
    const parsed = safeParse(raw, seed);
    return Array.isArray(parsed) ? parsed : [...seed];
  } catch {
    return Array.isArray(seed) ? [...seed] : [];
  }
}

export function resetPersistedData(system, entities, version = RESET_VERSION) {
  try {
    const flagKey = `${RESET_FLAG_PREFIX}${system}`;
    if (localStorage.getItem(flagKey) === String(version)) return;
    (entities || []).forEach((entity) => localStorage.removeItem(activeKey(system, entity)));
    localStorage.removeItem(trashKey(system));
    localStorage.setItem(flagKey, String(version));
  } catch {
    // storage unavailable; nothing to purge
  }
}

export function writeEntityList(system, entity, records) {
  try {
    localStorage.setItem(activeKey(system, entity), JSON.stringify(records || []));
  } catch {
    // private/incognito may block storage
  }
}

export function getTrashItems(system) {
  try {
    const parsed = safeParse(localStorage.getItem(trashKey(system)), []);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeTrashItems(system, items) {
  try {
    localStorage.setItem(trashKey(system), JSON.stringify(items || []));
  } catch {
    // private/incognito may block storage
  }
}

/**
 * Soft-delete a record: remove from active list and push into system trash.
 * @returns {{ list: any[], trashItem: object }}
 */
export function softDeleteRecord({
  system,
  entity,
  entityLabel,
  records,
  record,
  idKey = 'id',
  title,
  deletedBy = 'Admin',
}) {
  const recordId = record?.[idKey];
  const nextList = (records || []).filter((row) => row?.[idKey] !== recordId);
  writeEntityList(system, entity, nextList);

  const trashItem = {
    trashId: `${system}_${entity}_${recordId}_${Date.now()}`,
    system,
    entity,
    entityLabel: entityLabel || entity,
    recordId,
    idKey,
    title: title || String(recordId ?? 'Item'),
    data: record,
    deletedAt: new Date().toISOString(),
    deletedBy,
  };

  const trash = [trashItem, ...getTrashItems(system)];
  writeTrashItems(system, trash);
  return { list: nextList, trashItem };
}

export function restoreTrashItem(system, trashId) {
  const trash = getTrashItems(system);
  const item = trash.find((t) => t.trashId === trashId);
  if (!item) return null;

  const active = loadEntityList(system, item.entity, []);
  const exists = active.some((row) => row?.[item.idKey] === item.recordId);
  const nextActive = exists ? active : [item.data, ...active];
  writeEntityList(system, item.entity, nextActive);
  writeTrashItems(system, trash.filter((t) => t.trashId !== trashId));
  return item;
}

export function forceDeleteTrashItem(system, trashId) {
  const trash = getTrashItems(system);
  writeTrashItems(system, trash.filter((t) => t.trashId !== trashId));
}

export function purgeAllTrash(system) {
  writeTrashItems(system, []);
}

export function mergeImportedRecords(system, entity, currentList, importedRows, mapRow, idKey = 'id') {
  if (!Array.isArray(importedRows) || importedRows.length === 0) {
    return currentList;
  }

  const mapped = importedRows
    .map((row, index) => mapRow(row, index, currentList))
    .filter(Boolean);

  const byId = new Map();
  [...currentList, ...mapped].forEach((row) => {
    const key = row?.[idKey];
    if (key === undefined || key === null) return;
    byId.set(key, row);
  });

  const next = Array.from(byId.values());
  writeEntityList(system, entity, next);
  return next;
}
