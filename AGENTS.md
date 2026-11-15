# JotPad

JotPad is a note-taking app where each note is a conversation with yourself: you open a note and send it messages ("entries"). This repository is the mobile app, built with Expo SDK 58, React Native and TypeScript for Android and iOS. Development is Android-first, but every choice must also work on iOS.

The app is local-first. There is no backend and no sync.

## Product rules

- **It must feel like a native app of each platform.** Android follows Material 3 Expressive, iOS follows the system design (Liquid Glass on iOS 26). Never give one platform the other's patterns: no FAB on iOS, no hand-built iOS chrome on Android.
- **Prefer real native components over imitations.** Use `@expo/ui` (Jetpack Compose on Android, SwiftUI on iOS) for sheets, dialogs, menus, form rows and buttons before building them from views.
- **Do not add features that were not asked for.** The feature set is: notes, entries, pinning, tags, search, theme. Ask before adding anything else.
- An older Tauri desktop app lives on `master`. Use it only to see which features exist. Do not port its code, data model or UI.

## Current state

- Data is stored in SQLite (`expo-sqlite`) through Drizzle. `src/data/notes-store.ts` keeps an in-memory copy so screens read synchronously: it loads once at startup, and every action writes to the database first, then updates the copy. Screens use only the store's hooks and actions, never `db` directly.
- The UI is in English and Turkish. It follows the device language (English otherwise) unless a language is chosen in Settings, and a change applies at once. Every UI string, accessibility labels included, lives in `src/i18n/en.ts` and `tr.ts`; strings with a number or name are functions. Never write a UI string as a literal.
- Components read strings with `const t = useT()` (and `useLocale()` for dates), so they re-render when the language changes. Helpers that run while rendering take the strings as a parameter (`formatDay(ts, { t, locale })`, `sortOptions(t)`); never keep strings in module-level constants. Code that runs on a tap, such as an export, may call `strings()`.
- Message bodies are Markdown, rendered with `react-native-marked` in `src/screens/note/message-body.tsx`. Each line break stays a break (`withLineBreaks`), a message with no Markdown characters is shown as plain text, and while searching the raw text is shown so matches can be highlighted. One-line previews (note list, pinned bar) go through `stripMarkdown` (`src/utils/markdown.ts`). Links open on a tap and pass a long press on to the message.
- Only Android has been run. The iOS code paths exist but are untested.
- There are no automated tests yet.

## Commands

```bash
npx expo install <package>  # always use this to add a package, so the version matches the SDK
npx expo start --go         # start the dev server for Expo Go
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx prettier --write src    # format (sorts Tailwind classes)
npx expo-doctor             # diagnose dependency and config issues
npx drizzle-kit generate --name <what_changed>  # create a migration after changing src/data/schema.ts
```

Run typecheck and lint before calling a task done.

## Running the app

The app is developed in **Expo Go**. Start the dev server and open `exp://<computer LAN IP>:8081` in Expo Go on a phone on the same Wi-Fi.

- Only add libraries whose native code is bundled in Expo Go. A library that needs a development build cannot be tested right now.
- A local Android build (`npx expo run:android`) does not work on the current Windows machine: the C++ build of Reanimated exceeds the Windows path length limit from the project's folder. Do not work around this with machine-level changes without asking.
- Typecheck and lint passing does not show that a screen works. Check the change on a device, and do not report a visual bug as fixed until it has been seen fixed there.

## Project layout

```
src/
  app/          Expo Router routes only. Each file is a screen; keep them thin.
    (tabs)/     Four tabs: (notes), search, tags, settings. Each tab owns a stack.
    note/[id]   The conversation screen, pushed above the tabs.
  screens/      Screen bodies and their private components, one folder per screen.
  components/   UI shared by more than one screen.
  navigation/   Stack options and the tab navigators (`app-tabs`).
  data/         The store (types, hooks, actions), the Drizzle schema and its migrations.
  i18n/         UI strings per language (`t`) and the matching `locale`.
  theme/        Design tokens and the theme provider.
  utils/        Small standalone helpers.
```

- File names are kebab-case. Import with the `@/` alias (`@/components/icon`).
- Route files only read params and render a screen from `src/screens/`.
- For platform differences use platform files (`fab.tsx` + `fab.android.tsx`, `action-sheet.tsx` + `action-sheet.ios.tsx`) with identical props. Platform files are not allowed inside `src/app/`.
- A platform file replaces the base file completely, so export only the component and its props type from it. Anything else the base file exports (constants, helpers) is `undefined` on the platform that has its own file, and TypeScript does not catch it. Put shared values in a separate file (see `badge-shapes.ts`).
- A running Metro does not notice a new platform file next to a module it has already resolved (adding `search-field.android.tsx` beside `search-field.tsx`): the app keeps loading the old file with no error. Restart Metro with `npx expo start --go --clear` after adding or removing one.

## Styling and theme

