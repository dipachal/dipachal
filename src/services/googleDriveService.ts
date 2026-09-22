import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { app, auth } from '../firebase';

export const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts'
];

const provider = new GoogleAuthProvider();
// Add requested Drive scopes
DRIVE_SCOPES.forEach(scope => provider.addScope(scope));

// In-memory token cache (NEVER in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (!isSigningIn) {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithGoogleDrive = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive OAuth access token');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const signOutGoogleDrive = async (): Promise<void> => {
  await auth.signOut();
  cachedAccessToken = null;
};

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

// List files from Google Drive
export const listDriveFiles = async (
  token: string, 
  searchTerm?: string,
  folderId?: string
): Promise<DriveFileItem[]> => {
  try {
    let q = "trashed = false";
    if (folderId) {
      q += ` and '${folderId}' in parents`;
    }
    if (searchTerm && searchTerm.trim()) {
      q += ` and name contains '${searchTerm.replace(/'/g, "\\'")}'`;
    }

    const url = `https://www.googleapis.com/drive/v3/files?pageSize=50&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink)&orderBy=modifiedTime desc&q=${encodeURIComponent(q)}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to fetch files: HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (err: any) {
    console.error('listDriveFiles error:', err);
    throw err;
  }
};

// Find or create "Dwipachal Enterprise Backups" folder
export const getOrCreateDwipachalFolder = async (token: string): Promise<string> => {
  const folderName = 'Dwipachal Enterprise Backups';
  // Search for folder
  const q = `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`;
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  if (!createRes.ok) {
    throw new Error('Failed to create folder in Google Drive');
  }

  const newFolder = await createRes.json();
  return newFolder.id;
};

// Upload JSON backup to Google Drive
export const uploadBackupToGoogleDrive = async (
  token: string, 
  backupData: any, 
  fileName?: string
): Promise<{ id: string; name: string; webViewLink?: string }> => {
  const name = fileName || `Dwipachal_Enterprise_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  const folderId = await getOrCreateDwipachalFolder(token).catch(() => undefined);

  const metadata: any = {
    name,
    mimeType: 'application/json',
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(backupData, null, 2) +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to upload backup to Google Drive');
  }

  return await res.json();
};

// Download backup JSON from Google Drive
export const downloadBackupFromGoogleDrive = async (token: string, fileId: string): Promise<any> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to download file: HTTP ${res.status}`);
  }

  return await res.json();
};

// Delete file from Google Drive (MUST be called with prior user confirmation)
export const deleteFileFromGoogleDrive = async (token: string, fileId: string): Promise<void> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete file: HTTP ${res.status}`);
  }
};
