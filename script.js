// 360px未満はviewportを固定
(() => {
  const viewport = document.querySelector('meta[name="viewport"]');
  const switchViewport = () => {
    const value =
      window.outerWidth > 360
        ? 'width=device-width,initial-scale=1'
        : 'width=360';
    if (viewport.getAttribute('content') !== value) {
      viewport.setAttribute('content', value);
    }
  }
  window.addEventListener('resize', switchViewport);
  switchViewport();
})();

document.addEventListener('DOMContentLoaded', () => {
// fade
  const observerOptions = {
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
      }
    });
  }, observerOptions);
  const targetElements = document.querySelectorAll('.js-fade, .js-fadeUp');
  targetElements.forEach(target => {
    observer.observe(target);
  });

// 診断コンテンツ
  const startButton = document.querySelector('.js-start-button');
  const diagnosisItems = document.querySelectorAll('.l-diagnosis__item');
  let currentStep = 0;
  const points = {
    immediate: 0,
    finish: 0,
    durability: 0,
    sideEffects: 0
  };
  // 初期表示設定（スタートボタン）
  startButton.addEventListener('click', () => {
    diagnosisItems.forEach((item, index) => {
      if (index === 1) {
        item.classList.add('active');
        currentStep = 1;
      } else {
        item.classList.remove('active');
      }
    });
    togglePrevButton(currentStep);
    toggleNextButton(currentStep);
  });
  // 回答ボタンがクリックされたときの処理
  const handleAnswerClick = (event) => {
    const answerElement = event.target.closest('.l-diagnosis__answer-button');
    if (answerElement) {
      updatePoints(answerElement);
      setInactiveAnswers(answerElement);
      toggleNextButton(currentStep);
      if (currentStep < 6) {
        showNextQuestion();
      }
      if (currentStep === 6) {
        showResultButton();
      }
    }
  };
  // 次の質問を表示する処理
  const showNextQuestion = () => {
    if (currentStep < 6) {
      diagnosisItems[currentStep].classList.remove('active');
      currentStep++;
      diagnosisItems[currentStep].classList.add('active');
      togglePrevButton(currentStep);
      toggleNextButton(currentStep);
    }
  };
  // 前の質問を表示する処理
  const showPrevQuestion = () => {
    if (currentStep > 1) {
      diagnosisItems[currentStep].classList.remove('active');
      currentStep--;
      diagnosisItems[currentStep].classList.add('active');
      togglePrevButton(currentStep);
      toggleNextButton(currentStep);
    }
  };
  // 診断結果ボタンを表示する処理
  const showResultButton = () => {
    const showResultButton = document.querySelector('.js-show-result');
    const answered = diagnosisItems[currentStep].closest('.l-diagnosis__answer-button.inactive');
      if (answered) {
        showResultButton.classList.add('active');
      }
    showResultButton.addEventListener('click', () => {
      diagnosisItems.forEach(item => item.classList.remove('active'));
      const resultItem = getResultElement();
      if (resultItem) {
        resultItem.classList.add('active');
      }
    });
  };
  // ポイントを更新する処理
  const updatePoints = (answerElement) => {
    ['immediate', 'finish', 'durability', 'sideEffects'].forEach(attr => {
      if (answerElement.dataset[attr]) {
        points[attr] += parseInt(answerElement.dataset[attr]);
      }
    });
  };
  // 未選択の回答にinactiveクラスを付与する処理
  const setInactiveAnswers = (answerElement) => {
    const answerButtons = answerElement.closest('.l-diagnosis__item').querySelectorAll('.l-diagnosis__answer-button');
    answerButtons.forEach(button => {
      if (button !== answerElement) {
        button.classList.add('inactive');
      } else {
        button.classList.remove('inactive');
      }
    });
  };
  // Nextボタンの表示/非表示を切り替える処理
  const toggleNextButton = (step) => {
    const currentQuestion = diagnosisItems[step];
    const nextButton = currentQuestion.querySelector('.l-diagnosis__next-button');
    const answered = currentQuestion.querySelector('.l-diagnosis__answer-button.inactive');
    if (answered) {
      nextButton.classList.add('active');
    } else {
      nextButton.classList.remove('active');
    }
  };
  // Prevボタンの表示/非表示を切り替える処理
  const togglePrevButton = (step) => {
    const prevButton = diagnosisItems[step].querySelector('.l-diagnosis__prev-button');
    if (prevButton) {
      prevButton.classList.add('active');
    }
  };
  // 各回答ボタンにイベントリスナーを追加
  const answerButtons = document.querySelectorAll('.l-diagnosis__answer-button');
  answerButtons.forEach(button => {
    button.addEventListener('click', handleAnswerClick);
  });
  // 各Prevボタンにイベントリスナーを追加
  const prevButtons = document.querySelectorAll('.l-diagnosis__prev-button');
  prevButtons.forEach(button => {
    button.addEventListener('click', showPrevQuestion);
  });
  // 各Nextボタンにイベントリスナーを追加
  const nextButtons = document.querySelectorAll('.l-diagnosis__next-button');
  nextButtons.forEach(button => {
    button.addEventListener('click', showNextQuestion);
  });
  // 結果を判定して表示する処理
  const getResultElement = () => {
    const { immediate, finish, durability, sideEffects } = points;
    console.log(points)
    if (finish + durability >= 5) {
      return document.getElementById('result03');
    } else if (sideEffects + finish <= 1) {
      return document.getElementById('result04');
    } else if (finish === 0 && sideEffects <= 2) {
      return document.getElementById('result02');
    } else if (immediate + sideEffects <= 2 && immediate <= 3 && sideEffects <= 3 && finish <= 3 && durability <= 3) {
      return document.getElementById('result02');
    } else {
      return document.getElementById('result01');
    }
  };

