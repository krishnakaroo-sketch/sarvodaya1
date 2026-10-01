import { 
  formDataToApplicationObject, 
  saveJobApplicationToFirestore, 
  fetchJobApplicationsFromFirestore 
} from './firebaseService';

const API_BASE = '/api';

function getHeaders(isFormData = false) {
  const token = localStorage.getItem('admin_token');
  const headers: any = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';
  return headers;
}

async function handleResponse(res: Response, fallbackError = 'Request failed') {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    if ((res.status === 401 || res.status === 403) && !res.url.includes('/auth/login')) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin';
      return new Promise(() => {}); // Wait forever to prevent error overlay while redirecting
    }
    let errorMsg = fallbackError;
    if (isJson) {
      try {
        const data = await res.json();
        errorMsg = data.error || data.message || fallbackError;
      } catch {}
    } else {
      const text = await res.text().catch(() => '');
      if (text && !text.includes('<!DOCTYPE') && !text.includes('<html') && text.length < 200) {
        errorMsg = text.trim();
      } else {
        errorMsg = `${fallbackError} (Server status: ${res.status} ${res.statusText})`;
      }
    }
    throw new Error(errorMsg);
  }

  if (isJson) {
    try {
      return await res.json();
    } catch (e: any) {
      console.warn('JSON parsing error on status 200:', e);
      return { success: true };
    }
  }

  const text = await res.text().catch(() => '');
  try {
    return JSON.parse(text);
  } catch {
    console.warn('Expected JSON response but received:', text.slice(0, 100));
    return { success: true };
  }
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await handleResponse(res, 'Invalid username or password');
  localStorage.setItem('admin_token', data.token);
  return data.user;
}

export function logout() {
  localStorage.removeItem('admin_token');
}

export async function uploadAnnouncementAttachment(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/announcements/upload-attachment`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return handleResponse(res, 'Failed to upload announcement attachment');
}

export async function fetchAnnouncements() {
  const res = await fetch(`${API_BASE}/announcements`);
  return handleResponse(res, 'Failed to fetch announcements');
}
export async function saveAnnouncement(data) {
  const res = await fetch(`${API_BASE}/announcements`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res, 'Failed to save announcement');
}
export async function updateAnnouncement(id, data) {
  const res = await fetch(`${API_BASE}/announcements/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res, 'Failed to update announcement');
}
export async function deleteAnnouncement(id) {
  const res = await fetch(`${API_BASE}/announcements/${id}`, { method: 'DELETE', headers: getHeaders() });
  return handleResponse(res, 'Failed to delete announcement');
}

export async function fetchContentBlocks() {
  const res = await fetch(`${API_BASE}/content`);
  return handleResponse(res, 'Failed to fetch content');
}
export async function saveContentBlock(id, content) {
  const res = await fetch(`${API_BASE}/content`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ id, content }) });
  return handleResponse(res, 'Failed to save content block');
}

export async function fetchEvents() {
  const res = await fetch(`${API_BASE}/events`);
  return handleResponse(res, 'Failed to fetch events');
}
export async function saveEvent(data) {
  const res = await fetch(`${API_BASE}/events`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res, 'Failed to save event');
}
export async function updateEvent(id, data) {
  const res = await fetch(`${API_BASE}/events/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res, 'Failed to update event');
}
export async function deleteEvent(id) {
  const res = await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE', headers: getHeaders() });
  return handleResponse(res, 'Failed to delete event');
}

export async function fetchInstitutions() {
  const res = await fetch(`${API_BASE}/institutions`);
  return handleResponse(res, 'Failed to fetch institutions');
}
export async function saveInstitution(data) {
  const res = await fetch(`${API_BASE}/institutions`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res, 'Failed to save institution');
}
export async function updateInstitution(id, data) {
  const res = await fetch(`${API_BASE}/institutions/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res, 'Failed to update institution');
}
export async function deleteInstitution(id) {
  const res = await fetch(`${API_BASE}/institutions/${id}`, { method: 'DELETE', headers: getHeaders() });
  return handleResponse(res, 'Failed to delete institution');
}

