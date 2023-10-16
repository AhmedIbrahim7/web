var Typer = {
  text: "",
  accessCountimer: null,
  index: 0,
  speed: 3,
  file: "",
  currentText: "",
  accessCount: 0,
  deniedCount: 0,
  init: function () {
    this.accessCountimer = setInterval(function () {
      Typer.updLstChr();
    }, 500);
    $.get(this.file, function (data) {
      Typer.text = data.slice(0, -1);
    });
  },
  
  content: function () {
    return this.currentText;
  },

  write: function (str) {
    this.currentText += str;
  },

  addText: function (key) {
    if (key.keyCode == 18) {
      Typer.accessCount++;

      if (Typer.accessCount >= 3) {
        Typer.makeAccess();
      }
    } else if (key.keyCode == 20) {
      Typer.deniedCount++;

      if (Typer.deniedCount >= 3) {
        Typer.makeDenied();
      }
    } else if (key.keyCode == 27) {
      Typer.hidepop();
    } else if (Typer.text) {
      var cont = Typer.content();
      if (cont.substring(cont.length - 1, cont.length) == "|")
        $("#console").html(
          $("#console")
            .html()
            .substring(0, cont.length - 1)
        );
      if (key.keyCode != 8) {
        Typer.index += Typer.speed;
      } else {
        if (Typer.index > 0) Typer.index -= Typer.speed;
      }
      var text = Typer.text.substring(0, Typer.index);
      var rtn = new RegExp("\n", "g");

      $("#console").html(text.replace(rtn, "<br/>"));
      window.scrollBy(0, 50);
    }

    if (key.preventDefault && key.keyCode != 122) {
      key.preventDefault();
    }

    if (key.keyCode != 122) {
      // otherway prevent keys default behavior
      key.returnValue = false;
    }
  },

  updLstChr: function () {
  var consoleContent = $("#console").html();

  // Check if animation is done
  if (Typer.index >= Typer.text.length) {
    if (!consoleContent.endsWith("|")) {
      $("#console").html(consoleContent + "|");
    }
  } else {
    if (consoleContent.endsWith("|")) {
      $("#console").html(consoleContent.slice(0, -1));
    } else {
      $("#console").html(consoleContent + "|");
    }
  }
}


  
  animateText: function() {
    this.addText({ keyCode: 123748 });

    if (this.index <= this.text.length) {
      requestAnimationFrame(this.animateText.bind(this));
    }
  }
};

function replaceUrls(text) {
  var http = text.indexOf("http://");
  var space = text.indexOf(".me ", http);

  if (space != -1) {
    var url = text.slice(http, space - 1);
    return text.replace(url, '<a href="' + url + '">' + url + "</a>");
  } else {
    return text;
  }
}

// var timer = setInterval("t();", 30);
// function t() {
//   Typer.addText({ keyCode: 123748 });

//   if (Typer.index > Typer.text.length) {
//     clearInterval(timer);
//   }
// }
Typer.speed = 3;
Typer.file = "info.html";
Typer.init();
Typer.animateText();
