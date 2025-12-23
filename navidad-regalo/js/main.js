(function(){
  const screens = {
    intro: document.getElementById("screen-intro"),
    gift: document.getElementById("screen-gift"),
    final: document.getElementById("screen-final"),
  };

  const btnStart = document.getElementById("btnStart");
  const btnBack = document.getElementById("btnBack");
  const giftBtn = document.getElementById("giftBtn");
  const btnReplay = document.getElementById("btnReplay");

  const audioOpen = document.getElementById("audioOpen");


  const btnShare = document.getElementById("btnShare");
  const shareCard = document.getElementById("shareCard");
  const finalMsg = document.getElementById("finalMsg");

  function show(name){
    Object.values(screens).forEach(s => s.classList.remove("is-active"));
    screens[name].classList.add("is-active");
  }

  function openGift(){
    try{
      audioOpen.currentTime = 0;
      audioOpen.play().catch(()=>{});
    }catch(_){}

    window.GiftAnimation.open(() => {
      show("final");
      window.Fireworks.start();

      window.Fireworks.burst(window.innerWidth*0.5, window.innerHeight*0.35);
    });
  }

  async function createShareImage(){
    if(!shareCard) throw new Error("No existe #shareCard en el HTML");

    const canvas = await html2canvas(shareCard, {
      backgroundColor: "#0b3d2e", 
      scale: 2,                  
      useCORS: true
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png", 1);
    });
  }

  async function shareToWhatsApp(){
    try{
      const blob = await createShareImage();
      const file = new File([blob], "feliz-navidad.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Feliz Navidad 🎄",
          text: "Mi amor ❤️ te hice un regalito. ¡Feliz Navidad! 🎁✨",
          files: [file],
        });
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "feliz-navidad.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      const text = encodeURIComponent("Mi amor ❤️ te hice un regalito. Sube la imagen a tu estado 😘🎄");
      window.open(`https://wa.me/?text=${text}`, "_blank");

      alert("✅ Imagen descargada.\nAhora ve a WhatsApp > Estado > Galería y selecciona la imagen.");
    }catch(e){
      console.error(e);
      alert("No se pudo generar/compartir la imagen. Revisa que html2canvas esté cargando.");
    }
  }

  btnStart.addEventListener("click", () => {
    show("gift");
    window.Fireworks.stop();
    window.GiftAnimation.reset();
  });

  btnBack.addEventListener("click", () => {
    show("intro");
    window.Fireworks.stop();
    window.GiftAnimation.reset();
  });

  giftBtn.addEventListener("click", () => {
    if(window.GiftAnimation.isOpened()) return;
    openGift();
  });

  btnReplay.addEventListener("click", () => {
    window.Fireworks.stop();
    window.GiftAnimation.reset();
    show("gift");
  });

  if(btnShare){
    btnShare.addEventListener("click", shareToWhatsApp);
  }

  document.addEventListener("click", (e) => {
    if(screens.final.classList.contains("is-active")){
      window.Fireworks.burst(e.clientX, e.clientY);
    }
  });

  show("intro");
})();