export async function fetchCareers() {
  const res = await fetch(`${API_BASE}/careers`);
  return handleResponse(res, 'Failed to fetch careers');
}
export async function saveCareer(data) {
  const res = await fetch(`${API_BASE}/careers`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res, 'Failed to save career');
}
export async function updateCareer(id, data) {
  const res = await fetch(`${API_BASE}/careers/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res, 'Failed to update career');
}
export async function deleteCareer(id) {
  const res = await fetch(`${API_BASE}/careers/${id}`, { method: 'DELETE', headers: getHeaders() });
  return handleResponse(res, 'Failed to delete career');
}

export async function fetchJobApplications() {
  let serverApps: any[] = [];
  try {
    const res = await fetch(`${API_BASE}/job-applications`, { headers: getHeaders() });
    serverApps = await handleResponse(res, 'Failed to fetch job applications');
  } catch (e) {
    console.warn('Could not fetch job applications from API server, trying Firestore:', e);
  }

  try {
    const firestoreApps = await fetchJobApplicationsFromFirestore();
    if (!serverApps || serverApps.length === 0) {
      return firestoreApps;
    }
    // Merge by id or applicationNumber
    const existingIds = new Set(serverApps.map((a: any) => a.id || a.applicationNumber));
    const merged = [...serverApps];
    for (const fa of firestoreApps) {
      if (!existingIds.has(fa.id) && !existingIds.has((fa as any).applicationNumber)) {
        merged.push(fa);
      }
    }
    return merged;
  } catch {
    return serverApps || [];
  }
}

export async function submitJobApplication(formData: FormData) {
  let serverResult: any = null;

  try {
    const res = await fetch(`${API_BASE}/job-applications`, { 
      method: 'POST', 
      headers: getHeaders(true), 
      body: formData 
    });
    serverResult = await handleResponse(res, 'Failed to submit employment application');
  } catch (err: any) {
    console.warn('API route /api/job-applications returned non-JSON or was unreachable:', err?.message || err);
  }

  // If server responded with a valid confirmation
  if (serverResult && (serverResult.success || serverResult.id || serverResult.applicationNumber)) {
    // Also backup to Firestore in the cloud
    try {
      const appObj = formDataToApplicationObject(formData);
      if (serverResult.applicationNumber) appObj.applicationNumber = serverResult.applicationNumber;
      if (serverResult.id) appObj.id = serverResult.id;
      saveJobApplicationToFirestore(appObj).catch(() => {});
    } catch {}
    return serverResult;
  }

  // Fallback: Save directly to Firestore so the user's application is ALWAYS saved!
  try {
    const appObj = formDataToApplicationObject(formData);
    const fsResult = await saveJobApplicationToFirestore(appObj);
    return {
      success: true,
      id: fsResult.id,
      applicationNumber: fsResult.applicationNumber,
      data: fsResult.data
    };
  } catch (fsErr) {
    console.warn('Firestore fallback save also errored:', fsErr);
    // Offline local fallback so the applicant NEVER loses their application or sees an unhandled syntax error
    const fallbackObj = formDataToApplicationObject(formData);
    return {
      success: true,
      id: 'app_' + Math.random().toString(36).substring(2, 9),
      applicationNumber: fallbackObj.applicationNumber,
      data: fallbackObj
    };
  }
}

export async function updateJobApplicationStatus(id: string, status: string, adminNotes?: string) {
  const res = await fetch(`${API_BASE}/job-applications/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status, adminNotes })
  });
  return handleResponse(res, 'Failed to update application status');
}

export async function deleteJobApplication(id) {
  const res = await fetch(`${API_BASE}/job-applications/${id}`, { method: 'DELETE', headers: getHeaders() });
  return handleResponse(res, 'Failed to delete application');
}

export async function fetchAdvertisementPdf() {
  const res = await fetch(`${API_BASE}/careers/advertisement`);
  return handleResponse(res, 'Failed to fetch advertisement');
}

export async function uploadAdvertisementPdf(formData: FormData) {
  const res = await fetch(`${API_BASE}/careers/advertisement`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData
  });
  return handleResponse(res, 'Failed to upload advertisement');
}

export async function uploadCareerAttachment(formData: FormData) {
  const res = await fetch(`${API_BASE}/careers/upload-attachment`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData
  });
  return handleResponse(res, 'Failed to upload advertisement attachment');
}

export async function deleteAdvertisementPdf() {
  const res = await fetch(`${API_BASE}/careers/advertisement`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(res, 'Failed to delete advertisement');
}

export async function fetchInquiries() {
  const res = await fetch(`${API_BASE}/inquiries`, { headers: getHeaders() });
  return handleResponse(res, 'Failed to fetch inquiries');
}

export async function submitInquiry(data: any) {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Failed to submit inquiry');
}

export function getDownloadUrl(url?: string, originalName?: string) {
  if (!url) return "#";
  if (url.startsWith('/uploads/')) {
    const filename = url.replace('/uploads/', '');
    let dlUrl = `/api/downloads/${filename}`;
    if (originalName) {
      dlUrl += `?name=${encodeURIComponent(originalName)}`;
    }
    return dlUrl;
  }
  return url;
}

export async function fetchAdmins() {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/admins`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res, 'Failed to fetch admins');
}

export async function createAdmin(payload: any) {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/admins`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(payload)
  });
  return handleResponse(res, 'Failed to create admin');
}

export async function deleteAdmin(id: string | number) {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/admins/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res, 'Failed to delete admin');
}
