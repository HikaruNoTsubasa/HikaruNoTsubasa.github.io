class BathBuddha {
  constructor(debug) {
    this.debug = debug;

    if (this.debug) {
      this.data = {
        bathCountMax: 1,
        singTime: 1000 * 1
      };
    } else {
      this.data = {
        bathCountMax: 3,
        singTime: 1000 * 60 * 10
      };
    }
  }

  init() {
    const that = this;
    const bathCountMax = this.data.bathCountMax - 1;
    let bathCount = 0;
    $('#js-bath-audio').jPlayer({
      ready: function () {
        $(this).jPlayer("setMedia", {
          mp3: "mv/short.mp3"
        });
      },
      ended: function () {
        bathCount++;
        $('#js-bath-current').text(`${bathCount}次`);

        if (bathCount > bathCountMax) {
          that.sing();
        }
      },
      preload: 'auto',
      swfPath: "js/library/jplayer/jplayer",
      supplied: "mp3",
      volume: 0.3,
      cssSelectorAncestor: "",
      cssSelector: {
        play: "#js-bath"
      }
    });
    this.stepSwitch(0);
  }

  stepSwitch(stepNum) {
    const stepJq = $('.homebox-sub').fadeOut(400);
    stepJq.eq(stepNum).addClass('active');
  }

  sing() {
    const that = this;
    this.stepSwitch(1);
    $('#js-blessing').addClass('active');
    $('#js-long-audio').jPlayer({
      ready: function () {
        $(this).jPlayer("setMedia", {
          mp3: "mv/long5m.mp3"
        }).jPlayer("play");
        setTimeout(() => {
          that.storeForm();
        }, that.data.singTime);
      },
      ended: function () {},
      preload: 'auto',
      volume: 0.3,
      swfPath: "js/library/jplayer/jplayer",
      supplied: "mp3",
      cssSelectorAncestor: ""
    });
  }

  storeForm() {
    $('#js-long-audio').jPlayer('destroy');
    this.stepSwitch(2);
    $('#js-stored-data').submit(function (event) {
      event.preventDefault();
      $('#js-jqmeter').jQMeter({
        goal: '$1,000',
        raised: '$530',
        width: '100%',
        height: '5vh'
      });
    });
  } // devSet() {
  //     this.states.countdownTime = 1
  // }
  // devMode() {
  //     $('#signStart').off('click').on('click', e => {
  //         e.preventDefault()
  //         const gameBody = this.gameBody
  //         gameBody()
  //         // this.saveToGdrive('play')
  //         let countdownTime = 1000 * this.states.countdownTime // 倒數 n 秒
  //         function MyCounter() {
  //             if(countdownTime <= 0) {
  //                 gameBody('back')
  //             } else {
  //                 setTimeout(MyCounter, 1000)
  //             }
  //             countdownTime -= 1000
  //         }
  //         // MyCounter()
  //     })
  //     $('#signStart').trigger('click')
  // }


  main() {
    // this.devSet()
    this.init();

    switch (this.debug) {
      case 2:
        this.sing();
        break;

      case 3:
        this.storeForm();
        break;
    } // this.devMode()

  }

}

$(() => {
  const bathObj = new BathBuddha(1);
  bathObj.main();
});
window.addEventListener('load', event => {
  $('#js-loader').fadeOut('slow');
  $('#wrap').css('visibility', 'visible');
});