#include "json.hpp"

using json = nlohmann::json;

#ifndef DATA_PERSISTECE_H
#define DATA_PERSISTECE_H

bool saveProducts(json product);

json getProducts();

#endif