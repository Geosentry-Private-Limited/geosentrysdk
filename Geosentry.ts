import { NativeModules } from 'react-native';

const { GeosentryModule } = NativeModules;

export type GeosentryInitParams = {
  apiKey: string;
  cipherKey: string;
  userID: string;
};

export function initializeSDK(params: GeosentryInitParams): Promise<string> {
  return new Promise((resolve, reject) => {
    GeosentryModule.initializeSDK(
      params.apiKey,
      params.cipherKey,
      params.userID,
      (responseType: string, response: string) => {
        if (responseType === 'SDK Initialization Response') {
          resolve(response);
        } else {
          reject(response);
        }
      },
    );
  });
}

export function stopTracking(): Promise<string> {
  return new Promise((resolve, reject) => {
    GeosentryModule.stopTracking((error: string | null, result: string) => {
      if (!error) {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });
}
