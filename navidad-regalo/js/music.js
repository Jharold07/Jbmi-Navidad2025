(function(){
  const btn = document.getElementById("btnMusic");
  const music = document.getElementById("audioMusic");

  let enabled = false;

  function setState(next){
    enabled = next;
    btn.setAttribute("aria-pressed", String(enabled));
    btn.textContent = enabled ? "Pausar música 🔇" : "Activar música 🔊";
  }

  async function toggle(){
    try{
      if(!enabled){
        await music.play();
        setState(true);
      }else{
        music.pause();
        setState(false);
      }
    }catch(e){
      // algunos navegadores bloquean autoplay; esto se activa por click, así que debería ir.
      console.warn("No se pudo reproducir música:", e);
    }
  }

  window.Music = {
    toggle,
    stop(){ try{ music.pause(); music.currentTime = 0; setState(false);}catch(_){} },
    isOn(){ return enabled; }
  };

  if(btn) btn.addEventListener("click", toggle);
  setState(false);
})();
