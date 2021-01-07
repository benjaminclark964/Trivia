import { Component, OnInit } from '@angular/core';

//Services
import { QuizService } from './quiz.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  //Booleans
  public in_quiz: Boolean = false;
  public num_questions_flag: Boolean = false;
  public display_results: Boolean = false;
  public answer_selected_flag: Boolean = false;
  public not_selected_flag: Boolean = false;

  //Error Messages
  public num_questions_error: string = "Error: must choose a number between 0 and 51";
  public select_question_error: string = "You must choose a question before continuing";

  //User Variables
  public question_num: number;
  public question: string;
  public possible_answers: [string];
  private user_answers: [string] = [""];
  public correct_answer: string;
  private array_index: number = 0;
  private num_questions = 0;
  private answer_index = 0;
  private selected_answer: string;

  //quiz
  private quiz: JSON;

  constructor(private quiz_service: QuizService, private cookie: CookieService) { }

  ngOnInit(): void {
    if(this.cookie.check("user_quiz")) {
      this.in_quiz = true;
      this.getCurrentQuestion();
    }
  }

  //Send user input to quiz service to get quiz
  public async submit() {
    const num_questions = (<HTMLInputElement>document.getElementById("num_questions")).value;
    const category = (<HTMLSelectElement>document.getElementById("category_types")).value
    const difficulty = (<HTMLSelectElement>document.getElementById("select_difficulty")).value;
    const type = (<HTMLSelectElement>document.getElementById("select_type")).value;

    // function to verify amount of questions are valid
    if(this.valid_num_questions(num_questions)){
      this.quiz = await this.quiz_service.getData(num_questions, category, difficulty, type);
      console.log(this.quiz);
      this.in_quiz = true;
      this.num_questions = Number(num_questions);
      this.quiz_question();
    }
    return;
  }

  //Ends quiz for the user
  public endQuiz() {
    this.cookie.delete("user_quiz");
    localStorage.clear();
    this.in_quiz = false;
    this.display_results = false;
    this.array_index = 0;
    this.question_num = 1;
    this.user_answers = [""];
  }

  //Validate user input for number of questions as valid
  private valid_num_questions(num_questions): Boolean {
    if(num_questions > 50 || num_questions < 1) { 
      this.num_questions_flag = true; 
      return false; 
    }
    this.num_questions_flag = false;
    return true;
  }

  //Set user variables to be displayed to the user
  public quiz_question() {
    if(this.array_index != 0 && this.answer_selected_flag == false) {
      this.not_selected_flag = true;
      return;
    }

    this.answer_selected_flag = false;

    if(this.cookie.check("user_quiz")) {
      let quiz_json = this.cookie.get("user_quiz");
      this.quiz = JSON.parse(localStorage.getItem("quiz"));
      this.question_num = JSON.parse(quiz_json).question_num;
      this.question = JSON.parse(quiz_json).question;
      this.possible_answers = JSON.parse(quiz_json).possible_answers;
      this.array_index = JSON.parse(quiz_json).array_index;
      this.user_answers = JSON.parse(localStorage.getItem("user_answers"));
      this.update_quiz(this.quiz);
    } else {
      this.update_quiz(this.quiz);
    }
  }

  private update_quiz(quiz) {
      this.question_num = this.array_index + 1;
      if(this.question_num == this.num_questions+1) { 
        this.user_answers[this.array_index] = this.selected_answer;
        localStorage.setItem("user_answers", JSON.stringify(this.user_answers));
        this.results();
        return;
      }
      this.user_answers[this.array_index] = this.selected_answer;
      console.log(this.user_answers);
      this.question = quiz.results[this.array_index].question;
      this.possible_answers = quiz.results[this.array_index].incorrect_answers;
      this.possible_answers.push(quiz.results[this.array_index].correct_answer);
      this.shuffle_answers();
      this.array_index++;
      this.createLocalStorage();
  }

  //display results to the user
  private results() {
    this.in_quiz = false;
    this.display_results = true;

    this.getCurrentQuestion();

    
  }

  //shuffle array of answers
  private shuffle_answers(): [string] {
      let currentIndex: number = this.possible_answers.length, randomIndex; 
      let temporaryValue: string = ""; 
    
      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = this.possible_answers[currentIndex];
        this.possible_answers[currentIndex] = this.possible_answers[randomIndex];
        this.possible_answers[randomIndex] = temporaryValue;
      }
    return this.possible_answers
  }

  //Use cookie for current question info and local storage for
  //entire quiz JSON
  private createLocalStorage() {
    let values = [
      {Field: "question_num", Value: this.question_num},
      {Field: "num_questions", Value: this.num_questions},
      {Field: "question", Value: this.question},
      {Field: "possible_answers", Value: this.possible_answers},
      {Field: "array_index", Value: this.array_index},
    ];

    let q = JSON.stringify(this.quiz);
    localStorage.setItem("quiz", q);
    localStorage.setItem("user_answers", JSON.stringify(this.user_answers));

    let quiz_object = {};
    values.forEach(items => quiz_object[items.Field] = items.Value);
    let json = JSON.stringify(quiz_object);
    this.cookie.set("user_quiz", json, 1);
  }

  public answer_selected(id_index) {
    if(this.answer_selected_flag) { document.getElementById(`answer${this.answer_index}`).style.backgroundColor = "black"; }
    this.not_selected_flag = false;

    let id = `answer${id_index}`;
    document.getElementById(id).style.height = "25px"
    document.getElementById(id).style.backgroundColor = "yellow";
    document.getElementById(id).style.borderRadius = "33px";
    this.answer_index = id_index;
    this.selected_answer = document.getElementById(id).innerText;
    this.answer_selected_flag = true;
  }

  //get current question if browser is refreshed
  private getCurrentQuestion() {
    let quiz_json = this.cookie.get("user_quiz");
    this.quiz = JSON.parse(localStorage.getItem("quiz"));
    this.question_num = JSON.parse(quiz_json).question_num--;
    this.question = JSON.parse(quiz_json).question;
    this.possible_answers = JSON.parse(quiz_json).possible_answers;
    this.array_index = JSON.parse(quiz_json).array_index--;
    this.num_questions = JSON.parse(quiz_json).num_questions;
    this.user_answers = JSON.parse(localStorage.getItem("user_answers"));
  }

}
