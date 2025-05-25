"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from '@repo/ui/components/button'
import { Download } from 'lucide-react'

const DownloadButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [currentOS, setCurrentOS] = useState<'windows' | 'linux' | 'macos' | 'android'>('windows');

  type OSType = 'windows' | 'linux' | 'macos' | 'android';

  const downloadOptions: Record<OSType, Array<{ name: string; url: string}>> = {
    windows: [
      {
        url: 'https://github.com/odest/JotPad/releases/download/v0.1.0/JotPad_0.1.0_Windows_x64_en-US.msi',
        name: 'Windows (x64) - MSI Installer'
      },
      {
        url: 'https://github.com/odest/JotPad/releases/download/v0.1.0/JotPad_0.1.0_Windows_x64_Setup.exe',
        name: 'Windows (x64) - EXE Installer'
      }
    ],
    linux: [
      {
        url: 'https://github.com/odest/JotPad/releases/download/v0.1.0/JotPad_0.1.0_Linux_amd64.AppImage',
        name: 'Linux (x86_64) - Portable AppImage'
      },
      {
        url: 'https://github.com/odest/JotPad/releases/download/v0.1.0/JotPad_0.1.0_Linux_amd64.deb',
        name: 'Linux (x86_64) - Debian/Ubuntu .deb Package'
      },
      {
        url: 'https://github.com/odest/JotPad/releases/download/v0.1.0/JotPad_0.1.0_Linux_x86_64.rpm',
        name: 'Linux (x86_64) - Fedora/RHEL .rpm Package'
      }
    ],
    macos: [
      {
        url: 'https://github.com/odest/JotPad/releases/download/v0.1.0/JotPad_0.1.0_macOS_aarch64.dmg',
        name: 'macOS (Apple Silicon) - DMG'
      },
      {
        url: 'https://github.com/odest/JotPad/releases/download/v0.1.0/JotPad_0.1.0_macOS_aarch64_app.tar.gz',
        name: 'macOS (Apple Silicon) - Tarball'
      },
      {
        url: 'https://github.com/odest/JotPad/releases/download/v0.1.0/JotPad_0.1.0_macOS_x64.dmg',
        name: 'macOS (Intel) - DMG'
      },
      {
        url: 'https://github.com/odest/JotPad/releases/download/v0.1.0/JotPad_0.1.0_macOS_x64_app.tar.gz',
        name: 'macOS (Intel) - Tarball'
      }
    ],
    android: [
      {
        url: 'https://github.com/odest/JotPad/releases/download/v0.1.0/JotPad_0.1.0_Android_universal.apk',
        name: 'Android - Universal APK'
      }
    ]
  };

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) {
      setCurrentOS('android');
    } else if (userAgent.includes('mac')) {
      setCurrentOS('macos');
    } else if (userAgent.includes('linux')) {
      setCurrentOS('linux');
    } else {
      setCurrentOS('windows');
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside as EventListener);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as EventListener);
    };
  }, [isOpen]);

  const getOSInfo = () => {
    const osInfo: Record<OSType, { name: string; icon: string }> = {
      windows: {
        name: 'Download for Windows',
        icon: 'fa-windows',
      },
      linux: {
        name: 'Download for Linux',
        icon: 'fa-linux',
      },
      macos: {
        name: 'Download for macOS',
        icon: 'fa-apple',
      },
      android: {
        name: 'Download for Android',
        icon: 'fa-android',
      }
    };
    return osInfo[currentOS];
  };

  const osInfo = getOSInfo();

  return (
    <div className="relative inline-block">
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <Button
        size="lg"
        onClick={() => {
          const options = downloadOptions[currentOS];
          if (options.length === 1 && options[0]) {
            window.location.href = options[0].url;
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className="relative flex items-center gap-3 px-4 py-5 text-lg shadow-xl border-2 border-black dark:border-white hover:text-black hover:bg-transparent hover:dark:text-white hover:scale-105 hover:shadow-2xl transition-transform duration-200"
        
      >
        <i className={`fab ${osInfo.icon} w-5 h-5`}></i>
        <span>{osInfo.name}</span>
      </Button>

      {isOpen && downloadOptions[currentOS].length > 1 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 border-2 bg-black dark:bg-white text-white dark:text-black border-black dark:border-white rounded-lg shadow-xl overflow-hidden"
        >
          {downloadOptions[currentOS].map((option, index) => (
            <a
              key={index}
              href={option.url}
              className="block px-4 py-4 text-left border-b last:border-b-0 hover:bg-white hover:dark:bg-black hover:text-black hover:dark:text-white border-white dark:border-black"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {option.name}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {isOpen && downloadOptions[currentOS].length > 1 && (
        <div 
          className="fixed inset-0"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DownloadButton;