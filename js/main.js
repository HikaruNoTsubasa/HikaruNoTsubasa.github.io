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
      const apikey = '69ad1df9-6265-46e6-bd8d-3936a46a1a00';
      return $.getJSON(`https://api.smartip.io/?api_key=${apikey}`);
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

  ytSubscribe() {
    const ytSets = {
      url: 'https://www.googleapis.com/youtube/v3/subscriptions',
      channelId: 'UCCtXYzHX4BITjdGCE8i3adQ'
    };
    const apiKeySets = {
      key: 'AIzaSyCv6tg95Y5UirOdT-qQ15rWEti_67KlrOI'
    };
  }

  saveToGdrive(guestStatus) {
    console.log(this.guestIpObj);
    const clientObj = this.guestIpObj.responseJSON;
    const ajaxOpts = {
      url: 'https://script.google.com/macros/s/AKfycbxgfyVf9xXWTEVz7ck_lLcIqhlE7MTb159wYbKq_mhPCqhOwh2j/exec',
      data: {
        method: 'write',
        time: this.guestTime,
        ip: clientObj.ip,
        browser: clientObj['user-agent'].name,
        status: guestStatus,
        note: clientObj.location.city
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
  richObj.main(); // gapi.load("client:auth2", function() {
  //     gapi.auth2.init({client_id: "35925579276-q9tqfg61qhturs062qsddt4opkiptc1p.apps.googleusercontent.com"});
  //   });
});