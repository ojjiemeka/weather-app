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
  historyList: Search [] = [];
  history: any;
  message: any;

  constructor(
    private weatherServ: WeatherService
  ) { }

  ngOnInit(): void {
    this.getIP();
    this.getHistory();
    // this.getUserLocation(this.userLoc);
  }

  getIP(){
    this.weatherServ.getIPAddress().subscribe(
      res => {
        this.myIP = res;
        this.weatherServ.getIpLocation(this.myIP.ip).subscribe(
          loc => {
            this.ipLocation = loc;
            this.userLoc = this.ipLocation.city

            var nowDate = new Date(); 
            var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
            this.current_date = date;
            this.weatherServ.getIpWeatherStats(this.userLoc, date).subscribe(
              data =>{
                this.data = data;
                this.city = this.data.location.name
                this.forecast = this.data.forecast.forecastday[0].day.condition.text
                this.temp_c = this.data.forecast.forecastday[0].day.avgtemp_c
                this.temp_f = this.data.forecast.forecastday[0].day.avgtemp_f
                this.forecast_img = this.data.forecast.forecastday[0].day.condition.icon
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
        this.data = data;
        this.city = this.data.location.name
        this.forecast = this.data.forecast.forecastday[0].day.condition.text;
        this.temp_c = this.data.forecast.forecastday[0].day.avgtemp_c;
        this.temp_f = this.data.forecast.forecastday[0].day.avgtemp_f;
        this.forecast_img = this.data.forecast.forecastday[0].day.condition.icon;
        
        if(this.historyList.includes(this.model.location)){
          console.log('location exists');
          this.message = 'location exists';
        }else{
          this.historyList.push(this.model.location);
          localStorage.setItem('searchHistory', JSON.stringify(this.historyList));
          this.history = JSON.parse(localStorage.getItem("searchHistory") || '{}').reverse();
        }
      }
    )
  }

  getHistory(){
    this.history = JSON.parse(localStorage.getItem("searchHistory") || '{}')
  }

  searchFromHistory(item: any){
    this.weatherServ.getSearch(item, this.current_date).subscribe(
      data => {
        this.data = data;
        this.city = this.data.location.name
        this.forecast = this.data.forecast.forecastday[0].day.condition.text;
        this.temp_c = this.data.forecast.forecastday[0].day.avgtemp_c;
        this.temp_f = this.data.forecast.forecastday[0].day.avgtemp_f;
        this.forecast_img = this.data.forecast.forecastday[0].day.condition.icon;
        // console.log(this.forecast_img);
        }
    )
  }

  deleteHistory(item: any){
    this.historyList.forEach((element,index)=>{
      if(element==item) 
      this.historyList.splice(index,1);
      localStorage.setItem('searchHistory', JSON.stringify(this.historyList));
      this.history = JSON.parse(localStorage.getItem("searchHistory") || '{}').reverse();
      console.log(this.historyList);
      // console.log(element);
    });

  }

}
