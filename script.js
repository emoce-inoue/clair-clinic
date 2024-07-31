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
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
      }
    });
  };
  // 共通のオプションとオブザーバー
  const defaultObserverOptions = {
    threshold: 0.1
  };
  const defaultObserver = new IntersectionObserver(observerCallback, defaultObserverOptions);
  // .js-scaling用のオプションとオブザーバー
  const scalingObserverOptions = {
    threshold: 1
  };
  const scalingObserver = new IntersectionObserver(observerCallback, scalingObserverOptions);
  // ターゲット要素を取得して、それぞれのオブザーバーに登録
  const targetElements = document.querySelectorAll('.js-fade, .js-fadeUp, .js-scaling, .js-bounce, .js-shine');
  targetElements.forEach(target => {
    if (target.classList.contains('js-scaling')) {
      scalingObserver.observe(target);
    } else {
      defaultObserver.observe(target);
    }
  });

// 診断コンテンツ
  const startButton = document.querySelector('.js-diagnosis-prepared .js-start-button');
  const diagnosisItems = document.querySelectorAll('.js-diagnosis-prepared .l-diagnosis__item');
  let currentStep = 0;
  const points = {
    immediate: 0,
    finish: 0,
    durability: 0,
    sideEffects: 0
  };
  // 初期表示設定（スタートボタン）
  if (startButton) {
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
  }
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
    const showResultButton = document.querySelector('.js-diagnosis-prepared .js-show-result');
    const answered = diagnosisItems[currentStep].querySelector('.l-diagnosis__answer-button.inactive');
    if (answered) {
      showResultButton.classList.add('active');
    }
    if (showResultButton) {
      showResultButton.addEventListener('click', () => {
        diagnosisItems.forEach(item => item.classList.remove('active'));
        const resultItem = getResultElement();
        if (resultItem) {
          resultItem.classList.add('active');
        }
      });
    }
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
    if (nextButton) {
      const answered = currentQuestion.querySelector('.l-diagnosis__answer-button.inactive');
      if (answered) {
        nextButton.classList.add('active');
      } else {
        nextButton.classList.remove('active');
      }
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
  const answerButtons = document.querySelectorAll('.js-diagnosis-prepared .l-diagnosis__answer-button');
  answerButtons.forEach(button => {
    button.addEventListener('click', handleAnswerClick);
  });
  // 各Prevボタンにイベントリスナーを追加
  const prevButtons = document.querySelectorAll('.js-diagnosis-prepared .l-diagnosis__prev-button');
  prevButtons.forEach(button => {
    button.addEventListener('click', showPrevQuestion);
  });
  // 各Nextボタンにイベントリスナーを追加
  const nextButtons = document.querySelectorAll('.js-diagnosis-prepared .l-diagnosis__next-button');
  nextButtons.forEach(button => {
    button.addEventListener('click', showNextQuestion);
  });
  // 結果を判定して表示する処理
  const getResultElement = () => {
    const { immediate, finish, durability, sideEffects } = points;
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

  // モーダル用の診断コンテンツの初期化
  const modalTriggers = document.querySelectorAll('.js-diagnosis-modal-trigger');
  const modalOverlay = document.querySelector('.js-modal-overlay');
  const modalClose = document.querySelectorAll('.js-modal-close');
  const diagnosisItemsModal = document.querySelectorAll('.js-diagnosis-modal .l-diagnosis__item');
  let modalCurrentStep = 0;
  const modalPoints = {
    immediate: 0,
    finish: 0,
    durability: 0,
    sideEffects: 0
  };
  const initializeModalDiagnosis = () => {
    const startDiagnosisModal = (startStep) => {
      diagnosisItemsModal.forEach((item, index) => {
        if (index === startStep) {
          item.classList.add('active');
          modalCurrentStep = startStep;
        } else {
          item.classList.remove('active');
        }
      });
      togglePrevButtonModal(modalCurrentStep);
      toggleNextButtonModal(modalCurrentStep);
    };

    const handleAnswerClickModal = (event) => {
      const answerElement = event.target.closest('.l-diagnosis__answer-button');
      if (answerElement) {
        updatePointsModal(answerElement);
        setInactiveAnswersModal(answerElement);
        toggleNextButtonModal(modalCurrentStep);
        if (modalCurrentStep < 5) {
          showNextQuestionModal();
        }
        if (modalCurrentStep === 5) {
          showResultButtonModal();
        }
      }
    };

    const showNextQuestionModal = () => {
      if (modalCurrentStep < 5) {
        diagnosisItemsModal[modalCurrentStep].classList.remove('active');
        modalCurrentStep++;
        diagnosisItemsModal[modalCurrentStep].classList.add('active');
        togglePrevButtonModal(modalCurrentStep);
        toggleNextButtonModal(modalCurrentStep);
      }
    };

    const showPrevQuestionModal = () => {
      if (modalCurrentStep > 0) {
        diagnosisItemsModal[modalCurrentStep].classList.remove('active');
        modalCurrentStep--;
        diagnosisItemsModal[modalCurrentStep].classList.add('active');
        togglePrevButtonModal(modalCurrentStep);
        toggleNextButtonModal(modalCurrentStep);
      }
    };

    const showResultButtonModal = () => {
      const showResultButton = document.querySelector('.js-diagnosis-modal .js-show-result');
      const answered = diagnosisItemsModal[modalCurrentStep].querySelector('.l-diagnosis__answer-button.inactive');
      if (answered) {
        showResultButton.classList.add('active');
      }
      if (showResultButton) {
        showResultButton.addEventListener('click', () => {
          diagnosisItemsModal.forEach(item => item.classList.remove('active'));
          const resultItem = getResultElementModal();
          if (resultItem) {
            resultItem.classList.add('active');
          }
        });
      }
    };

    const updatePointsModal = (answerElement) => {
      ['immediate', 'finish', 'durability', 'sideEffects'].forEach(attr => {
        if (answerElement.dataset[attr]) {
          modalPoints[attr] += parseInt(answerElement.dataset[attr]);
        }
      });
    };

    const setInactiveAnswersModal = (answerElement) => {
      const answerButtons = answerElement.closest('.l-diagnosis__item').querySelectorAll('.l-diagnosis__answer-button');
      answerButtons.forEach(button => {
        if (button !== answerElement) {
          button.classList.add('inactive');
        } else {
          button.classList.remove('inactive');
        }
      });
    };

    const toggleNextButtonModal = (step) => {
      const currentQuestion = diagnosisItemsModal[step];
      const nextButton = currentQuestion.querySelector('.l-diagnosis__next-button');
      if (nextButton) {
        const answered = currentQuestion.querySelector('.l-diagnosis__answer-button.inactive');
        if (answered) {
          nextButton.classList.add('active');
        } else {
          nextButton.classList.remove('active');
        }
      }
    };

    const togglePrevButtonModal = (step) => {
      const prevButton = diagnosisItemsModal[step].querySelector('.l-diagnosis__prev-button');
      if (prevButton) {
        prevButton.classList.add('active');
      }
    };

    const addAnswerEventListenersModal = () => {
      diagnosisItemsModal.forEach(item => {
        const answerButtons = item.querySelectorAll('.l-diagnosis__answer-button');
        answerButtons.forEach(button => {
          button.addEventListener('click', handleAnswerClickModal);
        });
        const prevButtons = item.querySelectorAll('.l-diagnosis__prev-button');
        prevButtons.forEach(button => {
          button.addEventListener('click', showPrevQuestionModal);
        });
        const nextButtons = item.querySelectorAll('.l-diagnosis__next-button');
        nextButtons.forEach(button => {
          button.addEventListener('click', showNextQuestionModal);
        });
      });
    };

    const getResultElementModal = () => {
      const { immediate, finish, durability, sideEffects } = modalPoints;
      if (finish + durability >= 5) {
        return document.getElementById('modalResult03');
      } else if (sideEffects + finish <= 1) {
        return document.getElementById('modalResult04');
      } else if (finish === 0 && sideEffects <= 2) {
        return document.getElementById('modalResult02');
      } else if (immediate + sideEffects <= 2 && immediate <= 3 && sideEffects <= 3 && finish <= 3 && durability <= 3) {
        return document.getElementById('modalResult02');
      } else {
        return document.getElementById('modalResult01');
      }
    };
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        modalOverlay.style.display = 'flex';
        startDiagnosisModal(0);
      });
    });
    if (modalClose) {
      modalClose.forEach(trigger => {
        trigger.addEventListener('click', () => {
          modalOverlay.style.display = 'none';
        });
      });
    }
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
          modalOverlay.style.display = 'none';
        }
      });
    }
    addAnswerEventListenersModal();
  };
  initializeModalDiagnosis();

