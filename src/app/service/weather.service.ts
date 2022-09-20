import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, HttpParams } from '@angular/common/http';
import { Search } from '../@core/models/search.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(
    private http: HttpClient,
  ) { }

  $getIP = "https://api.ipify.org/?format=json";
  // $ip_Location = "https://ip-api.com/json/";
  $ip_Location = "https://api.ipgeolocation.io/ipgeo";
  $weather_URL = "https://weatherapi-com.p.rapidapi.com/history.json?";
  $background_url = "https://api.unsplash.com/photos/random?";

  getIPAddress()
  {
    const headers = new HttpHeaders();
    return this.http.get(this.$getIP, {headers : headers} )
  }

  getIpLocation(location: any){
    const API_KEY = "46ae538879e74b9b99d0fb490184ee64";
    let locParams = new HttpParams()
    .append("ip",location)
    .append("apiKey",API_KEY);

    return this.http.get(this.$ip_Location, {params : locParams} )
  }

  getIpWeatherStats(location: string, date: string){
                 
    let  headers = new HttpHeaders({
        'X-RapidAPI-Key': '8e0295d5femsh3a76182516a0083p18d3f5jsn491be7bba8d1',
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      });

    let weatherParams = new HttpParams()
    .append("q",location)
    .append("dt",date);
    
    return this.http.get(this.$weather_URL, {headers : headers, params : weatherParams} );
    
  }

  getSearch(location: any, date: string){
    let  headers = new HttpHeaders({
      'X-RapidAPI-Key': '8e0295d5femsh3a76182516a0083p18d3f5jsn491be7bba8d1',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    });

    let weatherParams = new HttpParams()
    .append("q",location)
    .append("dt",date);
  
    return this.http.get(this.$weather_URL, {headers : headers, params : weatherParams} );
  }

  getBackgroundImage(location: any){
   const client_id = "pZNtFfRdg6KML5d_gFfAugaa-4jgOSaBr8ZTUe-v_4s"

    let weatherParams = new HttpParams()
    .append("query",location)
    .append("client_id",client_id);
  
    return this.http.get(this.$background_url, {params : weatherParams} );
  }


}
