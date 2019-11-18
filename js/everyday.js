"use strict";

class DayBless {
  constructor(global) {
    this.global = global;
    this.states = {
      countdownTime: 5
    };
    this.sets = {
      today: moment(),
      manjushriDays: {
        初一: '受福-吉',
        初二: '官事',
        初三: '歡喜-吉',
        初四: '富貴-吉',
        初五: '面黑',
        初六: '神通-吉',
        初七: '康寧-吉',
        初八: '壽長-吉',
        初九: '聞法-吉',
        初十: '記別-吉',
        十一: '眼明-吉',
        十二: '困苦',
        十三: '少白',
        十四: '神定-吉',
        十五: '大吉-吉',
        十六: '向益-吉',
        十七: '多病',
        十八: '犯盜',
        十九: '悟道-吉',
        二十: '禍崇',
        二一: '患難',
        二二: '受俱-吉',
        二三: '多聞-吉',
        二四: '證果-吉',
        二五: '鬥諍',
        二六: '祥瑞-吉',
        二七: '瘡癬',
        二八: '受寃',
        二九: '長慧-吉',
        三十: '如意-吉'
      },
      chtDay: {
        Sun: '日',
        Mon: '一',
        Tue: '二',
        Wed: '三',
        Thu: '四',
        Fri: '五',
        Sat: '六'
      }
    };

    this.guestIpObj = (() => {
      const ipifyUrl = 'https://api.ipify.org?format=jsonp&callback=?';
      return $.getJSON(ipifyUrl);
    })();

    this.cached = (() => {
      if (!!localStorage.getItem('blessCal')) {
        const cachedObj = JSON.parse(localStorage.getItem('blessCal'));

        if (cachedObj.date === this.sets.today.format('YYYY-MM-DD')) {
          return cachedObj;
        } else {
          return {
            date: this.sets.today.format('YYYY-MM-DD')
          };
        }
      } else {
        return {
          date: this.sets.today.format('YYYY-MM-DD')
        };
      }
    })();
  }

  calBbuild() {
    const todayStr = this.sets.today.format('YYYY-MM-DD');
    const calDbSet = {
      baseUrl: 'https://spreadsheets.google.com/tq?',
      key: '1TMZHX9LRmb6ROdXsysHY5hKFubWuM2klz51xLOGYSLE',
      gid: 0,
      sql: encodeURI(`select * where A = date '${todayStr}'`),
      callback: 'calRender'
    };
    const calDbUrl = `${calDbSet.baseUrl}tqx=responseHandler:${calDbSet.callback}&tq=${calDbSet.sql}&key=${calDbSet.key}&gid=${calDbSet.gid}`;
    $.getScript(calDbUrl);

    this.global[calDbSet.callback] = json => {
      const today = this.sets.today;
      const chtDay = this.sets.chtDay[today.format('ddd')];
      const jsonrow = json.table.rows[0].c;
      const lunarStr = jsonrow[1].v;
      const manjushriValue = this.sets.manjushriDays[lunarStr.slice(lunarStr.length - 2)];
      $('#js-date').text(today.format('YYYY.MM.DD') + '(' + chtDay + ')').fitText(1.05);
      $('.bless-title').fitText(0.9);
      $('.cal-lunar__val').text(lunarStr);

      if (manjushriValue.indexOf('-') > -1) {
        $('.cal-manjushri__val').addClass('good').text(manjushriValue.slice(0, 2));
      } else {
        $('.cal-manjushri__val').text(manjushriValue);
      }

      if (jsonrow[2] !== null && jsonrow[2].v !== null) {
        const spArr = jsonrow[2].v.split(',');

        for (const spValue of spArr) {
          $('.cal-spDay').append(`<div class="item">${spValue}</div>`);
        }
      }

      if (jsonrow[3] !== null && jsonrow[3].v !== null) {
        const blessArr = jsonrow[3].v.split(',');

        for (const blessValue of blessArr) {
          $('.buddha-info .list').append(`<li><div class="item">${blessValue}</div></li>`);
        }
      }

      $('#js-preToday').text(this.sets.today.format('MM.DD'));
    };
  }

