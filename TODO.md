# Firebase Native Module Fix - TODO

## Steps to Complete:

- [x] 1. Add '@react-native-firebase/app' plugin to app.json
- [x] 1. Add '@react-native-firebase/app' plugin to app.json&#10;- [x] 2. Run `npx expo prebuild --clean` to generate native projects with linking
- [ ] 3. For iOS: Install CocoaPods (`sudo gem install cocoapods` if needed), then `cd ios && npx pod-install`
- [ ] 4. Run development build: `npx expo run:android` (or `npx expo run:ios`)
- [ ] 5. Clear cache: `npx expo start --clear` and test login/register screens
- [ ] 6. Verify no more 'rnfbappmodule not found' error

**Next command to run:** `npx expo prebuild --clean`
