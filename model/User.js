function User(id,username,password){
    this.id = id;
    this.username = username;
    this.password = password;
module.exports = User;
User.prototype.toString = function(){
    return this.id+"  "+this.username+"  "+this.password;
}