use chrono::{Utc};
use rusqlite::{params, Connection};
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use tauri::{Manager, State};

pub struct AppState {
    data_dir: Mutex<Option<PathBuf>>,
    db_path: Mutex<Option<PathBuf>>,
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct ExamRecord {
    pub id: String,
    pub title: String,
    pub subject: String,
    pub chapter: String,
    pub year: i32,
    pub session: Option<String>,
    pub file_path: String,
    pub file_type: String,
    pub favorite: bool,
    pub created_at: String,
    pub last_opened_at: Option<String>,
    pub date_modification: Option<String>,
}

#[derive(serde::Deserialize)]
pub struct ExamInput {
    pub id: Option<String>,
    pub title: String,
    pub subject: String,
    pub chapter: String,
    pub year: i32,
    pub session: Option<String>,
    pub file_path: Option<String>,
    pub file_type: Option<String>,
    pub favorite: Option<bool>,
}

#[derive(serde::Deserialize)]
pub struct FileImportInput {
    pub title: String,
    pub subject: String,
    pub chapter: String,
    pub year: i32,
    pub session: Option<String>,
    pub file_name: String,
    pub file_type: String,
    pub content: Vec<u8>,
}

fn generate_id() -> String {
    format!("exam_{}_{}", Utc::now().timestamp_millis(), std::process::id())
}

fn sanitize_filename(filename: &str, fallback: &str) -> String {
    let base = filename
        .replace("\\", "_")
        .replace("/", "_")
        .replace(" ", "_")
        .chars()
        .filter(|ch| ch.is_alphanumeric() || matches!(*ch, '-' | '_' | '.'))
        .collect::<String>();

    let cleaned = if base.trim().is_empty() {
        fallback.to_string()
    } else {
        base
    };

    if cleaned.to_lowercase().ends_with(".pdf") || cleaned.to_lowercase().ends_with(".jpg") || cleaned.to_lowercase().ends_with(".jpeg") || cleaned.to_lowercase().ends_with(".png") {
        cleaned
    } else {
        format!("{}.{}", cleaned, fallback)
    }
}

fn ensure_data_dir(state: &State<AppState>) -> Result<PathBuf, String> {
    let guard = state.data_dir.lock().map_err(|e| e.to_string())?;
    match guard.as_ref() {
        Some(path) => Ok(path.clone()),
        None => Err("Data directory not initialized".to_string()),
    }
}

fn ensure_database(state: &State<AppState>) -> Result<PathBuf, String> {
    let data_dir = ensure_data_dir(state)?;
    let db_path = data_dir.join("examens.db");
    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open SQLite DB: {}", e))?;

    conn.execute_batch(
        r#"
        CREATE TABLE IF NOT EXISTS examens (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            subject TEXT NOT NULL,
            chapter TEXT NOT NULL,
            year INTEGER NOT NULL,
            session TEXT,
            file_path TEXT NOT NULL DEFAULT '',
            file_type TEXT NOT NULL DEFAULT 'pdf',
            date_ajout TEXT NOT NULL,
            date_modification TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS favoris (
            id TEXT PRIMARY KEY,
            examen_id TEXT NOT NULL UNIQUE,
            date_ajout TEXT NOT NULL,
            FOREIGN KEY (examen_id) REFERENCES examens(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS historique (
            id TEXT PRIMARY KEY,
            examen_id TEXT NOT NULL,
            date_ouverture TEXT NOT NULL,
            FOREIGN KEY (examen_id) REFERENCES examens(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS parametres (
            id TEXT PRIMARY KEY,
            cle TEXT NOT NULL UNIQUE,
            valeur TEXT NOT NULL
        );
        "#,
    )
    .map_err(|e| format!("Failed to initialize SQLite schema: {}", e))?;

    Ok(db_path)
}

#[tauri::command]
fn init_database(state: State<AppState>) -> Result<String, String> {
    let db_path = ensure_database(&state)?;
    let mut db_guard = state.db_path.lock().map_err(|e| e.to_string())?;
    *db_guard = Some(db_path.clone());
    Ok(db_path.to_string_lossy().to_string())
}

#[tauri::command]
fn get_app_data_dir(state: State<AppState>) -> Result<String, String> {
    let data_dir = ensure_data_dir(&state)?;
    Ok(data_dir.to_string_lossy().to_string())
}

#[tauri::command]
fn read_file(path: String) -> Result<Vec<u8>, String> {
    fs::read(&path).map_err(|e| format!("Failed to read file: {}", e))
}

#[tauri::command]
fn get_file_metadata(path: String) -> Result<FileMetadata, String> {
    let metadata = fs::metadata(&path).map_err(|e| format!("Failed to get metadata: {}", e))?;
    Ok(FileMetadata {
        size: metadata.len(),
        modified: metadata.modified().ok().and_then(|time| time.duration_since(std::time::UNIX_EPOCH).ok()).map(|d| d.as_secs()),
    })
}

#[derive(serde::Serialize)]
pub struct FileMetadata {
    size: u64,
    modified: Option<u64>,
}

#[tauri::command]
fn create_exam(state: State<AppState>, exam: ExamInput) -> Result<ExamRecord, String> {
    let db_path = ensure_database(&state)?;
    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open DB: {}", e))?;

    let exam_id = exam.id.clone().unwrap_or_else(generate_id);
    let now = Utc::now().to_rfc3339();
    let file_type = exam.file_type.clone().unwrap_or_else(|| "pdf".to_string());

    conn.execute(
        "INSERT INTO examens (id, title, subject, chapter, year, session, file_path, file_type, date_ajout, date_modification) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![
            exam_id,
            exam.title,
            exam.subject,
            exam.chapter,
            exam.year,
            exam.session,
            exam.file_path.unwrap_or_default(),
            file_type,
            now,
            now
        ],
    )
    .map_err(|e| format!("Failed to insert exam: {}", e))?;

    if exam.favorite.unwrap_or(false) {
        conn.execute(
            "INSERT OR REPLACE INTO favoris (id, examen_id, date_ajout) VALUES (?1, ?2, ?3)",
            params![generate_id(), exam_id, now],
        )
        .map_err(|e| format!("Failed to save favorite: {}", e))?;
    }

    Ok(ExamRecord {
        id: exam_id,
        title: exam.title,
        subject: exam.subject,
        chapter: exam.chapter,
        year: exam.year,
        session: exam.session,
        file_path: exam.file_path.unwrap_or_default(),
        file_type,
        favorite: exam.favorite.unwrap_or(false),
        created_at: now.clone(),
        last_opened_at: None,
        date_modification: Some(now),
    })
}

#[tauri::command]
fn list_exams(state: State<AppState>) -> Result<Vec<ExamRecord>, String> {
    let db_path = ensure_database(&state)?;
    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open DB: {}", e))?;

    let mut stmt = conn.prepare(
        r#"
        SELECT e.id, e.title, e.subject, e.chapter, e.year, e.session,
               e.file_path, e.file_type,
               CASE WHEN f.examen_id IS NOT NULL THEN 1 ELSE 0 END AS favorite,
               e.date_ajout AS created_at,
               (SELECT h.date_ouverture FROM historique h WHERE h.examen_id = e.id ORDER BY h.date_ouverture DESC LIMIT 1) AS last_opened_at,
               e.date_modification
        FROM examens e
        LEFT JOIN favoris f ON f.examen_id = e.id
        ORDER BY e.date_modification DESC
        "#,
    )
    .map_err(|e| format!("Failed to prepare SQL: {}", e))?;

    let rows = stmt.query_map([], |row| {
        Ok(ExamRecord {
            id: row.get("id")?,
            title: row.get("title")?,
            subject: row.get("subject")?,
            chapter: row.get("chapter")?,
            year: row.get("year")?,
            session: row.get("session")?,
            file_path: row.get("file_path")?,
            file_type: row.get("file_type")?,
            favorite: row.get::<_, i32>("favorite")? == 1,
            created_at: row.get("created_at")?,
            last_opened_at: row.get("last_opened_at")?,
            date_modification: row.get("date_modification")?,
        })
    })
    .map_err(|e| format!("Failed to read examens: {}", e))?;

    let mut exams = Vec::new();
    for exam in rows {
        exams.push(exam.map_err(|e| format!("Failed to map exam row: {}", e))?);
    }
    Ok(exams)
}

#[tauri::command]
fn get_favorites(state: State<AppState>) -> Result<Vec<String>, String> {
    let db_path = ensure_database(&state)?;
    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open DB: {}", e))?;
    let mut stmt = conn.prepare("SELECT examen_id FROM favoris ORDER BY date_ajout DESC").map_err(|e| e.to_string())?;
    let rows = stmt.query_map([], |row| row.get(0)).map_err(|e| e.to_string())?;

    let mut ids = Vec::new();
    for item in rows {
        ids.push(item.map_err(|e| e.to_string())?);
    }
    Ok(ids)
}

#[tauri::command]
fn get_recent(state: State<AppState>) -> Result<Vec<String>, String> {
    let db_path = ensure_database(&state)?;
    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open DB: {}", e))?;
    let mut stmt = conn.prepare("SELECT examen_id FROM historique ORDER BY date_ouverture DESC LIMIT 20").map_err(|e| e.to_string())?;
    let rows = stmt.query_map([], |row| row.get(0)).map_err(|e| e.to_string())?;

    let mut ids = Vec::new();
    for item in rows {
        ids.push(item.map_err(|e| e.to_string())?);
    }
    Ok(ids)
}

#[tauri::command]
fn toggle_favorite(state: State<AppState>, exam_id: String) -> Result<bool, String> {
    let db_path = ensure_database(&state)?;
    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open DB: {}", e))?;
    let exists: i32 = conn.query_row(
        "SELECT COUNT(*) FROM favoris WHERE examen_id = ?1",
        params![exam_id],
        |row| row.get(0),
    )
    .map_err(|e| format!("Failed to query favorite: {}", e))?;

    let now = Utc::now().to_rfc3339();
    if exists > 0 {
        conn.execute("DELETE FROM favoris WHERE examen_id = ?1", params![exam_id])
            .map_err(|e| format!("Failed to remove favorite: {}", e))?;
        Ok(false)
    } else {
        conn.execute(
            "INSERT INTO favoris (id, examen_id, date_ajout) VALUES (?1, ?2, ?3)",
            params![generate_id(), exam_id, now],
        )
        .map_err(|e| format!("Failed to add favorite: {}", e))?;
        Ok(true)
    }
}

#[tauri::command]
fn add_to_recent(state: State<AppState>, exam_id: String) -> Result<Vec<String>, String> {
    let db_path = ensure_database(&state)?;
    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open DB: {}", e))?;
    let now = Utc::now().to_rfc3339();

    conn.execute("DELETE FROM historique WHERE examen_id = ?1", params![exam_id])
        .map_err(|e| format!("Failed to delete historical record: {}", e))?;
    conn.execute(
        "INSERT INTO historique (id, examen_id, date_ouverture) VALUES (?1, ?2, ?3)",
        params![generate_id(), exam_id, now],
    )
    .map_err(|e| format!("Failed to add recent: {}", e))?;

    get_recent(state)
}

#[tauri::command]
fn import_exam(state: State<AppState>, payload: FileImportInput) -> Result<ExamRecord, String> {
    let data_dir = ensure_data_dir(&state)?;
    let documents_dir = data_dir.join("documents");
    fs::create_dir_all(&documents_dir).map_err(|e| format!("Failed to create documents directory: {}", e))?;

    let extension = payload.file_type.trim().trim_start_matches('.').to_lowercase();
    let file_name = sanitize_filename(&payload.file_name, &extension);
    let unique_name = format!(
        "{}_{}",
        Utc::now().timestamp_millis(),
        file_name
    );
    let target_path = documents_dir.join(unique_name);
    fs::write(&target_path, &payload.content).map_err(|e| format!("Failed to save file: {}", e))?;

    let exam_id = generate_id();
    let now = Utc::now().to_rfc3339();
    let db_path = ensure_database(&state)?;
    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open DB: {}", e))?;

    conn.execute(
        "INSERT INTO examens (id, title, subject, chapter, year, session, file_path, file_type, date_ajout, date_modification) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![
            exam_id,
            payload.title,
            payload.subject,
            payload.chapter,
            payload.year,
            payload.session,
            target_path.to_string_lossy().to_string(),
            extension,
            now,
            now
        ],
    )
    .map_err(|e| format!("Failed to insert imported exam: {}", e))?;

    Ok(ExamRecord {
        id: exam_id,
        title: payload.title,
        subject: payload.subject,
        chapter: payload.chapter,
        year: payload.year,
        session: payload.session,
        file_path: target_path.to_string_lossy().to_string(),
        file_type: extension,
        favorite: false,
        created_at: now.clone(),
        last_opened_at: None,
        date_modification: Some(now),
    })
}

#[tauri::command]
fn delete_exam(state: State<AppState>, exam_id: String) -> Result<bool, String> {
    let db_path = ensure_database(&state)?;
    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open DB: {}", e))?;
    let rows = conn.execute("DELETE FROM examens WHERE id = ?1", params![exam_id]).map_err(|e| format!("Failed to delete exam: {}", e))?;
    Ok(rows > 0)
}

#[tauri::command]
fn get_settings(state: State<AppState>) -> Result<std::collections::HashMap<String, String>, String> {
    let db_path = ensure_database(&state)?;
    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open DB: {}", e))?;
    let mut stmt = conn.prepare("SELECT cle, valeur FROM parametres").map_err(|e| e.to_string())?;
    let rows = stmt.query_map([], |row| Ok((row.get(0)?, row.get(1)?))).map_err(|e| e.to_string())?;

    let mut settings = std::collections::HashMap::new();
    for row in rows {
        let (key, value) = row.map_err(|e| e.to_string())?;
        settings.insert(key, value);
    }
    Ok(settings)
}

#[tauri::command]
fn set_setting(state: State<AppState>, key: String, value: String) -> Result<(), String> {
    let db_path = ensure_database(&state)?;
    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open DB: {}", e))?;
    let id = format!("setting_{}", key.replace(" ", "_"));
    conn.execute(
        "INSERT INTO parametres (id, cle, valeur) VALUES (?1, ?2, ?3) ON CONFLICT(cle) DO UPDATE SET valeur = excluded.valeur",
        params![id, key, value],
    )
    .map_err(|e| format!("Failed to save setting: {}", e))?;
    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            data_dir: Mutex::new(None),
            db_path: Mutex::new(None),
        })
        .setup(|app| {
            let app_handle = app.handle();
            if let Ok(data_dir) = app.path_resolver().app_data_dir() {
                fs::create_dir_all(&data_dir).map_err(|e| format!("Failed to create app data directory: {}", e))?;
                if let Ok(mut state) = app_handle.state::<AppState>().data_dir.lock() {
                    *state = Some(data_dir);
                }
                if let Ok(mut state) = app_handle.state::<AppState>().db_path.lock() {
                    let db_path = data_dir.join("examens.db");
                    *state = Some(db_path);
                }
                let _ = init_database(app_handle.state::<AppState>());
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            init_database,
            get_app_data_dir,
            read_file,
            get_file_metadata,
            create_exam,
            list_exams,
            import_exam,
            get_favorites,
            get_recent,
            toggle_favorite,
            add_to_recent,
            delete_exam,
            get_settings,
            set_setting
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
