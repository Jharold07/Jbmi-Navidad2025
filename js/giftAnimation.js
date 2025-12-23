(function () {
  const giftBtn = document.getElementById("giftBtn");
  const giftImg = document.getElementById("giftImg");

  let opened = false;

  window.GiftAnimation = {
    isOpened() { return opened; },
    reset() {
      opened = false;
      if (!giftBtn || !giftImg) return;
      gsap.killTweensOf([giftBtn, giftImg]);
      gsap.set(giftBtn, { rotation: 0, scale: 1 });
      gsap.set(giftImg, { rotation: 0, scale: 1, opacity: 1, y: 0 });
    },
    open(onDone) {
      if (opened || !giftBtn || !giftImg) return;
      opened = true;

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  
      tl.to(giftBtn, { duration: 0.12, scale: 1.06, ease: "power1.out" })
        .to(giftBtn, { duration: 0.22, scale: 0.98, ease: "bounce.out" })
        .to(giftBtn, { duration: 0.18, scale: 1.02, ease: "power2.out" })     
        .to(giftImg, { duration: 0.22, rotation: -6, y: -6 }, "<")
        .to(giftImg, { duration: 0.28, scale: 1.12, rotation: 10, y: -14 }, "<0.05")
        .to(giftImg, { duration: 0.18, opacity: 0 }, "<0.12")

        .call(() => { if (typeof onDone === "function") onDone(); });

      return tl;
    }
  };

  window.GiftAnimation.reset();
})();
