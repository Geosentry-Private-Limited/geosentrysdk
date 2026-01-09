package com.reactnativesdkapp
import android.Manifest
import android.content.pm.PackageManager
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import com.geosentry.geosentry_sdk.Geosentry
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class GeosentryModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "GeosentryModule"
    }

    @ReactMethod
    fun initializeSDK(apiKey: String?, cipherKey: String?, userID: String?, callback: Callback) {
        val activity = getCurrentActivity()
        val context = reactApplicationContext
        if (activity == null) {
            callback.invoke("ACTIVITY_ERROR", "Current activity is null")
            return
        }

        if (apiKey != null && cipherKey != null && userID != null) {
            CoroutineScope(Dispatchers.Main).launch {
                try {
                    val response = Geosentry.initialiseSDK(activity, apiKey, cipherKey, userID)
                    // If battery optimization permission is not granted, request it
                    Geosentry.requestIgnoreBatteryOptimizations(context)
                    callback.invoke("SDK Initialization Response: $response")
                } catch (e: Exception) {
                    Log.e("GeosentrySDK", "Error initializing SDK", e)
                    callback.invoke("INIT_ERROR", "Error initializing SDK: ${e.message}")
                }
            }
        } else {
            callback.invoke("INVALID_ARGUMENTS", "Missing API Key, Cipher Key, or User ID")
        }
    }

    @ReactMethod
    fun stopTracking(callback: Callback) {
        val context = reactApplicationContext

        CoroutineScope(Dispatchers.Main).launch {
            try {
                val result = Geosentry.stopTracking(context)

                if (result["success"] as? Boolean == true) {
                    callback.invoke(null, "Location tracking stopped successfully")
                } else {
                    val errorMessage = result["errormessage"] as? String ?: "Unknown error"
                    callback.invoke("STOP_ERROR", "Failed to stop tracking: $errorMessage")
                }
            } catch (e: Exception) {
                callback.invoke("STOP_ERROR", "Error stopping location tracking: ${e.message}")
            }
        }
    }
}
    