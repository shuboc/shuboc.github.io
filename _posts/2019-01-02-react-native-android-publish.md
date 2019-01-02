---
title: "[教學] React Native Android APP上架Google Play流程完整攻略"
description: "這篇教學會一步一步介紹，如何將一個React Native的Android App上架(publish)到Google Play上。"
image: "https://developer.android.com/studio/images/publish/appsigning_googleplayappsigningdiagram_2x.png"
tags: ["react native", "android"]
---

我近一年開始接觸用React Native開發APP，本身是從前端領域跨進APP開發，所以對於Android的一切不是很熟悉，一開始要上架看文件費了一番力氣QQ，最近終於有空整理成一篇上架的完整流程，希望對大家有幫助！

這篇教學會一步一步介紹，如何將一個React Native的Android App上架(publish)到Google Play上。

## 目錄

1. [設定App Signing](#第一步設定app-signing)
2. [建立Keystore](#第二步建立keystore)
3. [設定Release Config](#第三步設定release-config)
4. [在Gradle Config中新增Signing Config](#第四步在gradle-config中新增signing-config)
5. [產生簽署過的APK檔](#第五步產生簽署過的apk檔)
6. [上傳APK至Google Play Console](#第六步上傳apk至google-play-console)

---

## 第一步：設定App Signing

Android APP要上架(Publish)，相較於開發階段會多一個手續：APP必須要經過簽署(sign)的程序。

要了解簽署的程序，首先我們要先介紹簽署流程中兩個名詞：憑證(certificate)和Keystore。

### 憑證(Certificates) and Keystores

首先，所有要上架到Google Play的APK，都需要有**憑證(certificate)**的資訊。

憑證是APK上的一段額外資訊，用來驗證這個APK的確是由原作者發佈，而非惡意第三方發佈的。（延伸閱讀：[Certificates and Keystores](https://developer.android.com/studio/publish/app-signing#certificates-keystores)，[管理您的應用程式簽署金鑰
](https://support.google.com/googleplay/android-developer/answer/7384423?hl=zh-Hant)）

如果要讓APK帶有憑證的資訊，我們需要有一組private/public key。作者用private key對APK作簽署(signing)的動作，APK上就會帶有憑證的資訊。

這把重要的private key稱為**應用程式簽署金鑰(app signing key)**。

在Android的世界中，我們會用**keystore**來保存金鑰。他是一個binary檔，內含有一至多組private/public key的資訊。之後會介紹如何[建立keystore](#第二步建立keystore)。

介紹完一些專有名詞後，接下來，我們需要了解[Google Play App Signing](https://developer.android.com/studio/publish/app-signing#google-play-app-signing)的流程，讓我們繼續往下看！

### Google Play App Signing

應用程式簽署金鑰(app signing key)是App開發者的生命，絕對要保管好。

如果不幸地遺失了app signing key，那麼你就失去這個app的控制權，無法再更新同一個APP，必須要用一組新的`applicationId`上架，以前累積的下載量、星數也得重新累積。

如果app signing key被惡意的第三方偷走，他們可以假借你的名義發布惡意的APP。

因此Google提供了**Google Play App Signing**的機制。

這個機制簡單地說，就是Google怕你搞丟app signing key，替你保管。

你簽署APK的時候並不直接使用app signing key，而是改用另一把**上傳金鑰 (Upload Key)**簽署。Google收到你上傳的APK後，會先確認你用來簽署APK的upload key正確無誤，才會替你用真正的app signing key去簽署APK。

![Signing an app with App Signing by Google Play](https://developer.android.com/studio/images/publish/appsigning_googleplayappsigningdiagram_2x.png)

如果upload key弄丟了，只要到Google Play Console註銷 (revoke) 舊的upload key，再註冊一組新的upload key即可。

不知道看到這裡，會不會覺得機制很複雜呢？

不過Google Play App Signing設定起來其實非常簡單，讓我們往下看怎麼設定！

### 如何設定Google Play App Signing

到[Google Play Console](https://play.google.com/apps/publish/)，選「應用程式簽署 (App Signing)」：

![應用程式簽署](/images/react-native-android-publish/app-signing-1.png)

出現「註冊Google Play應用程式簽署(Google Play App Signing)」的畫面，這裏提到需要上傳APK才能繼續：

![註冊Google Play應用程式簽署](/images/react-native-android-publish/app-signing-2.png)

點選「應用程式版本」：

![應用程式版本](/images/react-native-android-publish/app-signing-3.png)

點選「內部測試群組」：

![內部測試群組](/images/react-native-android-publish/app-signing-4.png)

點選「建立新版本」：

![建立新版本](/images/react-native-android-publish/app-signing-5.png)

點選「使用Google Play應用程式簽署」：

![使用Google Play應用程式簽署](/images/react-native-android-publish/app-signing-6.png)

同意使用條款 (Term of Services)

![同意使用條款](/images/react-native-android-publish/app-signing-7.png)

可以看到Google已經為我們生成了應用程式簽署金鑰(app signing key)。

![已產生應用程式簽署金鑰](/images/react-native-android-publish/app-signing-8.png)

到這裡app signing key的設定就暫時告一段落囉。

至於Upload key設定的部分，**第一次上傳APK時使用的signing key就會是以後上傳APK要用的上傳金鑰(upload key)。**

所以接下來只要上傳簽署過的APK，upload key的設定就順便完成了！

讓我們繼續往下看，如何產生簽署過的APK。

## 第二步：建立Keystore

這一步要建立keystore，裡面會保存未來要上架用的upload key。

開啟Android Studio，點選「Build > Generated Signed APK」：

![Build > Generated Signed APK](/images/react-native-android-publish/create-keystore-1.png)

點選「Next」：

![Next](/images/react-native-android-publish/create-keystore-2.png)

點選「Create New...」：

![Create New...](/images/react-native-android-publish/create-keystore-3.png)

填入Keystore資訊：

* Keystore
  * Key store path: 存在專案目錄底下的`android/app/my-release-key.keystore`。
  * Password: keystore的密碼
* Key
  * Alias: `my-key-alias`
  * Password: key的密碼
  * Validity (years): 25
  * Certificate: 公司或是個人開發者的資訊

![填入Keystore資訊](/images/react-native-android-publish/create-keystore-4.png)

參考：[Generate Key](https://developer.android.com/studio/publish/app-signing#generate-key)

## 第三步：設定Release Config

這一步要填寫設定，讓gradle知道keystore的資訊。

編輯專案目錄底下的`android/gradle.properties`，把星號處換成上一步設定的密碼:

```bash
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*******
MYAPP_RELEASE_KEY_PASSWORD=*******
```

參考：[Setting up gradle variables](https://facebook.github.io/react-native/docs/signed-apk-android#setting-up-gradle-variables)

## 第四步：在Gradle Config中新增Signing Config

編輯`app/build.gradle`：

```gradle
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```

參考：[Adding signing config to your app's gradle config](https://facebook.github.io/react-native/docs/signed-apk-android#adding-signing-config-to-your-app-s-gradle-config)

## 第五步：產生簽署過的APK檔

編輯`app/build.gradle`，修改`applicationId`、`versionCode`及`versionName`

![Build Config](/images/react-native-android-publish/build-config.png)

執行build script:

```bash
$ cd android
$ ./gradlew assembleRelease
```

簽署完的APK會在`app/build/outputs/apk/release/app-release.apk`。

## 第六步：上傳APK至Google Play Console

到[Google Play Console](https://play.google.com/apps/publish/)裡，點選「版本管理 > 應用程式版本」：

![版本管理 > 應用程式版本](/images/react-native-android-publish/google-play-console-1.png)

選擇群組，點選『管理」。在測試階段，就選「內部測試群組」。如果要正式上架，就選「正式版測試群組」：

![管理群組](/images/react-native-android-publish//google-play-console-2.png)

選擇「建立新版本」：

![建立新版本](/images/react-native-android-publish/google-play-console-3.png)

選擇「上傳APK」：

![上傳APK](/images/react-native-android-publish/google-play-console-4.png)

填寫Release Note，按「審核」：

![審核](/images/react-native-android-publish/google-play-console-5.png)

上傳完成以後，upload key的資訊出現在Console裡，表示upload key的設定隨著上傳成功也一併設定完成囉！

![上傳金鑰設定完成](/images/react-native-android-publish/app-signing-result.png)

以後上傳就是用這組upload key，請保管好。

按照這些步驟做下來，應該就完成上架的動作囉。祝順利！

## 參考資料

[Sign your app - Google Developers](https://developer.android.com/studio/publish/app-signing)

[Setting up gradle variables - React Native](https://facebook.github.io/react-native/docs/signed-apk-android#setting-up-gradle-variables)
