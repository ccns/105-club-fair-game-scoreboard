var expanded = false;

$.ajax({
  type: "GET",
  url: "http://ctc.ccns.ncku.edu.tw/api/rank",
  dataType: "jsonp",
  success: function(res) {
    var data = res.data;
    var limit = 5;
    for(i in data) {
      var d = data[i];
      var divName = $('<div class="name"></div>').text(d.name);
      var divScore = $('<div class="score"></div>').text(d.score);
      var divBody = $('<div class="body"></div>').append(divName).append(divScore);
      if(i>=limit) divBody.hide();
      $("#scoreboard").append(divBody);
    }
    if(data.length > 5) {
      var btnMore = $('<button id="more-btn" class="btn btn-default">More...</button>').click(function() {
        $("#scoreboard :hidden").show();
        $(this).hide();
        expanded = true;
      })
    } else {
      expanded = true;
    }
    $("#scoreboard").append(btnMore);
  }
});

$.ajax({
  type: "GET",
  url: "http://ctc.ccns.ncku.edu.tw/api/problems",
  dataType: "jsonp",
  success: function(res) {
    var data = res.data;
    for(i in data) {
      var d = data[i];
      var divType = $('<div class="type"></div>').text(d.typeName);
      var divNo = $('<div class="no"></div>').text(d.no);
      var divTitle = $('<div class="title"></div>').text(d.title);
      var divScore = $('<div class="score"></div>').text(d.score);
      var divSolved = $('<div class="solved"></div>').text(d.solved);

      var detail = "https://github.com/ccns/106-club-fair-game-problems/tree/master/"+d.type+"/"+d.no;
      var divDetail = $('<div class="detail"></div>').append($('<a target="_blank"><button class="btn btn-default">Detail</button></a>').attr("href", detail));

      var divBody = $('<div class="body"></div>').append(divType).append(divNo).append(divTitle).append(divScore).append(divSolved).append(divDetail);
      $("#problems").append(divBody);
    }
  }
});

$("#submit-btn").click(function() {
  var name = $("#submit-name").val();
  var flag = $("#submit-flag").val();

  console.log(flag);
  if(flag.match(":") === null) {
    $.ajax({
      type: "GET",
      url: "http://ctc.ccns.ncku.edu.tw/api/submit?id="+name+"&flag="+flag,
      dataType: "jsonp",
      success: function(res) {
        var status = res.status;
        if(status == 1) {
          $("#submit-btn").addClass("btn-warning");
          $("#submit-btn").text("Name Invalid!");
        } else if(status == 2) {
          $("#submit-btn").addClass("btn-warning");
          $("#submit-btn").text("Wrong!");
        } else if(status == 3) {
          // dup submit
          $("#submit-btn").addClass("btn-warning");
          $("#submit-btn").text("Duplicated!");
        } else {
          $("#submit-btn").addClass("btn-success");
          $("#submit-btn").text("Correct!");
          var data = res.data;
          var div = $("#scoreboard>.body").filter(function() {
            return $(this).find(".name").text() === data.name;
          });
          if(div.length)
            div.find(".score").text(data.score);
          else {
            var divName = $('<div class="name"></div>').text(data.name);
            var divScore = $('<div class="score"></div>').text(data.score);
            var divBody = $('<div class="body"></div>').append(divName).append(divScore);
            $("#scoreboard").append(divBody);
          }
          sortScoreboard();
        }
        $("#submit-btn").removeClass("btn-default");
        setInterval(resetSubmit, 3000);
      }
    });
  } else {
    alert("Don't send the flag including colon sign!");
  }
});

$("#submit-flag").on("input", function() {
  var flag = $(this).val().split(":");
  if(flag.length > 2 && flag[0] == "CHICKEN" && flag[flag.length-1] == "ATTACK") {
    var rep = flag[1];
    for(var i=2; i<flag.length-1; i++) rep += ':'+flag[i];
    $(this).val(rep);
  }
})

function resetSubmit() {
  $("#submit-btn").removeClass("btn-success");
  $("#submit-btn").removeClass("btn-warning");
  $("#submit-btn").addClass("btn-default");
  $("#submit-btn").text("Submit!");
}

function sortScoreboard() {
  $("#scoreboard>.body").sort(function (a, b) {
    var contentA = parseInt( $(a).find(".score").text());
    var contentB = parseInt( $(b).find(".score").text());
    return (contentA < contentB) ? 1 : (contentA > contentB) ? -1 : 0;
  }).appendTo("#scoreboard");
  if(!expanded) {
    $("#scoreboard>.body").each(function(i) {
      if(i<5) $(this).show();
      else $(this).hide();
    });
  } else {
    $("#scoreboard").append($("#more-btn"))
  }
}
