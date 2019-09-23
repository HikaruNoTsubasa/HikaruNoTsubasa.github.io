"use strict";

class RichForYou {
  constructor(jqStart) {
    this.jqStart = $(jqStart);
    this.states = {
      countdownTime: 5
    };
    this.bless = [{
      fortune: '上上籤',
      sp: '2020年無論在事業、工作、人際關係...各方面都能得心應手，做什麼事情都能如魚得水，有很多的善緣、貴人會挺力相助。<br><br>2020年看來，也是忙碌充實的一年，這麼多緣境，要如何做到面面俱到、順利過關？以下是慈悲的 龍德上師對您明年運勢的一段珍貴開示，趕緊去看看吧！',
      videoId: 'PZfwbe7wdxg'
    }, {
      fortune: '大吉籤',
      sp: '2020年是成果豐碩的一年，人生具有代表性、關鍵性的指標在今年可以順利建立。立定好志向，放手一搏吧！有些一直改不了的壞習慣毛病、糾結很久的困境，今年都能正式告別解決。<br><br>2020年也會讓您忙得非常有功德。要多多行善、多關心家人。注意自己身體健康、維持規律的生活。 以下是慈悲的 龍德上師對您明年運勢的一段珍貴開示，趕緊去看看吧！',
      videoId: 'K0TCQgRVe0k'
    }, {
      fortune: '上吉籤',
      sp: '2020年是立定志向一年。面對很多緣境，不要忘記如何去取捨，好的我們應該擷取它，不好的應立即斷除遠離捨棄！<br><br>2020年新的一年到來，好好檢視自身，把那些積累很久的陳年問題，積極明快的面對，您將會有個嶄新、改頭換面的自己。以下是慈悲的 龍德上師對您明年運勢的一段珍貴開示，趕緊去看看吧！',
      videoId: 'wGrkrwIXs3w'
    }, {
      fortune: '中吉籤',
      sp: '2020年是勇敢拚搏的一年。很多事情不要流於形式要有積極的進取心，不要迷失。心裡要有明確的方向，堅定持續的去做，不用再擔憂而躊躇不前了，一切都是最好的安排，一切將會有截然不同的局面！<br><br>一心想改變命運之人，不會浪費時間在抱怨上。以下是慈悲的 龍德上師對您明年運勢的一段珍貴開示，趕緊去看看吧！',
      videoId: 'pDn1HGoVZk8'
    }, {
      fortune: '中平籤',
      sp: '平順就是福！2020年腳踏實地、穩紮穩打的把基本功練好吧！無論是該補足的技能、該經營的人脈、該修補的關係，努力的積資淨障、廣結善緣吧！<br><br>2020年建議您不要好高騖遠，坐這山望那山，就依循您最初設定的目標，穩健的步伐向前邁去吧！當在您想要做些什麼改變的時候，會有些許違緣逆境來障礙，不要擔心，以下是慈悲的 龍德上師對您明年運勢的一段珍貴開示，趕緊去看看吧！',
      videoId: 'f3H4xfKbwWA',
      videoStart: 291
    }, {
      fortune: '中下籤',
      sp: '看到自己的問題，努力改變吧！2020年對您來說是勇敢面對自己問題的一年，會有許多緣境在2020年都相繼伴隨發生了，不斷地調整修補、懺悔業障。要相信『命由我作、福自己求』，只要能多行善積德，積極地和冤親債主求解冤釋結，一切會大不相同！<br><br>2020年看來，您要有比以往更多的耐心、同理心來面對處理生活中的大小事，以下是慈悲的 龍德上師對您明年運勢的一段珍貴開示，趕緊去看看吧！',
      videoId: 'x4vJVvCqkgQ'
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
    const ytOpts = {
      height: 360,
      width: 640,
      videoId: _bless.videoId
    };

    if (_bless.videoStart) {
      ytOpts.startSeconds = _bless.videoStart;
    } else {
      ytOpts.startSeconds = 0;
    }

    try {
      let player;
      onYouTubeIframeAPIReady();

      function onYouTubeIframeAPIReady() {
        player = new YT.Player('ytplayer', {
          videoId: ytOpts.videoId,
          startSeconds: ytOpts.startSeconds,
          playerVars: {
            start: ytOpts.startSeconds
          },
          events: {
            onReady: event => {
              player.playVideo();
            }
          }
        });
      }
    } catch (msg) {
      const videoTmp = `<iframe width="${ytOpts.width}" height="${ytOpts.height}" src="https://www.youtube.com/embed/${ytOpts.videoId}?start=${ytOpts.startSeconds}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      $('.answer-mv').append(videoTmp);
    }

    $('#subscribe').on('click', e => {
      e.preventDefault();

      const _url = $(e.currentTarget).data('href');

      $(e.currentTarget).prop('disabled', true);
      this.saveToGdrive('subscribe', _url);
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

  saveToGdrive(guestStatus, subscribeUrl) {
    ;

    const _ip = (() => {
      try {
        return this.guestIpObj.responseJSON.ip;
      } catch (msg) {
        return '';
      }
    })();

    const [_browser, _note] = (() => {
      if (FRUBIL) {
        return [FRUBIL.client.name, FRUBIL.client.os];
      }

      return ['error', 'can not import FRUBIL'];
    })();

    const toSubscribe = url => {
      window.location.href = url;
    };

    const ajaxOpts = {
      type: 'post',
      url: 'https://script.google.com/macros/s/AKfycbxgfyVf9xXWTEVz7ck_lLcIqhlE7MTb159wYbKq_mhPCqhOwh2j/exec',
      data: {
        method: 'write',
        time: this.guestTime,
        ip: _ip,
        browser: _browser,
        status: guestStatus,
        note: `${_note}`
      }
    };

    if (guestStatus === 'subscribe') {
      ajaxOpts.complete = () => {
        toSubscribe(subscribeUrl);
      };
    }

    $.ajax(ajaxOpts);
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
window.addEventListener('load', event => {
  $('#js-loader').fadeOut('slow');
  $('#wrap').css('visibility', 'visible');
});