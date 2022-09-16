import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Search } from 'src/app/@core/models/search.model';
import { WeatherService } from 'src/app/service/weather.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  myIP: any
  ipLocation: any;
  userLoc: any
  current_time: string | undefined;
  current_date: any;
  data: any;
  city: string|undefined;
  country: string|undefined;
  forecast: string|undefined;
  forecast_img: string|undefined;
  temp_c : string|undefined
  temp_f : string|undefined
  model: Search = new Search();

  constructor(
    private weatherServ: WeatherService
  ) { }

  ngOnInit(): void {
    this.getIP();
    // this.getUserLocation(this.userLoc);
  }

  getIP(){
    this.weatherServ.getIPAddress().subscribe(
      res => {
        this.myIP = res;
        // console.log(this.myIP.ip);
        this.weatherServ.getIpLocation(this.myIP.ip).subscribe(
          loc => {
            this.ipLocation = loc;
            this.userLoc = this.ipLocation.city

            var nowDate = new Date(); 
            var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
            this.current_date = date;
            // console.log(date)
            // console.log(this.userLoc);

            this.weatherServ.getIpWeatherStats(this.userLoc, date).subscribe(
              data =>{
                this.data = data;
                // console.log(this.data.location.name);
                this.city = this.data.location.name

                // console.log(this.data.forecast.forecastday);

                // console.log(this.data.forecast.forecastday[0].day.condition.text);
                this.forecast = this.data.forecast.forecastday[0].day.condition.text
                this.temp_c = this.data.forecast.forecastday[0].day.avgtemp_c
                this.temp_f = this.data.forecast.forecastday[0].day.avgtemp_f



                // console.log(this.data.forecast.forecastday[0].day.condition.icon);
                this.forecast_img = this.data.forecast.forecastday[0].day.condition.icon
                // this.city = info.location.name
              }
            )
          }
        );
      }
    );
  }

  searchLocation(form: NgForm){
    if (!form.valid) {
      return;
    }
    this.weatherServ.getSearch(this.model.location, this.current_date).subscribe(
      data => {
        // console.log(data);
        this.data = data;
        // console.log(this.data.location.name);
        this.city = this.data.location.name

        // console.log(this.data.forecast.forecastday);

        // console.log(this.data.forecast.forecastday[0].day.condition.text);
        this.forecast = this.data.forecast.forecastday[0].day.condition.text
        this.temp_c = this.data.forecast.forecastday[0].day.avgtemp_c
        this.temp_f = this.data.forecast.forecastday[0].day.avgtemp_f

        // console.log(this.data.forecast.forecastday[0].day.condition.icon);
        this.forecast_img = this.data.forecast.forecastday[0].day.condition.IndexComponent

        
      }
    )
  }

}