// ハンバーガーメニュー
  // ハンバーガーボタンのクリックイベント
  const hamburger = document.querySelector('.js-hamburger');
  const drawer = document.getElementById('js-drawer');
  const drawerCloseButton = document.querySelector('.js-drawer-close');
  // ドロワーメニュー表示
  const showDrawer = () => {
    drawer.setAttribute('data-active', 'true');
    drawer.showModal();
  };
  // ドロワーメニュー非表示
  const hideDrawer = () => {
    drawer.setAttribute('data-active', 'false');
    drawer.close();
  };
  hamburger.addEventListener('click', showDrawer);
  drawerCloseButton.addEventListener('click', hideDrawer);

// Swiper
  const beforeAfterSlider = new Swiper(".js-before-after-slider", {
    loop: true,
    slidesPerView: 2.75,
    speed: 6000,
    allowTouchMove: false,
    autoplay: {
      delay: 0,
    },
  });

  const voiceSlider = new Swiper(".js-voice-slider", {
    loop: true,
    slidesPerView: 1,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });

  const contentItems = document.querySelectorAll('.l-artist__desc');
  const artistSlider = new Swiper('.js-artist-slider', {
    loop: true,
    slidesPerView: 1.5,
    spaceBetween: 30,
    centeredSlides: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      slideChange: function () {
        // 全てのコンテンツを非表示にする
        contentItems.forEach(item => item.classList.remove('active'));
        // 現在のスライドに対応するコンテンツを表示する
        const activeIndex = this.realIndex + 1;
        document.getElementById(`artist-${activeIndex}`).classList.add('active');
      },
    },
  });
  // 初期表示のために最初のコンテンツをアクティブに設定
  document.getElementById('artist-1').classList.add('active');

// before-after
  const slider = document.querySelector('.l-experience__slider');
  const handle = document.querySelector('.l-experience__slider-handle');
  const before = document.querySelector('.l-experience__slider-image--before');
  const after = document.querySelector('.l-experience__slider-image--after');
  let isDragging = false;
  const startDragging = () => {
    isDragging = true;
  };
  const stopDragging = () => {
    isDragging = false;
  };
  const onDrag = (e) => {
    if (!isDragging) return;
    const sliderRect = slider.getBoundingClientRect();
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let offsetY = clientY - sliderRect.top;
    if (offsetY < 0) offsetY = 0;
    if (offsetY > sliderRect.height) offsetY = sliderRect.height;
    handle.style.top = `${offsetY}px`;
    before.style.clip = `rect(0, ${sliderRect.width}px, ${offsetY}px, 0)`;
    after.style.clip = `rect(${offsetY}px, ${sliderRect.width}px, ${sliderRect.height}px, 0)`;
  };
  handle.addEventListener('mousedown', startDragging);
  handle.addEventListener('touchstart', startDragging);
  window.addEventListener('mouseup', stopDragging);
  window.addEventListener('touchend', stopDragging);
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('touchmove', onDrag);
  // クリック促進アイコン
  const iconPointer = document.querySelector('.l-experience__slider-handle');
  if (iconPointer) {
    const hideIcon = () => {
      iconPointer.classList.add('hidden');
    };
    iconPointer.addEventListener('click', hideIcon);
    iconPointer.addEventListener('touchstart', hideIcon);
    iconPointer.addEventListener('mousedown', hideIcon);
  }

// 施術部位タブ切り替え
  // const tabs = document.querySelectorAll('.l-parts__tab-button');
  // const contents = document.querySelectorAll('.l-parts__tab-content');
  // tabs.forEach(tab => {
  //   tab.addEventListener('click', (elem) => {
  //     tabs.forEach(t => {
  //       t.classList.remove('active');
  //     });
  //     tab.classList.add('active');
  //     const contentId = tab.dataset.tab;
  //     const contentToShow = document.getElementById(contentId);
  //     // すべてのコンテンツを非表示にする
  //     contents.forEach(content => {
  //       content.classList.remove('active');
  //     });
  //     // クリックされたタブに関連するコンテンツを表示する
  //     contentToShow.classList.add('active');
  //   });
  // });
});
