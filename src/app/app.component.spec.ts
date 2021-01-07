import { TestBed } from '@angular/core/testing';

//Components
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component'

//Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';

//Providers
import { CookieService } from 'ngx-cookie-service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppComponent, QuizComponent, AboutComponent ],
      imports: [ BrowserModule, BrowserAnimationsModule, MatTabsModule, HttpClientModule ],
      providers: [ CookieService ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'trivia'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('trivia');
  });
});
