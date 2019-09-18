"use strict";

class RichForYou {
  constructor(jqStart) {
    this.jqStart = $(jqStart);
    this.states = {
      countdownTime: 10
    };
    this.bless = [{
      method: '想要增長福德、壽命、智慧',
      sp: '每天聽此咒，可累積無數善緣及財富！<br>「嗡 臧巴拉 雜列 扎耶 梭哈」',
      videoId: 'pLFNEsBY8Rs'
    }, {
      method: '想要增加好人緣',
      sp: '服務大家的事情，廣結善緣的事情要多做，不要一點福都沒有了，還在那裡嬌縱，孤芳自賞。覺得好像自己很了不起，你不跟我互動，我才不屑跟你互動，還傻到這樣，你都已經沒福了，沒有福報。',
      videoId: '18k1ljJ0SnA'
    }, {
      method: '想要開啟智慧',
      sp: '搞不清楚就不叫智慧，在那邊模模糊糊的模稜兩可，我知道，可是我做不到，那叫沒有智慧。有智慧，你看文殊菩薩代表智慧的大菩薩，劍都指著自已的頭，對不對？當斷則斷，沒有那邊藕斷絲連的，該怎麼做，就怎麼做，非常的清楚，非常的分明。',
      videoId: 'C-LXky2LT5o'
    }, {
      method: '想要長壽健康',
      sp: '唯有戒殺護生',
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
    $('#js-answerDesc').html(`${_bless.sp}`);

    try {
      let player = new YT.Player('ytplayer', {
        height: '360',
        width: '640',
        videoId: _bless.videoId
      });
    } catch (msg) {
      console.log('YT api include error.');
    }

    $('#subscribe').on('click', e => {
      e.preventDefault();
      this.saveToGdrive('subscribe');
      $('#js-subscribe').fadeIn('fast');
      $(e.currentTarget).remove();
    });
  }

  gameBody(status = 'entry') {
    switch (status) {
      case 'entry':
        $('#countdown').show();
        $('#signing').removeClass('active');
        $('#signStart').prop('disabled', true);
        $('#js-blessing').addClass('active').fadeIn('fast');
        break;

      default:
        $('#countdown').hide();
        $('#js-blessing').removeClass('active').fadeOut('slow');
        let fancyboxDefaults = $.fancybox.defaults;
        fancyboxDefaults.animationEffect = "zoom-in-out";
        $.fancybox.open({
          src: '#js-answer',
          type: 'inline',
          opts: {
            afterClose: (instance, current) => {
              $('#signStart').prop('disabled', false);
              $('#signing').addClass('active');
            }
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