import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

// I need to bring cookies in to store quiz questions and values

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  //Booleans
  public in_quiz: Boolean = false;
  public num_questions_flag: Boolean = false;

  //Error Messages
  public num_questions_error: String = "Error: must choose a number between 0 and 51";

  //User Variables
  public question_num: number;
  public question: string;
  public possible_answers: [string];
  public correct_answer: string;
  private array_index: number = 0;

  //quiz
  private quiz: JSON;

  constructor(private quiz_service: QuizService) { }

  ngOnInit(): void {
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
      this.quiz_question(this.quiz);
    }
    
    return;
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
  public quiz_question(quiz) {
    this.question_num = this.array_index + 1;
    this.question = quiz.results[this.array_index].question;
    this.possible_answers = quiz.results[this.array_index].incorrect_answers;
    this.possible_answers.push(quiz.results[this.array_index].correct_answer);
    this.shuffle_answers();
    this.array_index++;
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

}
