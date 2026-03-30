# Firebase Auth Integration TODO

## Steps:

- [x] 1. Create Git branch `blackboxai/firebase-auth`
- [x] 2. Create `lib/firebase.ts` with Firebase config and Auth exports
- [ ] 3. Update package.json and install @react-native-firebase/app @react-native-firebase/auth
- [x] 4. Refactor `context/AuthContext.tsx` to use Firebase Auth instead of AsyncStorage
- [ ] 5. Test auth flows (register -> setup -> tabs; login; logout)
- [ ] 6. Update screens if needed (setup-account, account for profile photo)
- [ ] 7. Commit changes
- [ ] 8. Create PR

Current: lib/firebase.ts fixed (step 3 complete). Next: Step 4 - Refactor AuthContext
