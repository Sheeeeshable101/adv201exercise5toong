# Firebase Android Setup TODO

## Steps:

1. [x] Create TODO.md with plan steps
2. [x] Update lib/firebase.ts for platform-specific Firebase initialization (native uses google-services.json, web uses config).
3. [ ] Run `npx expo prebuild --clean --platform android` to embed google-services.json.
4. [ ] Add SHA1 fingerprint `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` to Firebase console Android app.
5. [ ] Test with `npx expo run:android`.
