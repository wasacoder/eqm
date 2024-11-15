db.trees.insert({layer: "cont", ancestors: ["cust", "group", "root"], tree: "credit"});
db.trees.insert({layer: "cust", ancestors: ["group", "root"], tree: "credit"});
db.trees.insert({layer: "group", ancestors: ["root"], tree: "credit"});
db.trees.insert({layer: "root", ancestors: [], tree: "credit"});


db.trees.insert({layer: "branch", ancestors: ["root"], tree: "position"});
db.trees.insert({layer: "root", ancestors: [], tree: "position"});
