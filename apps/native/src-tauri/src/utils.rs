use log::{debug, error, info, trace, warn};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn log_message(level: &str, message: &str) {
    match level.to_lowercase().as_str() {
        "info" => info!("{}", message),
        "error" => error!("{}", message),
        "warn" => warn!("{}", message),
        "debug" => debug!("{}", message),
        "trace" => trace!("{}", message),
        _ => info!("{}", message),
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Settings {
    pub theme: String,
    pub color_theme: String,
    pub background: BackgroundSettings,
    pub export_format: String,
    pub sort_type: String,
    pub auto_check_updates: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BackgroundSettings {
    pub show_background: bool,
    pub use_custom_image: bool,
    pub custom_image_src: Option<String>,
    pub opacity: u8,
    pub brightness: u8,
    pub blur: f32,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            theme: "system".to_string(),
            color_theme: "zinc".to_string(),
            background: BackgroundSettings {
                show_background: true,
                use_custom_image: false,
                custom_image_src: None,
                opacity: 30,
                brightness: 100,
                blur: 0.0,
            },
            export_format: "json".to_string(),
            sort_type: "newest".to_string(),
            auto_check_updates: false,
        }
    }
}

fn settings_file_path(app_handle: &AppHandle) -> PathBuf {
    let config_dir = app_handle.path().app_config_dir().expect("No config dir");
    config_dir.join("jotpad_settings.json")
}

#[tauri::command]
pub fn read_settings(app_handle: AppHandle) -> Result<Settings, String> {
    let path = settings_file_path(&app_handle);
    if !path.exists() {
        let default_settings = Settings::default();
        if let Err(e) = fs::create_dir_all(path.parent().unwrap()) {
            return Err(format!("Failed to create config dir: {}", e));
        }
        if let Err(e) = fs::write(
            &path,
            serde_json::to_string_pretty(&default_settings).unwrap(),
        ) {
            return Err(format!("Failed to write default settings: {}", e));
        }
        return Ok(default_settings);
    }
    let data = fs::read_to_string(&path).map_err(|e| format!("Failed to read settings: {}", e))?;
    let settings: Settings =
        serde_json::from_str(&data).map_err(|e| format!("Failed to parse settings: {}", e))?;
    Ok(settings)
}

#[tauri::command]
pub fn write_settings(app_handle: AppHandle, settings: Settings) -> Result<(), String> {
    let path = settings_file_path(&app_handle);
    if let Err(e) = fs::create_dir_all(path.parent().unwrap()) {
        return Err(format!("Failed to create config dir: {}", e));
    }
    fs::write(&path, serde_json::to_string_pretty(&settings).unwrap())
        .map_err(|e| format!("Failed to write settings: {}", e))
}
