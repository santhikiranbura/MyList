if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme",'slateblue');
  } 
theme=localStorage.getItem("theme");
$(document).ready(function(){
    $("th").css("color", theme);
    $("#add").css("background-color",theme);
    $("#add_item").css("background-color",theme);
    $(".sidenav").css("background-color",theme);
    $(".title").css("color",theme);
});
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
//   document.getElementById("main").style.marginLeft="250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
//   document.getElementById("main").style.marginLeft="0";
}
openNav();

current_index=-1;
items_per_page=7;
function isvalid(list_name){
    if(!list_name||localStorage.getItem(list_name)){
        return false;
    }
    return true;
}

var app = angular.module("myApp", []);
app.controller("myCtrl", ['$scope', '$http','$window',function($scope,$http,$window) {
    $scope.theme=theme;
    $scope.current_page=-1;
    $http.get('names.json').then(function(response) {
        $scope.name_list=[];
        $scope.name_list=response.data.names;
    });
    list_names=JSON.parse(localStorage.getItem("list_names"));
    console.log(list_names);
    if(list_names===null)
        list_names=[];
    $scope.list_names = list_names;
    $scope.pages_style={
        'background-color':'white',
        'color':$scope.theme,
        'border':'1px solid '+$scope.theme
    }
    $scope.active={
        'background-color':$scope.theme,
        'color':'white'
    }
    if($scope.list_names.length==0)
    {
        $scope.nolistsadded=true;
        document.getElementById('list_data').style.display="none";
        document.getElementById('add').style.display="none";
    }
    else
        $scope.nolistsadded=false;
    $scope.create_list=function(){
        var list_name=window.prompt("List Name");
        if(list_name===null)
            return;
        if(!isvalid(list_name)){
            $scope.create_list();
        }
        else{
            list_items=[];
            list_names.push(list_name);
            localStorage.setItem("list_names",JSON.stringify(list_names));
            localStorage.setItem(list_name, JSON.stringify(list_items));
            openNav();
            $scope.nolistsadded=false;
            
        }
    };
    $scope.delete_list=function(index){
        list_names= $scope.list_names;
        list_name=list_names[index];
        const check= confirm("Do you really want to delete '"+list_name+"'");
        if(check){
            localStorage.removeItem(list_name);
            $scope.list_names.splice(index, 1);
            localStorage.setItem("list_names",JSON.stringify($scope.list_names));
            if($scope.list_names.length==0)
            {
                $scope.nolistsadded=true;
                document.getElementById('list_data').style.display="none";
                document.getElementById('add').style.display="none";
                document.getElementById('form').style.display="none";

            }
        }
        
    };
    $scope.paginate=function(index){
        $scope.current_page=index;
        
        items=JSON.parse(localStorage.getItem(list_names[current_index]));
        start=index*items_per_page;
        if(start+items_per_page<items.length)
            end=start+items_per_page;
        else
            end=items.length;
        $scope.items=items.slice(start,end);
    };
    $scope.show_list=function(index){
        if(current_index!=-1)
            document.getElementById('list'+current_index).style.color="white";
        document.getElementById('list'+index).style.color="black";
        $scope.pages=[];
        current_index=index;
        document.getElementById('add_form').style.display="block";
        items=JSON.parse(localStorage.getItem(list_names[current_index]));
        total_rows=items.length
        if(total_rows>0){
            $scope.noitemsadded=false;
            $scope.header=true;
        }
        else
        {
            $scope.noitemsadded=true;
            $scope.header=false;
        }
        page_number=1;
        i=0;
        while(i+items_per_page<=total_rows){
            $scope.pages.push(page_number);
            page_number++;
            i=i+items_per_page;
        }
        if(items.length-$scope.pages.length*items_per_page>0){
                $scope.pages.push(page_number);
        }
        document.getElementById('list_data').style.display="block";
        document.getElementById('add').style.display="block";
    document.getElementById('form').style.display="none";

        closeNav();
        $scope.paginate(0); 
    };
    
    $scope.add_item=function(){
        var name=$scope.name;
        var quantity=$scope.quantity;
        var units=$scope.units;
        if(name && quantity && units){
            items=JSON.parse(localStorage.getItem(list_names[current_index]));
            var item={name:name,quantity:quantity,units:units};
            items.push(item);
            if($scope.pages.length*items_per_page<items.length)
            {
                $scope.pages.push($scope.pages.length+1);
            }
            localStorage.setItem(list_names[current_index],JSON.stringify(items));
            $scope.paginate($scope.pages.length-1);
            document.getElementById('add_form').reset();
            $('.toast').toast({delay: 3000,position:'bottom center'});
            $('.toast').toast('show');
        } 
        if(items.length>0){
            $scope.noitemsadded=false;
            $scope.header=true;
        }
        else
        {
            $scope.noitemsadded=true;
            $scope.header=false;
        }
    };
    $scope.delete_item=function(index){
        const check= confirm("Do you really want to delete this item");
        if(check){
            items=JSON.parse(localStorage.getItem(list_names[current_index]));
            items.splice($scope.current_page*items_per_page+index,1);
            localStorage.setItem(list_names[current_index],JSON.stringify(items));
            if($scope.pages.length*items_per_page-items.length>=items_per_page){
                $scope.pages.pop();
            }
            if($scope.current_page<$scope.pages.length)
                $scope.paginate($scope.current_page);
            else
                $scope.paginate($scope.pages.length-1);
            if(items.length>0){
                $scope.noitemsadded=false;
                $scope.header=true;
            }
            else
            {
                $scope.noitemsadded=true;
                $scope.header=false;
            }
        }
        
    };
    $scope.change_color=function(color){
        theme=color;
        $scope.theme=color;
        $scope.pages_style={
            'background-color':'white',
            'color':$scope.theme,
            'border':'1px solid '+$scope.theme
        }
        $scope.active={
            'background-color':$scope.theme,
            'color':'white'
        }
        $("th").css("color", theme);
        $("#add").css("background-color",theme);
        $("#add_item").css("background-color",theme);
        $(".sidenav").css("background-color",theme);
        $(".title").css("color",theme);

        localStorage.setItem("theme",theme);

    }
    

}]);

function showform(){
    document.getElementById('list_data').style.display="none";
    document.getElementById('form').style.display="block";
    
}
function closeform(){
    document.getElementById('list_data').style.display="block";
    document.getElementById('form').style.display="none";
}