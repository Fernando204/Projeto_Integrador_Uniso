#include <iostream>
#include <fstream>
#include "json.hpp"

#include "libs/data_persistence.h"

using namespace std;
using json = nlohmann::json;

const string productFile = "database/products.json";

bool saveProducts(json product){
    json products;
    ifstream file(productFile);

    if(file.is_open() && file.peek() != ifstream::traits_type::eof()){
        file >> products;
        file.close();

    }else{
        cout << "creating new file\n";
        products = json::array();
    }

    products.push_back(product);

    ofstream oFile(productFile);
    if(!oFile.is_open()){
        cout << "error in opening file to write";
        return false;
    }
    oFile << products.dump(3);
    oFile.close();
    return true;
}

json getProducts(){
    ifstream file(productFile);
    json products;
    if(file.is_open()){
        file >> products;
        file.close();
        return products;
    }else{
        cout << "error on read archive!\n";
        return 0;
    }
}