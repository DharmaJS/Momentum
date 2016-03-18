/*
    Author: Luiz Guilherme de Paula Santos (Harry)
    Date: 23/11/2015
    About:  Javascript library to set elements's values from query string
            and return data 
*/
var Momentum = {
    values: function () {
        var query_string = {};
        var vars = window.location.search.substring(1).split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if (typeof query_string[pair[0]] === "undefined")
                query_string[pair[0]] = decodeURIComponent(pair[1]);
            else if (typeof query_string[pair[0]] === "string") 
                query_string[pair[0]] = [query_string[pair[0]],decodeURIComponent(pair[1]) ];
            else
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
        } 
        return query_string;
    }(),

    // IGNORED
        ignore_hidden: false,
        ignored_names: [],
        addIgnoredName: function(name){
            this.ignored_names.push(name);
        },
        isIgnoredName: function(name){
            var i = this.ignored_names.length;
            while (i--){
                if (this.ignored_names[i] === name){
                    return true;
                }
            }
            return false;
        },

    // add objects that are not posted to be updated according to parameter
        addById: function(){

        },

    // METHODS
        load: function(){
            for(var key in this.values){
                var values = this.values[key];

                elements = document.getElementsByName(key);

                for(var i = 0; i< elements.length; i++) {
                    element = elements[i];

                    if(values.constructor != Array){
                        values = [values];
                    }

                    for(var value in values){
                        switch(element.tagName.toLowerCase()){
                            case "select":
                                for(var j = 0; j < element.options.length; j++)
                                    if  (
                                                element.options[j].value == values[value]
                                            ||  values[value] == "{all}"
                                        )
                                        element.options[j].selected = "selected";
                                break;

                            case "input":
                                switch(element.getAttribute('type'))
                                {
                                    case "checkbox":
                                        if(element.value == values[value])
                                            element.checked = "true";
                                        break;

                                    case "hidden":
                                        if(!this.ignore_hidden)
                                            element.value = values[value];
                                        break;

                                    default:
                                        element.value = values[value];
                                        break;
                                }
                                break;
                        }
                    }
                }
            }
        },

        get: function(){
            values = "";

            // SELECTS
                selects = document.getElementsByTagName("select");
                for(var int_selects = 0; int_selects < selects.length; int_selects++){
                    select = selects[int_selects];
                    
                    if(!this.isIgnoredName(select.name))
                    {
                        new_value = "";
                        int_selected = 0;

                        for(var int_option = 0; int_option <  select.options.length; int_option++)
                        {
                            if  (select.options[int_option].selected){
                                new_value += "&" + select.name + "=" + select.options[int_option].value;
                                int_selected++;
                            }
                        }

                        if(new_value != "")
                        {
                            if(int_selected == select.options.length)
                                values += "&" + select.name + "={all}";
                            else
                                values += new_value;


                        }
                    }

                }

            // INPUTS
                inputs = document.getElementsByTagName("input");
                for(var int_inputs = 0; int_inputs < inputs.length; int_inputs++){
                    input = inputs[int_inputs];
                    if  (!this.isIgnoredName(input.name)){
                        new_value = "&" + input.name + "=" + input.value;
                        if  (
                                    input.type != "checkbox" 
                                &&  input.type != "radiobutton"
                            )
                        {
                            if  (
                                        input.value != null 
                                    &&  input.value != ""
                                )
                                values += new_value ;
                        }
                        else if(input.checked){
                            values += new_value ;
                        }
                    }
                }

            return values;
        }
};