/**
 * Created by GD on 27/10/2013.
 */
module.exports = function(){

    this.done  ="";
    this.select = function(select) {
        this.done += "SELECT * FROM "+select;
    }
    this.where = function(select) {
        this.done + " WHERE ";
    }


} ;