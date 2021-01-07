import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(
   private http: HttpClient
    ) { }

  //Get quiz from API and return JSON String
  public getData(numQuestions: string, category: string, difficulty: string, type: string): Promise<any> {
    const url: string = this.constructURL(numQuestions, category, difficulty, type);
    console.log(url);
    let promise = new Promise((resolve) => {
      setTimeout(() => {
        this.http.request("GET", url, {responseType: "json"}).subscribe((data)=> {
          resolve(data);
        });
      }, 5000);
    });
    return promise;
  }

  private constructURL(numQuestions: string, category: string, difficulty: string, type: string): string {
    let url: string = environment.API.url;
    url += `amount=${numQuestions}`;

    if(category != "") { url += `&category=${category}`; }
    if(difficulty != "") { url += `&difficulty=${difficulty}`; }
    if(type != "") { url += `&type=${type}`; }

    return url;
  }
    
}