// ハンバーガーメニュー
  // ハンバーガーボタンのクリックイベント
  const hamburger = document.querySelector('.js-hamburger');
  const drawer = document.getElementById('js-drawer');
  const drawerCloseButton = document.querySelector('.js-drawer-close');
  const showDrawer = () => {
    if (drawer.open) {
      drawer.close();
    }
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
    loopAdditionalSlides: 4,
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
  const startDragging = (e) => {
    e.preventDefault();
    isDragging = true;
  };
  const stopDragging = () => {
    isDragging = false;
  };
  const onDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
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
  handle.addEventListener('touchstart', startDragging, { passive: false });
  window.addEventListener('mouseup', stopDragging);
  window.addEventListener('touchend', stopDragging);
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('touchmove', onDrag, { passive: false });
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

// カウントアップのアニメーション
  const targetElem = document.querySelector('.js-count-number');
  const from = 0;
  const to = 5000;
  const duration = 1000;
  const startCountUp = () => {
    const startTime = performance.now();
    const countUp = () => {
      const elapsed = performance.now() - startTime;
      const countValue = from + ((elapsed / duration) * (to - from));
      if (elapsed >= duration) {
        targetElem.innerText = to.toLocaleString();
      } else {
        targetElem.innerText = Math.floor(countValue).toLocaleString();
        requestAnimationFrame(countUp);
      }
    };
    requestAnimationFrame(countUp);
  };
  const countUpObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCountUp();
        countUpObserver.unobserve(entry.target); // 一度カウントアップを開始したら監視を停止する
      }
    });
  });
  countUpObserver.observe(targetElem);

// 施術部位タブ切り替え
  const tabs = document.querySelectorAll('.l-parts__tab-button');
  const contents = document.querySelectorAll('.l-parts__tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
      });
      tab.classList.add('active');

      const contentId = tab.dataset.tab;
      const contentToShow = document.getElementById(contentId);
      contents.forEach(content => {
        content.classList.remove('active');
      });
      contentToShow.classList.add('active');
    });
  });

//スムーススクロール
  const header = document.querySelector('.l-header');
  const headerHeight = header.offsetHeight;
  const links = document.querySelectorAll('.scroll-link');
  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      // ページトップへのリンクの場合
      if (targetId === "") {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }

      const targetElement = document.getElementById(targetId);
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

});
