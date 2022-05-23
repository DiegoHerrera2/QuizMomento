#include <iostream>

#include "quiz.h"

int main() {
    srand(time(NULL));
    int num_questions;
    std::cout << "Numero de preguntas: ";
    std::cin >> num_questions;
    Quiz quiz("test.txt", num_questions);
    quiz.Start();

    return 0;
}