- Style with NativeWind class names. Use `ios:` and `android:` variants for small platform differences.
- Colors and text sizes are design tokens, not literals. `tailwind.config.js` maps them to CSS variables that `ThemeProvider` fills per platform and color scheme: Material 3 dynamic colors on Android, system colors on iOS. Use the role names (`bg-surface`, `text-on-surface-variant`, `bg-primary-container`) and the text styles (`text-title`, `text-body`, `text-subhead`, `text-caption`).
- Where a class name cannot be used (native props such as `placeholderTextColor`, or `@expo/ui` props), read the color from `usePalette()`.
- Tag colors are not palette roles. Resolve a tag's color with `useTagTone()` (`src/theme/tag-colors.ts`); components that take a color (`Icon`, `ShapedBadge`) accept a role or a literal `#hex`.
- Do not put a text-size class on a `TextInput`; set `fontSize` from `typeRamp` in `style`. A fixed line height misaligns native inputs.
- Icons go through `src/components/icon.tsx`, which draws SF Symbols on iOS and Material Symbols on Android. Give every icon both names.

## Native components

- Wrap every `@expo/ui` tree in `NativeHost` (`src/components/native-host.tsx`), not in `Host` directly. It passes the app's color scheme on, so native components follow the theme chosen in Settings.
- `@expo/ui/jetpack-compose` is Android-only and `@expo/ui/swift-ui` is iOS-only. Import them only from a platform file.
- Material Symbols for Compose come from `@expo/material-symbols/<name>.xml`. In development they download on first use, so an icon can be blank the first time it is shown.
- Reusable pieces that already exist: `ActionSheet` (actions for one item), `ConfirmDialog` (confirm a destructive action), `ErrorDialog` (report a failure, optionally with retry), `NameSheet` (one text field, for create and rename), `Fab` (extended; pair it with `useFabExpanded` on the list), `EmptyState`, `ShapedBadge` (a Material 3 Expressive shape on Android, a circle on iOS).

## Known pitfalls

- Change the database only through `src/data/schema.ts` and a generated migration (`npx drizzle-kit generate`). Never edit files in `src/data/migrations/` by hand. Migrations run at startup before the first screen renders. Generate a migration once: a running Metro hot-reloads it and applies it to the phone's database at once, so deleting and regenerating it under another name makes it run twice there ("duplicate column"). After generating one, restart Metro with `npx expo start --go --clear`: a running Metro can keep serving the old `migrations.js`, and the app then fails with errors such as "no column named …".

- **Do not use Expo Router's `presentation: 'formSheet'`.** On Android it rendered nothing and broke the window's edge-to-edge insets (opaque status bar, doubled header padding). Use the `@expo/ui` `BottomSheet` inside the screen instead.
- **Do not add `react-native-keyboard-controller`.** Its `KeyboardProvider` inset the whole app below the status bar here. The conversation screen follows the keyboard with React Native's `KeyboardAvoidingView`.
- On Android, `Stack.Toolbar.Menu` needs a native view (`DropdownMenuGroupView`) that Expo Go 58.0.5 does not include, and the screen crashes with "Can't find ViewManager". Header menus use it on iOS only; Android uses the Compose `DropdownMenu` in `headerRight` (see `src/screens/note/note-menu.android.tsx`).
- React Native's `Alert` shows an old-style light dialog on Android. Use `ConfirmDialog`.
- Do not remount the app tree with a `key` to apply a setting. On Android the Compose tab pager kept showing the old tree's pages; make the affected components re-render instead.
- Focusing a text input while a sheet or menu is still closing leaves the keyboard hidden on Android, and `autoFocus` has the same problem. Focus after it has closed (see `src/screens/note/composer.tsx`); after a Compose dropdown menu, retry until `Keyboard.isVisible()` (see `src/screens/note/note-search-bar.android.tsx`).
- Tabs differ per platform (`src/navigation/app-tabs.tsx`). iOS uses the system `NativeTabs`. Android uses a custom navigator: a Compose pager whose pages follow the finger, with a Material 3 `NavigationBar`. Expo Router's `TabRouter` only holds visited tabs, so the Android navigator adds placeholder routes for the others and preloads them, as `NativeTabs` does internally.

## Expo APIs change between SDKs

Do not rely on memory for Expo, EAS or React Native APIs. Read the `expo` version in `package.json` and use the matching docs at `https://docs.expo.dev/versions/v<major>.0.0/`. For `@expo/ui`, the installed `.d.ts` files in `node_modules/@expo/ui/build` are the most reliable reference.

`ios/` and `android/` are generated and git-ignored. Never edit them by hand; configure native behavior in `app.json`.

## Git

- Work on a feature branch and merge it into `expo` when the feature is done and verified. `expo` is the working branch for this app; `master` holds the old desktop app.
- One feature per commit. Messages are English conventional commits (`feat: …`, `fix: …`), title only unless a body is really needed.
- Do not add AI co-author or attribution lines to commits.
