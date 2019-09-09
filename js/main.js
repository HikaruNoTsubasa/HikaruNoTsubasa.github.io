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
  }

  startGame() {
    this.jqStart.find('.start-link').on('click', e => {
      const _this = $(e.currentTarget);

      const _index = this.jqStart.find('.start-link').index(_this);

      this.gameAnswer(_index);
      this.jqStart.stop(true, true).slideUp('fast');
      $('.alert').removeClass('invisible');
    });
  }

  gameAnswer(index) {
    const _bless = this.bless[index];
    let alertMsg = '';

    for (let i = 0; i < 3; i++) {
      alertMsg += `${_bless.method}的方法…`;
    }

    $('#alertMsg').text('').text(alertMsg);
    $('#blessing').text('').text(`${_bless.sp}加持`).parent().on('click', e => {
      e.preventDefault();
      window.location.href = _bless.url;
    });
    $('#readMore').on('click', e => {
      e.preventDefault();
      this.jqStart.stop(true, true).slideDown('fast');
      $('.alert').addClass('invisible');
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