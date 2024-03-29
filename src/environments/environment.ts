// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  demo: 'default',
  apiUrl: "http://localhost:8080/festa-api/", // localhost 
  // apiUrl: "http://festaSolar.ap-south-1.elasticbeanstalk.com/festa-api/", // production server 
  GOOGLE_MAPS_API_KEY: 'AIzaSyDpgQMpcfx1QU-8SM-ljcgjG4xrYtIYby4'
};

export const WAEnds = {
  WABI: "231667113353605",
  // url: "https://graph.facebook.com/v18.0/214842615044313/messages",
  url: "https://graph.facebook.com/",
  // to be added in the post URL
  token: "Bearer EAANBTnz5WGwBOwWYTNnbLxTJNg72Mk3IZCZCMKdE7zwZA9TftRJdSg6Pk1kbY9gwZAbuBsHRMZADiTDBT3zYTAFTZBzyY9R5YK4DMOvTSJjsECULA72ohuunk78uHTAaW7PmKHNn47qZBnt6gZCDCxTeF3YEL6vhbEYcSl5clrPXTWUelHy5L4uaLrlZBOJ7ZA6TtikyhIlQmFoVmMJiEO",
  PhnID: "214842615044313",
  version: "v18.0"
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 * 
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.