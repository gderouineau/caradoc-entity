/**
 * Created by GD on 25/10/2013.
 */
var language = require('../../../config/params/db').data.dialect;

module.exports = function(data, action) {
    var translateData ='';
    action ="insert";
    if(language.toLowerCase() == 'mysql') {

        translateData = toMYSQL(data, action);
        return(translateData);
    }
    else if(language.toLowerCase() == 'sqlite'){

        translateData = toSQLITE(data, action);
        return(translateData);
    }
    else if(language.toLowerCase() == 'postgre'){

        translateData = toPOSTGRE(data, action);
        return(translateData);
    }
    else {
        return('false');
    }

};

function toMYSQL (data, action){
    var translateData = '';
    var table = data.params.EntityName;
        table = table.toLowerCase();
    var column = " (";
    var value = " VALUES (";
    var compteur = 0;
    if (action.toLowerCase() ==  "insert"){
        translateData+= "INSERT INTO "+table;
        for(key in data){
            if((key.toString().toLowerCase() != "params")
                &&(key.toString().toLowerCase() != "inheritfrom")
                &&(key.toString().toLowerCase() != "entityname"))
            {

                if(compteur == 0){
                    column += key;
                    if(data[key] == null){
                        value += data[key];
                    }
                    else{
                        value += '\''+data[key]+'\'';
                    }
                }
                else{
                    column += ',' + key;
                    if(data[key] == null){
                        value += ','+data[key];
                    }
                    else{
                        value += ',\''+data[key]+'\'';
                    }
                }

            compteur++;
            }
        }
    }
    translateData+= ' '+ column +') '+ value + ');';
    return(translateData);
}

function toSQLITE (data, action){
    var translateData = JSON.stringify(data);

    return(translateData);
}

function toPOSTGRE (data, action){
    var translateData = JSON.stringify(data);

    return(translateData);
}
