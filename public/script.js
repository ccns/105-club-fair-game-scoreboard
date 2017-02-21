$.ajax({
  type: "GET",
  url: "http://ctc.ccns.ncku.edu.tw/api/rank",
  dataType: "jsonp",
  success: function(res) {
    var data = res.data;
    var cntdown = 5;
    for(i in data) {
      if(cntdown-- == 0) break;
      var d = data[i];
      var divName = $('<div class="name"></div>').text(d.name);
      var divScore = $('<div class="score"></div>').text(d.score);
      var divBody = $('<div class="body"></div>').append(divName).append(divScore);
      $("#scoreboard").append(divBody);
    }
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

      var detail = "https://github.com/ccns/106-club-fair-game-problems/tree/master/"+d.type+"/"+d.no;
      var divDetail = $('<div class="detail"></div>').append($('<a target="_blank"><button class="btn btn-default">Detail</button></a>').attr("href", detail));

      var divBody = $('<div class="body"></div>').append(divType).append(divNo).append(divTitle).append(divScore).append(divDetail);
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
          $("#submit-btn").text("Wrong!");
        } else if(status == 3) {
          // dup submit
          $("#submit-btn").addClass("btn-warning");
          $("#submit-btn").text("Duplicated!");
        } else {
          $("#submit-btn").addClass("btn-success");
          $("#submit-btn").text("Correct!");
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
