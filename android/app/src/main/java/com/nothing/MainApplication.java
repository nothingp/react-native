package com.nothing;

import android.app.Application;

import com.facebook.react.ReactApplication;

import cn.reactnative.modules.update.UpdateContext;
import cn.reactnative.modules.update.UpdatePackage;
import com.imagepicker.ImagePickerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile() {
      return UpdateContext.getBundleUrl(MainApplication.this);
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return MainApplication.this.isDebug();
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return MainApplication.this.getPackages();
    }
  };

  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    // Add additional packages you require here
    // No need to add RnnPackage and MainReactPackage
    return Arrays.<ReactPackage>asList(
            new RNI18nPackage(),
            new ImagePickerPackage(),
            new UpdatePackage()
            // eg. new VectorIconsPackage()
    );
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }
}