  saveToGdrive(guestStatus, subscribeUrl, fortune) {
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
      url: 'https://script.google.com/macros/s/AKfycbx20Lla6yjYC26h7QDNDGv5tTZ-Mft1EhAIWVqYotrtXxjm85Pk/exec',
      data: {
        method: 'write',
        time: this.sets.today.format('YYYY-MM-DD hh:mm:ss'),
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

      ajaxOpts.data.note = `${fortune}: ${_note}`;
    }

    $.ajax(ajaxOpts);
  }

  btnBind() {
    $('.btn--bless').on('click', () => {
      $('body').addClass('day');

      if (!!this.cached.percent) {
        alert('您已經看過今日運勢囉😊');
        this.dayViewCached();
      } else {
        this.dayView();
      }
    });
    $('#subscribe').on('click', e => {
      e.preventDefault();

      const _url = $(e.currentTarget).data('href');

      $(e.currentTarget).prop('disabled', true);
      this.saveToGdrive('subscribe', _url, $('#js-blessNum').text());
    });
  }

  dayViewCached() {
    const [_percent, _blessContent] = [this.cached.percent, this.cached.blessContent];
    const ytOpts = {
      videoId: this.cached.videoId,
      width: '100%',
      height: 300,
      startSeconds: this.cached.startSeconds
    };
    let player;
    let blessContentHtml = '';

    const _moonPerc = (() => {
      const moonMinValue = 40 / 100;
      const exportMoonValue = moonMinValue * _percent;
      return `inset ${exportMoonValue}px -10px #eccc68`;
    })();

    $('#js-blessMoon').css({
      'box-shadow': _moonPerc
    });
    $('#js-blessNum').text(_percent);

    for (const item of _blessContent) {
      blessContentHtml += `<p>${item}</p>`;
    }

    $('#js-blessContent').append(blessContentHtml);
    anime.timeline({
      easing: 'easeOutElastic(1, .8)',
      begin: () => {
        try {
          function onYouTubeIframeAPIReady() {
            player = new YT.Player('ytplayer', {
              videoId: ytOpts.videoId,
              playerVars: {
                start: ytOpts.startSeconds
              }
            });
          }

          onYouTubeIframeAPIReady();
        } catch (msg) {
          const videoTmp = `<iframe width="${ytOpts.width}" height="${ytOpts.height}" src="https://www.youtube.com/embed/${ytOpts.videoId}?start=${ytOpts.startSeconds}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
          $('#ytplayer').append(videoTmp);
        }
      },
      complete: () => {
        anime.timeline({
          complete: () => {
            player.playVideo();
          }
        }).add({
          targets: '.wrap--day .page-footbox',
          height: '20.5vh',
          begin: () => {
            $('.page-footbox').addClass('active');
          }
        }).add({
          targets: '.wrap--day .ytbox, .wrap--day .ripple',
          opacity: 1
        });
      }
    }).add({
      targets: '#js-blessMoon',
      keyframes: [{
        opacity: 1,
        duration: 750,
        translateY: -10
      }, {
        translateY: 0,
        duration: 250
      }],
      delay: 1000
    }).add({
      targets: '#js-blessNum',
      keyframes: [{
        fontSize: '3em',
        duration: 750
      }, {
        fontSize: '1em',
        duration: 250
      }]
    }, 1000).add({
      targets: '.bless__main p',
      top: 0,
      duration: 250,
      opacity: 1,
      delay: anime.stagger(300),
      easing: 'linear'
    });
  }

  dayView() {
    const fadeTime = 800;

    const indexRandom = function indexRandom(maxNumber, minNumber = 1) {
      return Math.floor(Math.random() * (+maxNumber - +minNumber)) + +minNumber;
    };

    const blessDbSet = {
      baseUrl: 'https://spreadsheets.google.com/tq?',
      key: '1TMZHX9LRmb6ROdXsysHY5hKFubWuM2klz51xLOGYSLE',
      gid: 307467837,
      sql: encodeURI(`select * where A = ${indexRandom(10)}`),
      callback: 'blessRender'
    };
    const blessDbUrl = `${blessDbSet.baseUrl}tqx=responseHandler:${blessDbSet.callback}&tq=${blessDbSet.sql}&key=${blessDbSet.key}&gid=${blessDbSet.gid}`;
    $.getScript(blessDbUrl);

    this.global[blessDbSet.callback] = json => {
      const dayViewData = json.table.rows[0].c;
      const [_percent, _blessContent] = [dayViewData[1].v || 90, dayViewData[2].v.split(',') || '今天的您，看來事事得心應手、順心如意、所求皆能如意滿願：),想辦法讓自己的心很穩定，不要心隨萬境波,趁有福報的時候，應該搶時間修福，要時時提醒自己打從我們從娘胎出世，無常就在逼著我們。,無常來了，順境一彈指剎那之間就會變成大逆境！<br>我們要修擺脫三惡道的業力習氣，不要很茫茫然的過日子，要積極的成辦自他二利。'];
      this.cached.percent = _percent;
      this.cached.blessContent = _blessContent;
      const ytOpts = {
        videoId: dayViewData[4].v || '4ozNk1G4Ao8',
        width: '100%',
        height: 300,
        startSeconds: dayViewData[5].v || 0
      };
      this.cached.videoId = ytOpts.videoId;
      this.cached.startSeconds = ytOpts.startSeconds;
      localStorage.setItem('blessCal', JSON.stringify(this.cached));
      let player;
      let blessContentHtml = '';

      const _moonPerc = (() => {
        const moonMinValue = 40 / 100;
        const exportMoonValue = moonMinValue * _percent;
        return `inset ${exportMoonValue}px -10px #eccc68`;
      })();

      $('#js-blessMoon').css({
        'box-shadow': _moonPerc
      });
      $('#js-blessNum').text(_percent);

      for (const item of _blessContent) {
        blessContentHtml += `<p>${item}</p>`;
      }

      $('#js-blessContent').append(blessContentHtml);
      anime.timeline({
        easing: 'easeOutElastic(1, .8)',
        begin: () => {
          try {
            function onYouTubeIframeAPIReady() {
              player = new YT.Player('ytplayer', {
                videoId: ytOpts.videoId,
                playerVars: {
                  start: ytOpts.startSeconds
                } // events: {
                //     onReady: event => {
                //     }
                // }

              });
            }

            onYouTubeIframeAPIReady();
          } catch (msg) {
            const videoTmp = `<iframe width="${ytOpts.width}" height="${ytOpts.height}" src="https://www.youtube.com/embed/${ytOpts.videoId}?start=${ytOpts.startSeconds}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            $('#ytplayer').append(videoTmp);
          }
        },
        complete: () => {
          anime.timeline({
            complete: () => {
              player.playVideo();
            }
          }).add({
            targets: '.wrap--day .page-footbox',
            height: '20.5vh',
            begin: () => {
              $('.page-footbox').addClass('active');
            }
          }).add({
            targets: '.wrap--day .ytbox, .wrap--day .ripple',
            opacity: 1
          });
        }
      }).add({
        targets: '#js-blessMoon',
        keyframes: [{
          opacity: 1,
          duration: 750,
          translateY: -10
        }, {
          translateY: 0,
          duration: 250
        }],
        delay: 1000
      }).add({
        targets: '#js-blessNum',
        keyframes: [{
          fontSize: '3em',
          duration: 750
        }, {
          fontSize: '1em',
          duration: 250
        }]
      }, 1000).add({
        targets: '.bless__main p',
        top: 0,
        duration: 250,
        opacity: 1,
        delay: anime.stagger(300),
        easing: 'linear'
      });
    };
  } // devSet() {
  //     this.states.countdownTime = 1
  // }


  devMode() {
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
    $('.btn--bless').trigger('click');
  }

  main() {
    // this.devSet()
    // this.startGame()
    // this.gameAnswer()
    this.calBbuild();
    this.btnBind(); // this.devMode()
  }

}

$(() => {
  const blessObj = new DayBless(window);
  blessObj.main();
});
window.addEventListener('load', event => {
  $('#js-loader').fadeOut('slow');
  $('#wrap').css('visibility', 'visible');
});