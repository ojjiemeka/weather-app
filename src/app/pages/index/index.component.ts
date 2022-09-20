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
  hourlyForcast: any[] = [];
  dailySunrise: any
  dailySunset: any
  history: any;
  message: any;
  backgroundImage: any;

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
                this.city = this.data.location.name;
                this.temp_c = this.data.forecast.forecastday[0].day.avgtemp_c;
                this.temp_f = this.data.forecast.forecastday[0].day.avgtemp_f;
                this.forecast = this.data.forecast.forecastday[0].day.condition.text;
                this.forecast_img = this.data.forecast.forecastday[0].day.condition.icon;
                this.dailySunrise = this.data.forecast.forecastday[0].astro.sunrise;
                this.dailySunset = this.data.forecast.forecastday[0].astro.sunset;

                let hours = this.data.forecast.forecastday.map(
                  (r: any)=> r.hour
                  );
                // console.log(hours);

                let time: any[] = []
                for (let index = 0; index < hours.length; index++) {
                  time = [...time, ...hours[index]]  
                }
                // console.log(this.hourlyForcastTime);
                this.hourlyForcast = time;

                // console.log(this.city);
                this.weatherServ.getBackgroundImage(this.city).subscribe(
                  (img: any) =>{
                    this.backgroundImage = img.urls.regular
                    console.log(this.backgroundImage)
                  }
                );
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
        this.dailySunrise = this.data.forecast.forecastday[0].astro.sunrise;
        this.dailySunset = this.data.forecast.forecastday[0].astro.sunset;

        let hours = this.data.forecast.forecastday.map(
          (r: any)=> r.hour
          );
        // console.log(hours);

        let time: any[] = []
        for (let index = 0; index < hours.length; index++) {
          time = [...time, ...hours[index]]  
        }
        // console.log(this.hourlyForcastTime);
        this.hourlyForcast = time;

        this.weatherServ.getBackgroundImage(this.city).subscribe(
          (img: any) =>{
            this.backgroundImage = img.urls.regular
            // console.log(this.backgroundImage)
          }
        );

        const location = this.model.location
        const str = location.toLowerCase()
        console.log(str)
        
        if(this.historyList.includes(str)){
          // console.log('location exists');
          this.message = 'location exists';
        }else{
          this.historyList.push(str);
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
        let hours = this.data.forecast.forecastday.map(
          (r: any)=> r.hour
          );
        // console.log(hours);

        let time: any[] = []
        for (let index = 0; index < hours.length; index++) {
          time = [...time, ...hours[index]]  
        }
        // console.log(this.hourlyForcastTime);
        this.hourlyForcast = time;

        this.weatherServ.getBackgroundImage(this.city).subscribe(
          (img: any) =>{
            this.backgroundImage = img.urls.regular
            // console.log(this.backgroundImage)
          }
        );
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

  changeBackground(){
    this.backgroundImage = "https://photo-cdn2.icons8.com/Vr35Nbjxe0oYn4j9X1ClB8QsWfxkIYCe1FiUc-0y3sc/rs:fit:1429:1072/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5l/eHRlcm5hbC9hMmE0/Mi9kY2Y5MDU0Njg2/NDU0YjY5YWUwYWM4/MWIzZGRhMGI1OC5q/cGc.jpg"
    // this.weatherServ.getBackgroundImage(this.city).subscribe(
    //   (img: any) =>{
    //     this.backgroundImage = img.urls.full
    //     console.log(this.backgroundImage)
    //   }
    // );
    console.log(this.city)
  }

}
