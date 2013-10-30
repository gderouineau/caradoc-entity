/*
 * DEPEDENCIES
 */
var fs = require('fs');
var path = require('path');
var connection = require('caradoc-sql');

connection.connect();


/*
 * EXPORTATION OF ALL ENTITY FIND IN THE PROJET
 * You can use them  with the following command
 * var myEntity = require('caradoc-entity').myEntity;
 * the entity myEntity have to be define in Bundlename/entity/
 * and to inherit of method create from caradoc-entity
 */
var bundle = require('../../../config/routes').get;
var entityFound = {};
for(var key in bundle){
    (function(currentKey){
        var src = path.resolve(__dirname,"../../../src/"+bundle[currentKey].name+"/entity/");
        var list = fs.readdirSync(src);
        for (var i in list){
            var file = list[i].split('.'); // return the file name without the extension
            entityFound[file[0]] = require(src+'/'+list[i]).User; //add the give entity to the find method
        }
    })(key);
}


/*
 * use entity.persist(object)
 * persist transform object into SQL query and write it into a file
 */
var translate = require('./translate');
exports.persist = function(objet) {

    if(objet){
        var src = path.resolve(__dirname,'../../../config/data/SQL');
        fs.appendFile(src, translate(objet), function(err){
            if(err){
                console.log(err);
                return(false);
            }
            else {
                return(true);
            }
        });
        return(true);
    }
    else{
        return(false);
    }


};

/*
 * use entity.flush()
 * get the temporary file create by persist function and send it to SQL DB
 */
exports.flush = function() {
  var src = path.resolve(__dirname,'../../../config/data/SQL');
  fs.readFile(src, function(err, data){
     if(err){
         console.log(err);
         return(false);
     }
     else{


         var splitData = data.toString().split(';');
         for(var i in splitData){

             connection.query(splitData[i], function(err){

                 if(err){
                     return(false);
                 }
                 else{
                     fs.writeFile(src, '', function(err){
                         if(err){
                             return(false);
                         }
                         else{
                             return(true);
                         }
                     });
                     return(true);
                 }
             });
         }


         return(true);
     }
  });


};

/*
 * use entity.verify(objet);
 * get the objet and verify if it is properly declare to a database add
 */






exports.generate = entityFound;

exports.find = require('./method').find;

exports.queryManager =  require('./query');