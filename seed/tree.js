db.trees.insert({layer: "cont", ancestors: ["cust", "group"], tree: "credit"});
db.trees.insert({layer: "cust", ancestors: ["group"], tree: "credit"});
db.trees.insert({layer: "group", ancestors: [], tree: "credit"});

db.trees.insert({layer: "branch", ancestors: ["head"], tree: "credit"});
db.trees.insert({layer: "head", ancestors: [], tree: "credit"});

db.trees.insert({layer: "branch", ancestors: ["head"], tree: "position"});
db.trees.insert({layer: "head", ancestors: [], tree: "position"});
