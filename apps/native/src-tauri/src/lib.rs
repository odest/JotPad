// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod utils;
use tauri_plugin_log::{Target, TargetKind};
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    log::info!("Starting JotPad application...");
    let migrations = vec![Migration {
        version: 1,
        description: "create notes and note_entries tables",
        sql: "CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS note_entries (
                id TEXT PRIMARY KEY,
                note_id TEXT NOT NULL,
                text TEXT NOT NULL,
                timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
            );",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 2,
        description: "add tags column to notes table",
        sql: "ALTER TABLE notes ADD COLUMN tags TEXT;",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 3,
        description: "add pinned column to notes table",
        sql: "ALTER TABLE notes ADD COLUMN pinned INTEGER DEFAULT 0;",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 4,
        description: "add pinned column to note_entries table",
        sql: "ALTER TABLE note_entries ADD COLUMN pinned INTEGER DEFAULT 0;",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:notes.db", migrations)
                .build(),
        )
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::LogDir {
                        file_name: Some("JotPad".to_string()),
                    }),
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::Webview),
                ])
                .level(log::LevelFilter::Info)
                .max_file_size(50_000)
                .rotation_strategy(tauri_plugin_log::RotationStrategy::KeepAll)
                .timezone_strategy(tauri_plugin_log::TimezoneStrategy::UseLocal)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            utils::log_message,
            utils::read_settings,
            utils::write_settings
        ])
        .setup(|_app| {
            log::info!("JotPad application started successfully!");
            Ok(())
        })
        .on_window_event(|_window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                log::info!("Shutting down JotPad application...");
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
