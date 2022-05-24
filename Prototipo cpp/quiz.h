#include <iostream>
#include <set>
#include <vector>
#include <fstream>
#include <sstream>
#include <cstdlib>
#include <string>

const std::string kAlfabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

class Quiz {
 public:
  Quiz(std::string filename, int num_questions);

  void Start();
  void Ask();

 private:
  int num_questions_{50};
  std::vector<std::pair<std::string, std::string>> questions_;
  std::vector<std::string> answers_;
  int cualification{0};
  int current_question{0};
  std::vector<int> wrong_answered_questions_;
};

Quiz::Quiz(std::string filename, int num_questions) {
  num_questions_ = num_questions;

  std::set<int> index_list;
  while (index_list.size() < num_questions_) {
    int random_number = rand() % 50;
    index_list.insert(random_number);
  }

  std::ifstream file(filename);
  std::string line;

  // when the line index is in the set, add it to the vector
  // use a sstream to split the line with the delimiter ":"
  // if the first element is "1", then it is a true or false question
  // if the first element is "2", then it is a multiple choice question
  int counter = 0;
  while (std::getline(file, line)) {
    
    if (index_list.find(counter) != index_list.end()) {
    std::stringstream ss(line);
    std::string type;
    std::string question;
    std::string answer;
    std::getline(ss, type, ':');
    if (type == "1") {
      std::getline(ss, question, ':');
      std::getline(ss, answer, ':');
      // change all the - in the questions to a new line
      // do it in a while loop and exit when there are no more -
      while (question.find("-") != std::string::npos) {
        question.replace(question.find("-"), 1, "\n");
      }
      questions_.push_back(std::make_pair(question, ""));
      answers_.push_back(answer);
    } else if (type == "2") {
      std::string choices;
      std::string choices_number;
      int choices_number_int;
      std::getline(ss, question, ':');
      while (question.find("-") != std::string::npos) {
        question.replace(question.find("-"), 1, "\n");
      }
      std::getline(ss, choices_number, ':');
      choices_number_int = std::stoi(choices_number);
      for (int i = 0; i < choices_number_int; i++) {
        std::string temp;
        std::getline(ss, temp, ':');
        choices += temp + ";";
      }
      std::getline(ss, answer, ':');
      questions_.push_back(std::make_pair(question, choices));
      answers_.push_back(answer);
    }
    }
    counter++;
  }

  for (int i = questions_.size() - 1; i > 0; i--) {
    int j = rand() % (i + 1);
    std::swap(questions_[i], questions_[j]);
    std::swap(answers_[i], answers_[j]);
  }
}

void Quiz::Start() {
  for (int i = 0; i < num_questions_; i++) {
    Ask();
  }
  std::cout << "Your cualification is: " << cualification << std::endl;
  std::cout << "You answered " << wrong_answered_questions_.size() << " wrong questions" << std::endl;
  if (wrong_answered_questions_.size() > 0) {
    std::cout << "The wrong answered questions are: " << std::endl;
    for (int i = 0; i < wrong_answered_questions_.size(); i++) {
      std::cout << questions_[wrong_answered_questions_[i]].first << std::endl << std::endl;
    }
  }
}

void Quiz::Ask() {
    std::cout << questions_[current_question].first << std::endl;
  // if the second part of the question is empty, it is a true or false question
  //Print a line between the question and the answer
  std::cout << "------------------------------------------" << std::endl;
  if (questions_[current_question].second == "") {
    std::cout << "Verdadero " << std::endl;
    std::cout << "Falso " << std::endl;
    char answer;
    std::cin >> answer;
    if (std::toupper(answer) == answers_[current_question][0]) {
      cualification++;
    }
    else {
      wrong_answered_questions_.push_back(current_question);
    }

  } else {
    std::string choices = questions_[current_question].second;
    std::stringstream ss(choices);
    std::string choice;
    int counter{0};
    while (std::getline(ss, choice, ';')) {
      std::cout << kAlfabet[counter] << "): " << choice << std::endl;
      counter++;
    }
    char answer;
    std::cin >> answer;
    if (std::toupper(answer) == kAlfabet[std::stoi(answers_[current_question]) - 1]) {
      cualification++;
    }
    else {
      wrong_answered_questions_.push_back(current_question);
    }
  }
  current_question++;
}