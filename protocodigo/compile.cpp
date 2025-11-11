#include <iostream>

int main(){
    std::system("g++ data_persistence.cpp finance.cpp -o dist/finance -Wall -finput-charset=UTF-8 -fexec-charset=UTF-8");
    std::system("chcp 65001");
    std::system("cls");
    std::cout << "sucessful compiled" << std::endl;
}