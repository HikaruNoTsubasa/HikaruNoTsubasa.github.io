"use strict";

class RichForYou {
  constructor(jqStart) {
    this.jqStart = $(jqStart);
    this.states = {
      countdownTime: 10
    };
    this.bless = [{
      fortune: '上上',
      sp: '明年無論在事業、工作、人際關係...各方面都非常的得心應手，做甚麼事情都能稱心如意，明年也會讓您忙的非常有功德。但要多多行善、多關心家人，注意自己身體健康、盡量有規律的生活。 ',
      videoId: 'pLFNEsBY8Rs'
    }, {
      fortune: '大吉',
      sp: '明年無論在事業、工作、人際關係...各方面都非常的得心應手，做甚麼事情都能稱心如意，明年也會讓您忙的非常有功德。但要多多行善、多關心家人，注意自己身體健康、盡量有規律的生活。 ',
      videoId: '18k1ljJ0SnA'
    }, {
      fortune: '上吉',
      sp: '明年無論在事業、工作、人際關係...各方面都非常的得心應手，做甚麼事情都能稱心如意，明年也會讓您忙的非常有功德。但要多多行善、多關心家人，注意自己身體健康、盡量有規律的生活。 ',
      videoId: 'C-LXky2LT5o'
    }, {
      fortune: '中吉',
      sp: '明年無論在事業、工作、人際關係...各方面都非常的得心應手，做甚麼事情都能稱心如意，明年也會讓您忙的非常有功德。但要多多行善、多關心家人，注意自己身體健康、盡量有規律的生活。 ',
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
    $('#js-fortune').text(_bless.fortune);
    $('#js-answerDestSub').html(_bless.sp);

    try {
      let player = new YT.Player('ytplayer', {
        height: '360',
        width: '640',
        videoId: _bless.videoId
      });
    } catch (msg) {
      const videoTmp = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${_bless.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      $('.answer-mv').append(videoTmp);
    }

    $('#subscribe').on('click', e => {
      e.preventDefault();
      this.saveToGdrive('subscribe');
      $('#js-subscribe').addClass('active');
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
      this.saveToGdrive('play'); // let countdownTime = 1000 * this.states.countdownTime // 倒數 n 秒
      // ;!function MyCounter() {
      //     if(countdownTime <= 0) {
      //         gameBody('back')
      //     } else {
      //         setTimeout(MyCounter, 1000)
      //     }
      //     countdownTime -= 1000
      // }()
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
    this.gameAnswer();
    this.devMode();
  }

}

$(() => {
  const richObj = new RichForYou('#start-box');
  richObj.main();
});
window.addEventListener('load', event => {
  $('#js-loader').fadeOut('slow');
});