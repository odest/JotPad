import '@/global.css';

import { Stack } from 'expo-router';

import { ThemeProvider } from '@/theme';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
