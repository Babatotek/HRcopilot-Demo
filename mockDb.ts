// Mock Firebase implementation using localStorage
export const auth = { signOut: () => Promise.resolve() };
export const db = {};

export function signInAnonymously() {
  return Promise.resolve({ user: { uid: 'demo-user' } });
}

export function collection(db: any, path: string) {
  return { path };
}

export function doc(dbOrCol: any, ...pathSegments: string[]) {
  if (pathSegments.length === 0) {
    if (dbOrCol.path) {
      return { path: dbOrCol.path + '/' + Math.random().toString(36).substring(2), id: Math.random().toString(36).substring(2) };
    }
  }
  return { path: pathSegments.join('/'), id: pathSegments[pathSegments.length - 1] };
}

export function query(col: any, ...args: any[]) {
  return { ...col, queryArgs: args };
}

export function orderBy(field: string, direction: string = 'asc') {
  return { type: 'orderBy', field, direction };
}

export function where(field: string, operator: string, value: any) {
  return { type: 'where', field, operator, value };
}

export function serverTimestamp() {
  return new Date().toISOString();
}

function getLocalData(path: string) {
  try {
    const data = localStorage.getItem(`mock_db_${path}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalData(path: string, data: any[]) {
  localStorage.setItem(`mock_db_${path}`, JSON.stringify(data));
  const listeners = snapshotListeners.get(path) || [];
  listeners.forEach(listener => listener());
}

const snapshotListeners = new Map<string, Array<() => void>>();

export function onSnapshot(q: any, callback: (snapshot: any) => void) {
  const path = q.path;
  
  const triggerCallback = () => {
    let data = getLocalData(path);
    
    // Naive sorting/filtering based on query args
    if (q.queryArgs) {
      const orderArg = q.queryArgs.find((a: any) => a.type === 'orderBy');
      if (orderArg) {
        data.sort((a: any, b: any) => {
          if (a[orderArg.field] < b[orderArg.field]) return orderArg.direction === 'asc' ? -1 : 1;
          if (a[orderArg.field] > b[orderArg.field]) return orderArg.direction === 'asc' ? 1 : -1;
          return 0;
        });
      }
      const whereArg = q.queryArgs.find((a: any) => a.type === 'where');
      if (whereArg) {
        data = data.filter((item: any) => {
          if (whereArg.operator === '==') return item[whereArg.field] === whereArg.value;
          return true;
        });
      }
    }

    callback({
      docs: data.map((item: any) => ({
        id: item.id,
        data: () => item
      }))
    });
  };

  triggerCallback();

  const listeners = snapshotListeners.get(path) || [];
  listeners.push(triggerCallback);
  snapshotListeners.set(path, listeners);

  return () => {
    const arr = snapshotListeners.get(path) || [];
    snapshotListeners.set(path, arr.filter(l => l !== triggerCallback));
  };
}

export function addDoc(col: any, data: any) {
  const path = col.path;
  const items = getLocalData(path);
  const newItem = { ...data, id: Math.random().toString(36).substring(2) };
  items.push(newItem);
  setLocalData(path, items);
  return Promise.resolve({ id: newItem.id });
}

export function setDoc(docRef: any, data: any, options?: any) {
  const parts = docRef.path.split('/');
  const docId = parts.pop();
  const path = parts.join('/');
  const items = getLocalData(path);
  const existingIdx = items.findIndex((i: any) => i.id === docId);
  
  const mergedData = { ...data, id: docId };
  if (options?.merge && existingIdx >= 0) {
    items[existingIdx] = { ...items[existingIdx], ...mergedData };
  } else if (existingIdx >= 0) {
    items[existingIdx] = mergedData;
  } else {
    items.push(mergedData);
  }
  
  setLocalData(path, items);
  return Promise.resolve();
}

export function updateDoc(docRef: any, data: any) {
  const parts = docRef.path.split('/');
  const docId = parts.pop();
  const path = parts.join('/');
  const items = getLocalData(path);
  const existingIdx = items.findIndex((i: any) => i.id === docId);
  
  if (existingIdx >= 0) {
    items[existingIdx] = { ...items[existingIdx], ...data };
    setLocalData(path, items);
  }
  return Promise.resolve();
}
