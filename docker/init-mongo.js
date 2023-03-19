db.getSiblingDB('admin').auth(
    "root",
    "rootpwd"
);
db.createUser({
    user: "user",
    pwd: "password",
    roles: ["readWrite"],
});