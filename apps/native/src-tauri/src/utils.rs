use log::{debug, error, info, trace, warn};

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