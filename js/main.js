"use strict";

class RichForYou {
  constructor(jqStart) {
    this.jqStart = $(jqStart);
    this.states = {
      countdownTime: 10
    };
    this.bless = [{
      method: '越施越富',
      sp: '財寶天王',
      videoId: 'pLFNEsBY8Rs'
    }, {
      method: '廣結善緣',
      sp: '作明佛母',
      videoId: '18k1ljJ0SnA'
    }, {
      method: '大開智慧',
      sp: '文殊菩薩',
      videoId: 'C-LXky2LT5o'
    }, {
      method: '長壽健康',
      sp: '長壽佛',
      videoId: 'o67Ui8khQjk'
    }];

    this.guestTime = (() => {
      const now = new Date();
      const [_year, _month, _day, _hours, _minutes, _seconds] = [now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()];
      return `${_year}-${_month}-${_day} ${_hours}:${_minutes}:${_seconds}`;
    })();

    this.guestIpObj = (() => {
      const ipifyUrl = 'https://api.ipify.org?format=jsonp&callback=?';
      return $.getJSON(ipifyUrl);
    })();
  }

  gameAnswer() {
    const indexRandom = function indexRandom(maxNumber, minNumber = 0) {
      return Math.floor(Math.random() * (+maxNumber - +minNumber)) + +minNumber;
    };

    const maxNumber = this.bless.length;
    const _bless = this.bless[indexRandom(maxNumber)];
    $('#js-answerTitle').text(_bless.method);
    $('#js-answerDesc').text(`${_bless.sp}加持`);
    let player = new YT.Player('ytplayer', {
      height: '360',
      width: '640',
      videoId: _bless.videoId
    });
    $('#subscribe').on('click', e => {
      e.preventDefault();
      this.saveToGdrive('subscribe');
      $('#js-subscribe').fadeIn('fast');
    });
  }

  gameBody(status = 'entry') {
    switch (status) {
      case 'entry':
        $('#countdown').show();
        $('#signing').addClass('active');
        $('#signStart').prop('disabled', true);
        $('#js-blessing').addClass('active').fadeIn('fast');
        break;

      default:
        $('#countdown').hide();
        $('#signing').removeClass('active');
        $('#signStart').prop('disabled', false);
        $('#js-blessing').removeClass('active').fadeOut('slow');
        let fancyboxDefaults = $.fancybox.defaults;
        fancyboxDefaults.animationEffect = "zoom-in-out";
        $.fancybox.open({
          src: '#js-answer',
          type: 'inline',
          opts: {
            afterShow: function (instance, current) {}
          }
        });
    }
  }

  startGame() {
    $('#signStart').on('click', e => {
      e.preventDefault();
      const gameBody = this.gameBody;
      gameBody();
      this.saveToGdrive('play');
      let countdownTime = 1000 * this.states.countdownTime // 倒數 n 秒
      ;
      !function MyCounter() {
        if (countdownTime <= 0) {
          gameBody('back');
        } else {
          setTimeout(MyCounter, 1000);
        }

        countdownTime -= 1000;
      }();
    });
  }

  saveToGdrive(guestStatus) {
    ;

    const _ip = (() => {
      try {
        return this.guestIpObj.responseJSON.ip;
      } catch (msg) {
        return '';
      }
    })();

    const ajaxOpts = {
      url: 'https://script.google.com/macros/s/AKfycbxgfyVf9xXWTEVz7ck_lLcIqhlE7MTb159wYbKq_mhPCqhOwh2j/exec',
      data: {
        method: 'write',
        time: this.guestTime,
        ip: _ip,
        browser: FRUBIL.client.name,
        status: guestStatus,
        note: `${FRUBIL.client.os}`
      }
    };
    $.ajax({
      type: 'post',
      data: ajaxOpts.data,
      url: ajaxOpts.url
    });
  }

  devSet() {
    this.states.countdownTime = 1;
  }

  devMode() {
    $('#signStart').trigger('click');
  }

  main() {
    // this.devSet()
    this.startGame();
    this.gameAnswer(); // this.devMode()
  }

}

$(() => {
  const richObj = new RichForYou('#start-box');
  richObj.main();
});