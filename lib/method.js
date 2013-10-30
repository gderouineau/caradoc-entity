
var connection = require('caradoc-sql');

var path = require('path');
var fs = require('fs');

connection.connect();


exports.find = function(objectName){

    var entity = require('caradoc-entity');
    var Object = new entity.generate['user']();
    var queryAll = 'SELECT * FROM '+ objectName ;
    this['all'] = connection.query(queryAll);



    /*
     *  find(object).ByX(value)
     *
     * THOSE METHODS DO NOT WORK
     */

    //console.log(Object);
    for(var key in Object){
        var query = 'SELECT * FROM user WHERE ' + key + "=\'";
        if (((key.toString().toLowerCase() != "params")
            &&  (key.toString().toLowerCase() != "inheritfrom")
            && (key.toString().toLowerCase() != "entityname"))) {
            (function(insideQuery, obj){
                addMethod("By"+key, obj, function(args) {

                        insideQuery+= args + "\'";
                        console.log(insideQuery);
                        return(connection.query(insideQuery));
                    });

            })(query, this);
        }
    }

    function addMethod(key, obj,  fn){
      obj[key] = fn;
    }

    /*
     * find () .by
     *  args = {
     *      where :{
     *          value1 : value ,
     *          value2 : value
     *      },
     *      order :{
     *          value1 :ASC/DESC
     *      }
     *      limit :{
     *          offset : X ,
     *          ligne  : X
     *      }
     *
     */

    this['by'] =  function(args) {
        var query = "SELECT * FROM " + objectName ;
        var compteur = 0;
        var whereQuery = '';
        var orderQuery = '';
        var limitQuery = '';
        for(var value in args) {
            if (value.toString().toLowerCase() == 'where') {
                whereQuery+= " WHERE ("
                for(var subValue in args[value]){
                    if(compteur == 0) {
                        whereQuery += subValue + "=" + "\'" + args[value][subValue] + "\' ";
                        compteur++;
                    }
                    else {
                        whereQuery += " && " + subValue + "=" + "\'" + args[value][subValue] + "\' ";
                    }
                }
                whereQuery += ")";
            }
            if(value.toString().toLowerCase() == 'order') {
                orderQuery += " ORDER BY ";
                for(var subValue in args[value]){
                    orderQuery += " " + subValue + " " + args[value][subValue];
                }
            }
            if(value.toString().toLowerCase() == 'limit') {
                limitQuery += " LIMIT ";
                for(var subValue in args[value]){
                    orderQuery += " " + args[value]['offset'] + "," + args[value]['ligne'];
                }
            }
        }
        query += whereQuery + orderQuery + limitQuery;
        console.log(query);
        return(connection.query(query));
    };


/*
 * find () .oneBy
 *  args = {
 *      where :{
 *          value1 : value ,
 *          value2 : value
 *      }
 */
    this['oneBy'] =  function(args) {
        var query = "SELECT * FROM " + objectName ;
        var compteur = 0;
        var whereQuery = '';
        var orderQuery = '';
        var limitQuery = '';
        for(var value in args) {
            if (value.toString().toLowerCase() == 'where') {
                whereQuery+= " WHERE ("
                for(var subValue in args[value]){
                    if(compteur == 0) {
                        whereQuery += subValue + "=" + "\'" + args[value][subValue] + "\' ";
                        compteur++;
                    }
                    else {
                        whereQuery += " && " + subValue + "=" + "\'" + args[value][subValue] + "\' ";
                    }
                }
                whereQuery += ")";
            }
            if(value.toString().toLowerCase() == 'limit') {
                limitQuery += " LIMIT 0,1";
            }
        }
        query += whereQuery + orderQuery + limitQuery;
        console.log(query);
        return(connection.query(query));
    };

/*
 * add custom queries
 *
 *
 *
 */

    var bundle = require('../../../config/routes').get;
    var entityFound = {};
    for(var key in bundle){
        (function(currentKey, obj){
            var src = path.resolve(__dirname,"../../../src/"+bundle[currentKey].name+"/entityRepo/");
            var list = fs.readdirSync(src);
            for (var i in list){
                var file = list[i].split('.'); // return the file name without the extension
                if(file[0].toString().toLowerCase() == objectName.toString().toLowerCase())
                entityFound[file[0]] = require(src+'/'+list[i]); //add the give entity to the find method

                for(var newKey in entityFound['user']){
                    var fn = entityFound['user'];

                    addMethod(newKey, obj ,function(args){
                        var query = fn[newKey](args);
                        return(connection.query(query));

                    });
                }
            }
        })(key, this);
    }
    console.log(this);
};


