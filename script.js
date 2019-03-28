function bandiere(lang){

  switch (lang) {
    case "en":
      return "img/Great Britain.svg";

    case "ja":
      return "img/Japan.svg";

    case "it":
      return "img/Italy.svg";

    case "zh":
      return "img/China.svg";

    default:
    return "";
  }
}

function filmst(data,voto){

  var fList = $(".Lista")
  var template = $("#film-template").html();
  var comp = Handlebars.compile(template);
  var film = comp(data);
  var item = $(film);

  var stars = item.find("li.stars").children(".fa-star");

  for (var i = 0; i < voto; i++) {
    stars.eq(i).addClass("accesa");
  }

  item.appendTo(fList);

}


function risult(list,type){

  for (var i = 0; i < list.length; i++) {

    var item = list[i];
    var voto = Math.ceil(item.vote_average/2);
    var dati = {
      rating: voto,
    }
    // copertine
    if (item.poster_path != null){

      dati.poster = "https://image.tmdb.org/t/p/w154/" + item.poster_path;
    }
    else{

      dati.poster = "img/no-image.jpg"
    }
    //film

    if(type == "movie"){

      dati.titolo = item.title;
      dati.ogTitolo = item.original_title;
      dati.tipo = "film"
    }
    // tv
    else if(type == "tv"){

      dati.titolo = item.name;
      dati.ogTitolo = item.original_name;
      dati.tipo = "tv-show"
    }
    // flag
    var flagUrl = bandiere(item.original_language);

    if( flagUrl != ""){
      dati.lingua = "";
      dati.flag = flagUrl;
    }

    else{
      dati.lingua = item.original_language;
      dati.flag = "";
    }

    filmst(dati,voto);
  }
}

function call(search,page,type){
 var outData = {
   api_key: "b8ca694b2f9226dda5d3eccb948bd6ae",
   language: "it-IT",
   query: search,
   page: page,
  }

  var url = "https://api.themoviedb.org/3/search/" + type;

  $.ajax({
    url: url,
    data: outData,
    method: "GET",
    success: function(inData, stato){
      if(page == "" &&  inData.total_pages > 1 && type == "movie"){
        genPages(inData.total_pages);
      }
      if (type == "movie" && ( page == inData.total_pages  || inData.total_pages == 1 || inData.total_results == 0 )){
        call(search,"","tv");
      }
      console.log(inData.results);
      if(inData.total_results > 0){

        risult(inData.results,type);
      }
    },
    error: function(request, stato ,error){
      console.log("error");
    }
  })
}

function genPages(pageNum){
  var pages = $(".pagine");

  console.log(pageNum);
  for (var i = 1; i <= pageNum; i++) {
    var dati = {
      number: i,
    }
    var template = $("#ptemplate").html();
    var comp = Handlebars.compile(template);
    var pNum = comp(dati);
    pages.append(pNum);
  }
  pages.children(".pagine-num").eq(0).addClass("current")
}

function clickPage(){
  var pages = $(".pagine");
  pages.on("click",".pagine-num",function(){
    var pag = parseInt($(this).text(),10);
    $(".Lista").empty()
    call( $("#search-input").val(), pag , "movie");

    pages.children().removeClass("current");
    $(this).addClass("current");
  })
}
function valor(elem){
  $(".Lista").empty();
  $(".pagine").empty();
  call(elem.val(),"","movie")
}

function init(){
  var srcImp = $("#search-input");
  var srcBtn = $("#search-button");
  srcImp.keyup(function(e){

    if(e.keyCode == 13 ){valor(srcImp);}
  });

  srcBtn.click(function(){
    valor(srcImp);
  })
  clickPage();
}

$(document).ready(init)
