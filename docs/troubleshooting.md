# Troubleshooting

Common issues and their solutions.

## Installation Issues

### Problem: `npm install` fails
**Solutions:**
1. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```
3. Check Node version (should be 18+):
   ```bash
   node --version
   ```

### Problem: Pod install fails (iOS)
**Solutions:**
1. Update CocoaPods:
   ```bash
   sudo gem install cocoapods
   ```
2. Clear pod cache:
   ```bash
   cd ios
   pod deintegrate
   pod install
   ```
3. Try cleaning build:
   ```bash
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   ```

## Build Issues

### Problem: Android build fails
**Solutions:**
1. Clean build:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```
2. Check Java version (should be 17):
   ```bash
   java -version
   ```
3. Clear gradle cache:
   ```bash
   cd android
   ./gradlew clean --refresh-dependencies
   ```

### Problem: iOS build fails
**Solutions:**
1. Clean build folder in Xcode: Product → Clean Build Folder
2. Delete derived data:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```
3. Reinstall pods:
   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

## Runtime Issues

### Problem: White screen on launch
**Solutions:**
1. Check Metro bundler is running
2. Clear cache and restart:
   ```bash
   npm start -- --reset-cache
   ```
3. Check for JavaScript errors in console

### Problem: Login fails
**Possible causes:**
1. **Network issue** - Check internet connection
2. **API timeout** - API might be slow, wait and retry
3. **Wrong credentials** - Use: `emilys` / `emilyspass`

**Check:**
- Network inspector in dev tools
- Console logs for error messages

### Problem: Biometric authentication not working
**Solutions:**
1. **iOS Simulator**: 
   - Hardware → Face ID → Enrolled
   - Hardware → Face ID → Matching Face
2. **Android Emulator**:
   - Settings → Security → Fingerprint
   - Add fingerprint in emulator settings
3. **Device**: Grant biometric permissions in Settings

### Problem: App won't unlock
**Solutions:**
1. Use fallback password: `1234`
2. Restart app
3. Clear app data and login again

### Problem: Products not loading
**Solutions:**
1. Check network connection
2. Pull to refresh
3. Check if offline banner is showing
4. Restart app to reload cache

### Problem: Can't delete products
**Possible causes:**
1. **Not superadmin** - Only `emilys` can delete
2. **Offline** - Delete requires network
3. **API error** - Check console logs

## Development Issues

### Problem: Hot reload not working
**Solutions:**
1. Shake device and enable "Fast Refresh"
2. Restart Metro bundler:
   ```bash
   npm start -- --reset-cache
   ```
3. Check for syntax errors in recent changes

### Problem: Changes not reflecting
**Solutions:**
1. Clear Metro cache:
   ```bash
   npm start -- --reset-cache
   ```
2. Clear React Query cache (restart app)
3. Rebuild app:
   ```bash
   npm run ios
   # or
   npm run android
   ```

### Problem: TypeScript errors
**Solutions:**
1. Restart TypeScript server in VS Code: Cmd+Shift+P → "Restart TS Server"
2. Check `tsconfig.json` is correct
3. Delete and regenerate types:
   ```bash
   rm -rf node_modules/@types
   npm install
   ```

## Testing Issues

### Problem: Tests failing
**Solutions:**
1. Update snapshots:
   ```bash
   npm test -- -u
   ```
2. Clear Jest cache:
   ```bash
   npm test -- --clearCache
   ```
3. Check mocks are properly set up

### Problem: Tests timeout
**Solutions:**
1. Increase timeout in test:
   ```typescript
   jest.setTimeout(10000);
   ```
2. Use `waitFor` for async operations:
   ```typescript
   await waitFor(() => expect(result).toBeTruthy());
   ```

## API Issues

### Problem: API calls failing
**Solutions:**
1. Check network connection
2. Verify API endpoint is correct
3. Check if API is down: visit https://dummyjson.com
4. Check console for specific error messages

### Problem: Token expired
**Solutions:**
1. Logout and login again
2. Token is automatically refreshed on API 401 errors
3. Check token in SecureStore

### Problem: Cached data is stale
**Solutions:**
1. Pull to refresh on screen
2. Clear app data and restart
3. Force refetch:
   ```typescript
   queryClient.invalidateQueries(['products']);
   ```

## Performance Issues

### Problem: App is slow
**Solutions:**
1. Check if running in debug mode (debug is slower)
2. Build release version:
   ```bash
   npm run ios --configuration Release
   # or
   npm run android --variant=release
   ```
3. Clear cache and restart

### Problem: App crashes
**Solutions:**
1. Check console logs for errors
2. Test on different device/simulator
3. Clear app data and reinstall
4. Check for infinite loops or memory leaks

## Cache Issues

### Problem: Old data showing
**Solutions:**
1. Pull to refresh
2. Clear MMKV cache:
   ```typescript
   storage.clearAll();
   ```
3. Logout and login again

### Problem: Cache taking too much space
**Solutions:**
1. Reduce cache time in queryClient config
2. Clear cache periodically:
   ```typescript
   queryClient.clear();
   ```

## Environment Issues

### Problem: Environment variables not loading
**Solutions:**
1. Check `.env` file exists
2. Restart Metro bundler
3. Rebuild app

### Problem: Wrong environment
**Solutions:**
1. Check which environment is active
2. Switch environments if needed
3. Rebuild app

## Getting Help

If you're still stuck:

1. **Check Console Logs**: Look for error messages
2. **Check Network Tab**: See if API calls are failing
3. **Search Issues**: Check GitHub issues for similar problems
4. **Ask for Help**: Create a new issue with:
   - Description of problem
   - Steps to reproduce
   - Error messages
   - Environment info (OS, device, Node version)

## Useful Commands

### Clean Everything
```bash
# Clean npm
rm -rf node_modules package-lock.json
npm install

# Clean iOS
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Clean Android
cd android
./gradlew clean
cd ..

# Restart with clean cache
npm start -- --reset-cache
```

### Reset App Data
```bash
# iOS Simulator
xcrun simctl erase all

# Android Emulator
adb uninstall com.yourapp.package
```

### Check Versions
```bash
node --version          # Should be 18+
npm --version
java -version           # Should be 17 for Android
pod --version          # For iOS
```

## Prevention Tips

1. **Keep dependencies updated**: Regular `npm update`
2. **Clear cache regularly**: Prevent stale data issues
3. **Test on real devices**: Simulators behave differently
4. **Use TypeScript**: Catch errors at compile time
5. **Write tests**: Prevent regressions
6. **Monitor performance**: Use React DevTools

## Next Steps

- Review [Getting Started](./getting-started.md) for setup
- Check [Features](./features.md) for what should work
- Review [Testing](./testing.md) for testing issues
