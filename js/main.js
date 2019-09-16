"use strict";

class RichForYou {
  constructor(jqStart) {
    this.jqStart = $(jqStart);
    this.bless = [{
      method: '越施越富',
      sp: '財寶天王',
      url: 'https://www.youtube.com/watch?v=pLFNEsBY8Rs'
    }, {
      method: '廣結善緣',
      sp: '作明佛母',
      url: 'https://www.youtube.com/watch?v=18k1ljJ0SnA'
    }, {
      method: '大開智慧',
      sp: '文殊菩薩',
      url: 'https://www.youtube.com/watch?v=C-LXky2LT5o'
    }, {
      method: '長壽健康',
      sp: '長壽佛',
      url: 'https://www.youtube.com/watch?v=o67Ui8khQjk'
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

  startGame() {
    $('#signStart').on('click', e => {
      e.preventDefault();
      $('#signing').addClass('active');
      $('#countdown').show();
      this.saveToGdrive('play');
      let countdownTime = 1000 * 3 // 倒數 n 秒
      ;
      !function MyCounter() {
        if (countdownTime <= 0) {
          $('#countdown').hide();
          $('#signing').removeClass('active');
        } else {
          $('#countdown__value').text(countdownTime / 1000);
          setTimeout(MyCounter, 1000);
        }

        countdownTime -= 1000;
      }();
    });
  }

  gameAnswer(index) {
    const _bless = this.bless[index];
    let alertMsg = '';

    for (let i = 0; i < 3; i++) {
      alertMsg += `${_bless.method}的方法…`;
    }

    $('#alertMsg').text('').text(alertMsg);
    $('#blessing').text('').text(`${_bless.sp}加持`);
    $('#readMore').on('click', e => {
      e.preventDefault();
      this.jqStart.stop(true, true).slideDown('fast');
      $('.alert').addClass('invisible');
    });
    $('#subscribe').on('click', e => {
      e.preventDefault();
    });
  }

  saveToGdrive(guestStatus) {
    const _ip = this.guestIpObj.responseJSON.ip || '';

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

  main() {
    this.startGame();
  }

}

$(() => {
  const richObj = new RichForYou('#start-box');
  richObj.main();
});