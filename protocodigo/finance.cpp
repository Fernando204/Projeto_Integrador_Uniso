#include <iostream>
#include <string>
#include <codecvt>
#include "libs/data_persistence.h"
#include <conio.h>


#pragma execution_character_set("utf-8")

using namespace std;

string to_utf8(const string input){
    wstring_convert<std::codecvt_utf8<wchar_t>> conv;
    wstring wide = wstring(input.begin(), input.end());

    return conv.to_bytes(wide);
}

void profit_targets(){
    cout << "================================";
    cout << "profit targets\n\n";

    cout << "chose one option:\n";

    cout << "1 - simulate profit percentage\n";
    cout << "2 - define default profit percentage\n";
    cout << "3 - define profit target\n";
    cout << "4 - back\n\n";

    int option;
    cin >> option;

    switch (option){
        case 1:
            cout << "================================";
            cout << "simulate profit percentage\n\n";

            cout << "insert cost price: ";
            double cost_price;
            cin >> cost_price;

            cout << "insert desired profit percentage: ";
            double profit_percentage;
            cin >> profit_percentage;

            cout << "selling percentage: " << cost_price * (1 + profit_percentage / 100) << "\n\n";
            break;
        case 2:
            cout << "define default profit percentage\n";
            break;
        case 3:
            cout << "define profit target\n";
            break;
        case 4:
            cout << "going back\n";
            return;
        default:
            cout << "invalid option, try again\n";
            return;
    }
}

void manage_products(){

    json product;
    string name;
    string validity;
    string supplier;
    double price;
    int quantity;

    cout << "================================";
    cout << "Manage Products\n\n";

    cout << "chose one option: \n";
    cout << "1 - Register Product\n";
    cout << "2 - Edit Product\n";
    cout << "3 - Delete Product\n";
    cout << "4 - consult products\n";
    cout << "5 - back\n\n";

    int option;
    cin >> option;

    switch (option){
    case 1:

        cout << "================================";
        cout << "Register Product\n\n";

        cout << "insert the product name: ";
        cin.ignore();
        getline(cin, name);

        cout << "insert the product price: ";
        cin >> price;
        while (cin.fail()){
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid input, please insert only numbers for price and try again: ";
            cin >> price;
        }

        cout << "insert the product quantity: ";
        cin >> quantity;
        while (cin.fail()){
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid input, please insert only numbers for quantity and try again: ";
            cin >> quantity;
        }

        cin.ignore();
        cout << "insert the product supplier: ";
        getline(cin,supplier);

        cout << "insert the product validity(MM/dd/YYYY): ";
        getline(cin,validity);

        product["name"] = name;
        product["price"] = price;
        product["quantity"] = quantity;
        product["supplier"] = supplier;
        product["validity"] = validity;

        saveProducts(product);
        break;
    case 4:
        cout << endl;
        product = getProducts();
        for(auto i= 0u;i<product.size();i++){
            cout << "=======================================================================================================================" << endl;
            cout << "ID: " << i 
                 << " | " << setw(11) << "Name: " << setw(12) << product[i]["name"] 
                 << " | " << setw(11) << "Price: " << setw(7) << product[i]["price"] 
                 << " | " << setw(11) << "Qauantity: " << setw(7) << product[i]["quantity"] 
                 << " | " << setw(11) << "supplier: " << setw(12) << product[i]["supplier"] 
                 << " | " << setw(11) << "Validity: " << setw(10) << product[i]["validity"] << endl;
        }
        break;
    default:
        cout << "invalid option, try again better\n";
        break;
    }
}

int main(){
    std::system("chcp 65001");
    std::system("cls");

    while (true){
        cout << "FINANCE CONTROL SYSTEM\n\n";
        cout << "chose one options:\n";
    
        cout << "1 - manage products\n";
        cout << "2 - manage sales\n";
        cout << "3 - manage clients\n";
        cout << "4 - profit targets\n";
        cout << "5 - exit\n\n";
        
        int option;
        cin >> option;

        switch (option){
            case 1:
                manage_products();
                break;
            case 2:
                cout << "manage sales\n";
                break;
            case 3:
                cout << "manage clients\n";
                break;
            case 4:
                profit_targets();
                break;
            case 5:
                cout << "exiting app\n";
                return 0;
            default:
                cout << "invalid option, try again\n";
        }
        cout << "Press any key to continue\n";
        _getch();
        system("cls");
    }
    
}
