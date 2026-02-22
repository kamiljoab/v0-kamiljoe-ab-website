/**
 * ============================================
 * INSTRUKCJA - Google Apps Script File Upload
 * ============================================
 * 
 * 1. Wejdz na https://script.google.com
 * 2. Utworz nowy projekt ("New project")
 * 3. Wklej caly ten kod (zastap domyslna zawartosc)
 * 4. Kliknij "Deploy" -> "New deployment"
 * 5. Type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. Kliknij "Deploy" i skopiuj URL
 * 9. Wklej URL do zmiennej NEXT_PUBLIC_GAS_UPLOAD_URL w Vercel
 * 
 * Skrypt tworzy folder "Kamiljo_Uploads" na Twoim Google Drive
 * i zapisuje tam pliki z formularza, chunkowane po 500KB.
 */

// ---- CONFIG ----
const ROOT_FOLDER_NAME = "Kamiljo_Uploads";

function getOrCreateFolder(name) {
  const folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(name);
}

function getOrCreateSubFolder(parent, name) {
  const folders = parent.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return parent.createFolder(name);
}

// Handle CORS preflight
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === "initUpload") {
      return handleInitUpload(data);
    }
    if (action === "uploadChunk") {
      return handleUploadChunk(data);
    }
    if (action === "finalizeUpload") {
      return handleFinalizeUpload(data);
    }
    if (action === "formSubmit") {
      return handleFormSubmit(data);
    }

    return jsonResponse({ success: false, error: "Unknown action: " + action });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function handleInitUpload(data) {
  // Create a session folder for this upload
  const root = getOrCreateFolder(ROOT_FOLDER_NAME);
  const sessionId = Utilities.getUuid();
  const sessionFolder = getOrCreateSubFolder(root, "session_" + sessionId);

  // Store session info in Properties
  const props = PropertiesService.getScriptProperties();
  props.setProperty("session_" + sessionId, JSON.stringify({
    fileName: data.fileName,
    fileType: data.fileType || "application/octet-stream",
    totalChunks: data.totalChunks,
    receivedChunks: 0,
    folderId: sessionFolder.getId(),
    created: new Date().toISOString()
  }));

  return jsonResponse({ success: true, sessionId: sessionId });
}

function handleUploadChunk(data) {
  const sessionId = data.sessionId;
  const chunkIndex = data.chunkIndex;
  const chunkData = data.chunkData; // base64 string

  const props = PropertiesService.getScriptProperties();
  const sessionStr = props.getProperty("session_" + sessionId);
  if (!sessionStr) {
    return jsonResponse({ success: false, error: "Session not found" });
  }

  const session = JSON.parse(sessionStr);
  const folder = DriveApp.getFolderById(session.folderId);

  // Save chunk as a file
  const chunkBlob = Utilities.newBlob(
    Utilities.base64Decode(chunkData),
    "application/octet-stream",
    "chunk_" + String(chunkIndex).padStart(6, "0")
  );
  folder.createFile(chunkBlob);

  // Update session
  session.receivedChunks = (session.receivedChunks || 0) + 1;
  props.setProperty("session_" + sessionId, JSON.stringify(session));

  return jsonResponse({
    success: true,
    received: session.receivedChunks,
    total: session.totalChunks
  });
}

function handleFinalizeUpload(data) {
  const sessionId = data.sessionId;

  const props = PropertiesService.getScriptProperties();
  const sessionStr = props.getProperty("session_" + sessionId);
  if (!sessionStr) {
    return jsonResponse({ success: false, error: "Session not found" });
  }

  const session = JSON.parse(sessionStr);
  const folder = DriveApp.getFolderById(session.folderId);

  // Collect all chunks in order
  const files = folder.getFiles();
  const chunks = [];
  while (files.hasNext()) {
    const f = files.next();
    chunks.push({ name: f.getName(), blob: f.getBlob() });
  }
  chunks.sort((a, b) => a.name.localeCompare(b.name));

  // Merge all chunks into one file
  const allBytes = [];
  for (const chunk of chunks) {
    const bytes = chunk.blob.getBytes();
    for (let i = 0; i < bytes.length; i++) {
      allBytes.push(bytes[i]);
    }
  }

  const finalBlob = Utilities.newBlob(allBytes, session.fileType, session.fileName);

  // Save to root upload folder
  const root = getOrCreateFolder(ROOT_FOLDER_NAME);
  
  // Create a date-based subfolder
  const today = new Date();
  const dateName = Utilities.formatDate(today, "Europe/Stockholm", "yyyy-MM-dd");
  const dateFolder = getOrCreateSubFolder(root, dateName);
  const finalFile = dateFolder.createFile(finalBlob);

  // Cleanup: remove session folder
  folder.setTrashed(true);
  props.deleteProperty("session_" + sessionId);

  return jsonResponse({
    success: true,
    fileId: finalFile.getId(),
    fileName: session.fileName,
    fileUrl: finalFile.getUrl()
  });
}

function handleFormSubmit(data) {
  // Save form data to a Google Sheet (optional) or just return success
  const root = getOrCreateFolder(ROOT_FOLDER_NAME);
  const today = new Date();
  const dateName = Utilities.formatDate(today, "Europe/Stockholm", "yyyy-MM-dd");
  const dateFolder = getOrCreateSubFolder(root, dateName);

  // Save form data as JSON file
  const formBlob = Utilities.newBlob(
    JSON.stringify(data, null, 2),
    "application/json",
    "form_" + Utilities.formatDate(today, "Europe/Stockholm", "HH-mm-ss") + ".json"
  );
  dateFolder.createFile(formBlob);

  return jsonResponse({ success: true, message: "Form submitted" });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
