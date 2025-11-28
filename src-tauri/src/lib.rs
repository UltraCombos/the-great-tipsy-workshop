// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use serde::Serialize;
use std::net::TcpStream;
use std::net::IpAddr;
use tauri::{AppHandle, Manager, Emitter};
use rosc::{encoder, OscMessage, OscPacket, OscType};
use tokio::net::UdpSocket;
use std::env;
use std::{net::SocketAddrV4, str::FromStr};
use dotenv::dotenv;

#[derive(Serialize, Clone)]
struct OscEvent {
    addr: String,
    args: Vec<String>,
}

#[tauri::command]
fn get_env(name: &str) -> String {
    println!("Getting environment variable: {}", name);

    match env::var(name) {
        Ok(value) => {
            // println!("Found environment variable {}: {}", name, value);
            value
        }
        Err(e) => {
            println!("Error getting environment variable {}: {}", name, e);
            String::new()
        }
    }
}

#[tauri::command]
async fn send_osc_message(
    key: &str,
    message: &str,
    host: &str,
    target: &str,
) -> Result<(), String> {
    // print
    // println!("Sending OSC message: {}", message);

    let sock = UdpSocket::bind(host).await.unwrap();
    let remote = SocketAddrV4::from_str(target).unwrap();

    let msg_buf = encoder::encode(&OscPacket::Message(OscMessage {
        addr: key.to_string(),
        args: vec![OscType::String(message.parse().unwrap())],
    }))
    .unwrap();

    sock.send_to(&msg_buf, remote).await.unwrap();

    Ok(())
}

async fn setup_osc_server(app_handle: AppHandle) {

    println!("Setting up OSC server...");
    // setup osc sever
    let addr = "0.0.0.0:8000";
    let sock = UdpSocket::bind(addr).await.unwrap();
    println!("Listening to {}", addr);

    let mut buf = [0u8; rosc::decoder::MTU];

    loop {
        match sock.recv_from(&mut buf).await {
            Ok((size, addr)) => {
                println!("Received packet with size {} from: {}", size, addr);
                if let Ok((_, packet)) = rosc::decoder::decode_udp(&buf[..size]) {
                    if let OscPacket::Message(msg) = packet {
                        println!("OSC message: {:?}", msg);
                        
                        app_handle.emit(
                            "osc_message",
                            OscEvent {
                                addr: msg.addr.clone(),
                                args: msg.args.iter().map(|arg| match arg {
                                    OscType::Int(i) => i.to_string(),
                                    OscType::Float(f) => f.to_string(),
                                    OscType::String(s) => s.clone(),
                                    OscType::Bool(b) => b.to_string(),
                                    _ => format!("{:?}", arg),
                                }).collect(),
                            },
                        ).unwrap();
                    }
                } else {
                    println!("Failed to decode OSC packet");
                }
            }
            Err(e) => {
                println!("Error receiving from socket: {}", e);
                break;
            }
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    dotenv().ok();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_env,
            send_osc_message,
        ])
        .plugin(tauri_plugin_http::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            tauri::async_runtime::spawn(setup_osc_server(app.handle().clone()));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
